// bot/middlewares/sendMessage.js
const { LIMITS, INTERVALS } = require('../config.js');
const { logQueue } = require('../utils/logger');

const SEND_LIMIT_GLOBAL = LIMITS.LIMIT_GLOBAL * 2;
const WAIT_LIMIT_GLOBAL = LIMITS.LIMIT_GLOBAL;
const RESET_INTERVAL = INTERVALS.RESET_INTERVAL;
const CHECK_QUEUE_INTERVAL = INTERVALS.CHECK_QUEUE_INTERVAL;
let globalSendCount = 0;
const sendQueue = [];
const waitQueue = [];

const sendMessage = async (ctx, text, messageId = null) => {
    if (globalSendCount >= SEND_LIMIT_GLOBAL || sendQueue.length > 0 || waitQueue.length > 0) {
        return new Promise((resolve) => {
            if (text === "⏳ Очередь обработки. Пожалуйста, подождите...") {
                waitQueue.push({ ctx, text, resolve });
            } else {
                sendQueue.push({ ctx, text, messageId, resolve });
            }
            logQueue(`Сообщение в очередь: ${text}`);
        })
    }else{
        try {
            globalSendCount++;
            if (messageId) {
                return await ctx.telegram.editMessageText(ctx.chat.id, messageId, undefined,text);
            } else {
                return await ctx.reply(text);
            }
        } catch (error) {
            console.error("Ошибка при отправке сообщения:", error.message);
        }
    } 
};

const processSendQueue = async () => {
    setInterval(async () => {
        if (sendQueue.length > 0 && globalSendCount < SEND_LIMIT_GLOBAL) {
            const { ctx, text, messageId, resolve } = sendQueue.shift();

            globalSendCount++;
            try {
                let msg;
                if (messageId) {
                    msg = await ctx.telegram.editMessageText(ctx.chat.id, messageId, undefined,text);
                } else {
                    msg = await ctx.reply(text);
                }

                resolve(msg); // ✅ передаём результат обратно
            } catch (error) {
                console.error("Ошибка при отправке из очереди:", error.message);
                resolve(null); // тоже резолвим, чтобы не завис
            }
        }
    }, CHECK_QUEUE_INTERVAL); // Используем правильный интервал (не RESET_INTERVAL)
};

const processWaitQueue = async () => {
    setInterval(async () => {
        if (waitQueue.length > 0 && globalSendCount < WAIT_LIMIT_GLOBAL) {
            const { ctx, text, resolve } = waitQueue.shift();

            globalSendCount++;
            try {
                let msg = await ctx.reply(text);

                resolve(msg);
            } catch (error) {
                console.error("Ошибка при отправке из очереди:", error.message);
                resolve(null);
            }
        }
    }, CHECK_QUEUE_INTERVAL);
};

// сброс лимита каждую минуту
setInterval(() => {
    globalSendCount = 0;
}, RESET_INTERVAL);

module.exports = { sendMessage, processSendQueue,processWaitQueue };
