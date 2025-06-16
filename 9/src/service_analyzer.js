const OpenAI = require('openai');
const readline = require('readline-sync');
const fs = require('fs');
require('dotenv').config();

// Initialize OpenAI client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

function buildPrompt(serviceInput) {
    const example = `
Input: Spotify

Report:
## Brief History
Founded in 2006 in Sweden, Spotify launched publicly in 2008. It quickly became a leader in music streaming, expanding globally and going public in 2018.

## Target Audience
Music listeners, podcast fans, and creators worldwide.

## Core Features
- On-demand music streaming
- Curated playlists and recommendations
- Podcast streaming
- Offline listening

## Unique Selling Points
- Extensive music catalog
- Personalized recommendations
- Free ad-supported tier

## Business Model
Freemium: free ad-supported access, paid premium subscriptions.

## Tech Stack Insights
Uses cloud infrastructure, data analytics, and machine learning for recommendations; mobile and web apps.

## Perceived Strengths
- Large content library
- Strong brand recognition
- Cross-platform support

## Perceived Weaknesses
- Music licensing costs
- Limited features for free users
`;

    return `${example}

Input: ${serviceInput}

Report:
`;
}

async function analyzeService(serviceInput) {
    try {
        const response = await client.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a service analysis expert. Generate detailed, accurate reports about digital services and products."
                },
                {
                    role: "user",
                    content: buildPrompt(serviceInput)
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error calling OpenAI API:', error.message);
        process.exit(1);
    }
}

function saveReport(report, filename = 'service_report.md') {
    try {
        fs.writeFileSync(filename, report, 'utf8');
        console.log(`\nReport saved to ${filename}`);
    } catch (error) {
        console.error('Error saving report:', error.message);
    }
}

async function main() {
    console.log('Service Analyzer');
    console.log('===============');
    console.log('Enter a service name (e.g., Notion) or a description:');

    const serviceInput = readline.question('> ').trim();
    if (!serviceInput) {
        console.error('Error: Input cannot be empty');
        process.exit(1);
    }

    console.log('\nGenerating report...\n');
    const report = await analyzeService(serviceInput);
    console.log(report);

    const save = readline.question('\nSave report to file? (y/n): ').trim().toLowerCase();
    if (save === 'y') {
        saveReport(report);
    }
}

main().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
}); 