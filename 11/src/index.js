const path = require('path');
const AudioAnalyzer = require('./audio_analyzer');

async function main() {
    try {
        // Получаем путь к аудио файлу из аргументов командной строки или используем файл по умолчанию
        const audioFilePath = process.argv[2] || path.join(__dirname, '..', 'CAR0004.mp3');
        
        // Проверяем существование файла
        if (!require('fs').existsSync(audioFilePath)) {
            console.error('❌ Ошибка: Аудио файл не найден');
            console.log('Использование: node index.js [путь_к_аудио_файлу]');
            console.log('Пример: node index.js ./CAR0004.mp3');
            process.exit(1);
        }

        console.log('🎵 Анализатор аудио файлов');
        console.log('========================');
        console.log(`📁 Анализируемый файл: ${audioFilePath}`);
        console.log('');

        // Создаем экземпляр анализатора
        const analyzer = new AudioAnalyzer();
        
        // Запускаем анализ
        await analyzer.analyzeAudio(audioFilePath);
        
        console.log('\n✅ Анализ завершен успешно!');
        console.log('📂 Результаты сохранены в папке output/');
        
    } catch (error) {
        console.error('❌ Произошла ошибка:', error.message);
        
        if (error.message.includes('API key')) {
            console.log('\n💡 Убедитесь, что у вас настроен файл .env с вашим OpenAI API ключом:');
            console.log('OPENAI_API_KEY=your_api_key_here');
        }
        
        process.exit(1);
    }
}

// Запускаем приложение
if (require.main === module) {
    main();
} 