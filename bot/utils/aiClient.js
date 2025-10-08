// bot/utils/aiClient.js
const OpenAI = require('openai');
const dotenv = require('dotenv');
const {responseFilter} = require ('../prompts/responseFilter.js')

dotenv.config();

const openaiInstances = {
    analysis: new OpenAI({ apiKey: process.env.OPENAI_API_KEY_1 }),  // Анализ угроз
    fineTuned: new OpenAI({ apiKey: process.env.OPENAI_API_KEY_2 }), // Fine-tuned модель
};

const analyzeRequest = async (messages) => {
    try {
        const response = await openaiInstances.analysis.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages,
        });

        const result = response.choices[0].message.content;
        return result;
    } catch (error) {
        console.error("❌ Ошибка в `analyzeRequest`:", error.message);
        throw error;
    }
};

const generateChatResponse = async (messages) => {
    try {
        const response = await openaiInstances.analysis.chat.completions.create({
            model: process.env.FINE_TUNED_MODEL,  // Используем fine-tuned модель
            messages,
        });

        const result = response.choices[0].message.content;

        return result;
    } catch (error) {
        console.error("❌ Ошибка в `generateChatResponse`:", error.message);
        throw error;
    }
};

const analyzeResponse = async (messages) => {
    try {
        const response = await openaiInstances.analysis.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: responseFilter.instruction },
                ...messages,
            ],
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("❌ Ошибка в `analyzeResponse`:", error.message);
        throw error;
    }
};

module.exports = { generateChatResponse, analyzeRequest, analyzeResponse };