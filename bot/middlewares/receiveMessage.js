// bot/middlewares/receiveMessage.js
const { LIMITS, INTERVALS } = require('../config.js');
const { logQueue } = require('../utils/logger.js');
const { sendMessage } = require ('./sendMessage.js');

const MESSAGE_LIMIT_GLOBAL = LIMITS.LIMIT_GLOBAL; // Максимальное количество принимаемых сообщений в минуту
const RESET_INTERVAL = INTERVALS.RESET_INTERVAL; // Сброс лимита
const CHECK_QUEUE_INTERVAL = INTERVALS.CHECK_QUEUE_INTERVAL; // Интервал обработки очереди

let globalMessageCount = 0; // Счетчик входящих сообщений
const messageQueue = []; // Очередь входящих сообщений

setInterval(() => {
    globalMessageCount = 0;
}, RESET_INTERVAL);

const receiveMessage = async (ctx, callback) => {
    if (globalMessageCount >= MESSAGE_LIMIT_GLOBAL) {
        const waitMessage = await sendMessage(ctx, "⏳ Очередь обработки. Пожалуйста, подождите...");
        const messageId = waitMessage?.message_id ?? null;

        return new Promise((resolve) => {
            messageQueue.push({ ctx, callback, messageId, resolve });
            logQueue(`Сообщение от ${ctx.message.from.id} добавлено в очередь. Длина очереди: ${messageQueue.length}`);
        })
    } else {
        globalMessageCount++;
        await callback();
    }
};

// Обработчик очереди входящих сообщений
const processQueue = async () => {
    setInterval(async () => {
        if (messageQueue.length > 0 && globalMessageCount < MESSAGE_LIMIT_GLOBAL) {
            const { ctx, callback, messageId, resolve } = messageQueue.shift();

            globalMessageCount++;
            ctx.update.update = { processingMessageId: messageId };
            try {
                await callback();//Продолжаем обработку
                resolve();
            } catch (err) {
                console.error("Ошибка при повторной обработке update:", err.message);
                resolve();
            }
        }
    }, CHECK_QUEUE_INTERVAL);
};

module.exports = { receiveMessage, processQueue};
