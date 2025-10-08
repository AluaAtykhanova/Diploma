require('dotenv').config();
const OpenAI = require('openai');
//node .\bot\utils\ai\checkFineTune.js
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY_2,
});

// Вставь свой job_id сюда!
const JOB_ID = process.env.JOB_ID;

async function checkFineTune() {
    try {
        const response = await openai.fineTuning.jobs.retrieve(JOB_ID);
        console.log("📊 Статус fine-tuning:", response.status);
        console.log("🆔 Обученная модель:", response.fine_tuned_model);
    } catch (error) {
        console.error("❌ Ошибка при проверке статуса:", error);
    }
}

checkFineTune();
