require('dotenv').config();
const fs = require('fs');
const OpenAI = require('openai');
const dotenv = require('dotenv');
// node .\bot\utils\ai\addDataSet.js
dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY_2,
});
const filePath = process.env.FILE_PATH


async function addDataSet() {
    try {
        const response = await openai.files.create({
            file: fs.createReadStream(filePath),
            purpose: "fine-tune",
        });
        console.log("✅ Файл загружен! file_id:", response.id);
    } catch (error) {
        console.error("❌ Ошибка загрузки файла:", error);
    }
}

addDataSet();
