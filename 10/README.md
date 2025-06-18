# Product Filtering System

Консольное приложение для фильтрации продуктов с использованием OpenAI Function Calling.

## Требования

- Node.js 18+
- OpenAI API ключ

## Установка

1. Клонируйте репозиторий
2. Установите зависимости:
```bash
npm install
```
3. Создайте файл `.env` в корневой директории и добавьте ваш OpenAI API ключ:
```
OPENAI_API_KEY=your_api_key_here
```

## Запуск

```bash
npm start
```

## Использование

1. Запустите приложение
2. Введите ваш запрос на естественном языке, например:
   - "I need a smartphone under $800 with a great camera"
   - "Show me all electronics in stock with rating above 4.5"
   - "Find kitchen appliances under $200"

## Примеры

Примеры запросов и результатов можно найти в файле `sample_outputs.md` 