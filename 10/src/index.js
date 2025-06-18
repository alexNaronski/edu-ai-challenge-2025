import OpenAI from 'openai';
import dotenv from 'dotenv';
import readline from 'readline';
import { readFileSync } from 'fs';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Читаем датасет продуктов
const products = JSON.parse(readFileSync('./products.json', 'utf8'));

// Создаем интерфейс для чтения ввода
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Определяем схему функции для фильтрации
const tools = [{
  type: "function",
  function: {
    name: "filterProducts",
    description: "Filter products based on user preferences",
    parameters: {
      type: "object",
      properties: {
        maxPrice: {
          type: "number",
          description: "Maximum price of the product"
        },
        minRating: {
          type: "number",
          description: "Minimum rating of the product"
        },
        category: {
          type: "string",
          description: "Product category (Electronics, Fitness, Kitchen, Books, Clothing)"
        },
        inStock: {
          type: "boolean",
          description: "Whether the product should be in stock"
        }
      },
      required: ["maxPrice", "minRating", "category", "inStock"],
      additionalProperties: false
    },
    strict: true
  }
}];

async function filterProducts(params) {
  return products.filter(product => {
    if (params.maxPrice && product.price > params.maxPrice) return false;
    if (params.minRating && product.rating < params.minRating) return false;
    if (params.category && product.category !== params.category) return false;
    if (params.inStock !== undefined && product.in_stock !== params.inStock) return false;
    return true;
  });
}

async function processUserQuery(query) {
  try {
    const messages = [
      {
        role: "system",
        content: "You are a product filtering assistant. Analyze user preferences and call the filterProducts function with appropriate parameters."
      },
      {
        role: "user",
        content: query
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
      tools,
      store: true
    });

    const toolCalls = completion.choices[0].message.tool_calls;
    if (toolCalls) {
      for (const toolCall of toolCalls) {
        const args = JSON.parse(toolCall.function.arguments);
        const filteredProducts = await filterProducts(args);
        
        // Добавляем результат в сообщения
        messages.push(completion.choices[0].message);
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(filteredProducts)
        });
      }

      // Получаем финальный ответ
      const finalCompletion = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages,
        tools,
        store: true
      });

      // Выводим результаты
      console.log('\nFiltered Products:');
      console.log(finalCompletion.choices[0].message.content);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Основной цикл программы
console.log('Enter your product preferences (or "exit" to quit):');
rl.on('line', async (input) => {
  if (input.toLowerCase() === 'exit') {
    rl.close();
    return;
  }
  await processUserQuery(input);
  console.log('\nEnter another query (or "exit" to quit):');
}); 