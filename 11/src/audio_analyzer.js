const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config();

class AudioAnalyzer {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async transcribeAudio(audioFilePath) {
        try {
            console.log('Начинаю транскрипцию аудио...');
            
            const transcription = await this.openai.audio.transcriptions.create({
                file: fs.createReadStream(audioFilePath),
                model: "whisper-1",
                response_format: "text"
            });

            console.log('Транскрипция завершена');
            return transcription;
        } catch (error) {
            console.error('Ошибка при транскрипции:', error.message);
            throw error;
        }
    }

    async generateSummary(transcription) {
        try {
            console.log('Генерирую краткое содержание...');
            
            const summary = await this.openai.chat.completions.create({
                model: "gpt-4.1-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert at creating concise and informative summaries. Create a summary of the text, highlighting the main ideas and key points."
                    },
                    {
                        role: "user",
                        content: `Create a summary of the following text:\n\n${transcription}`
                    }
                ],
                max_tokens: 500,
                temperature: 0.3
            });

            console.log('Краткое содержание создано');
            return summary.choices[0].message.content;
        } catch (error) {
            console.error('Ошибка при создании краткого содержания:', error.message);
            throw error;
        }
    }

    async generateAnalytics(transcription) {
        try {
            console.log('Генерирую аналитику...');
            
            const analytics = await this.openai.chat.completions.create({
                model: "gpt-4.1-mini",
                messages: [
                    {
                        role: "system",
                        content: `You are an expert at text analysis. Analyze the provided text and return a JSON object with the following data:
                        - word_count: total word count
                        - speaking_speed_wpm: speaking speed (words per minute, assuming average speed of 150 words per minute for audio around 8-10 minutes long)
                        - frequently_mentioned_topics: array of 3+ most frequently mentioned topics with mention count
                        
                        Return only valid JSON without additional text.`
                    },
                    {
                        role: "user",
                        content: `Analyze the following text and create JSON with analytics:\n\n${transcription}`
                    }
                ],
                max_tokens: 1000,
                temperature: 0.1
            });

            console.log('Аналитика создана');
            return JSON.parse(analytics.choices[0].message.content);
        } catch (error) {
            console.error('Ошибка при создании аналитики:', error.message);
            throw error;
        }
    }

    saveTranscription(transcription, outputDir) {
        const filename = `transcription.md`;
        const filepath = path.join(outputDir, filename);
        
        const content = `# Транскрипция аудио

**Дата создания:** ${new Date().toLocaleString('ru-RU')}

## Текст транскрипции

${transcription}
`;

        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Транскрипция сохранена в файл: ${filename}`);
        return filename;
    }

    saveSummary(summary, outputDir) {
        const filepath = path.join(outputDir, 'summary.md');
        
        const content = `# Краткое содержание

**Дата создания:** ${new Date().toLocaleString('ru-RU')}

## Резюме

${summary}
`;

        fs.writeFileSync(filepath, content, 'utf8');
        console.log('Краткое содержание сохранено в файл: summary.md');
    }

    saveAnalytics(analytics, outputDir) {
        const filepath = path.join(outputDir, 'analysis.json');
        
        fs.writeFileSync(filepath, JSON.stringify(analytics, null, 2), 'utf8');
        console.log('Аналитика сохранена в файл: analysis.json');
    }

    async analyzeAudio(audioFilePath) {
        try {
            // Создаем папку для результатов, если её нет
            const outputDir = path.join(path.dirname(audioFilePath), 'output');
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // Транскрипция
            const transcription = await this.transcribeAudio(audioFilePath);
            
            // Сохранение транскрипции
            this.saveTranscription(transcription, outputDir);
            
            // Генерация краткого содержания
            const summary = await this.generateSummary(transcription);
            this.saveSummary(summary, outputDir);
            
            // Генерация аналитики
            const analytics = await this.generateAnalytics(transcription);
            this.saveAnalytics(analytics, outputDir);

            // Вывод результатов в консоль
            console.log('\n=== РЕЗУЛЬТАТЫ АНАЛИЗА ===\n');
            console.log('📝 КРАТКОЕ СОДЕРЖАНИЕ:');
            console.log(summary);
            console.log('\n📊 АНАЛИТИКА:');
            console.log(JSON.stringify(analytics, null, 2));

            return {
                transcription,
                summary,
                analytics
            };
        } catch (error) {
            console.error('Ошибка при анализе аудио:', error.message);
            throw error;
        }
    }
}

module.exports = AudioAnalyzer; 