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
const functions = [{
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
    required: ["maxPrice", "minRating", "category", "inStock"]
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
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a product filtering assistant. Analyze user preferences and call the filterProducts function with appropriate parameters."
        },
        {
          role: "user",
          content: query
        }
      ],
      functions: functions,
      function_call: { name: "filterProducts" }
    });

    const functionCall = completion.choices[0].message.function_call;
    if (functionCall) {
      const params = JSON.parse(functionCall.arguments);
      const filteredProducts = await filterProducts(params);
      
      console.log('\nFiltered Products:');
      filteredProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - $${product.price}, Rating: ${product.rating}, ${product.in_stock ? 'In Stock' : 'Out of Stock'}`);
      });
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