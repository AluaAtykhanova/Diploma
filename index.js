//index.js
const dotenv = require('dotenv');
const { startBot } = require ("./bot/bot.js");
const { initializeDB } = require ("./bot/dbPool.js");

dotenv.config();

(async () => {
    await initializeDB(); // Инициализация подключения к базе данных
    startBot();           // Запуск бота
})();
