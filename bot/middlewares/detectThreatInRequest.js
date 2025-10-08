//bot/handlers/messageHandler.js
const { analyzeRequest } = require ('../utils/aiClient.js');
const { MAX_MESSAGES, COUNT_WARNINGS, REQUEST_ANALYSIS } = require ('../config.js');
const { logSecure, logError } = require ('../utils/logger.js');
const { handleMessage } = require ('../handlers/messageHandler.js');
const { addWarningsByUserId } = require ('../controllers/warning.js');
const { sendMessage } = require ('../middlewares/sendMessage.js');

const detectThreatInRequest = async (ctx, messageText, messageId) => {
    try {
        let last = REQUEST_ANALYSIS;

        if (ctx.session.messages.length > MAX_MESSAGES) {
            last.messages = [
                last.messages[0],
                ...last.messages.slice(-MAX_MESSAGES),
            ];
        }

        last.messages.push({ role: "user", content: messageText });

        const response = await analyzeRequest(last.messages);
        logSecure(`User message: ${messageText}`);
        logSecure(`detectThreatInRequest response: ${response}`);

        if (response.startsWith('True')) {
            const { count, is_banned } = await addWarningsByUserId(ctx, ctx.message.message_id, response, messageText, ctx.message.from.id,COUNT_WARNINGS);

            if (is_banned) {
                return await sendMessage(ctx, `Извините, теперь Вы в нашем стоп листе`, messageId);
            } else {
                return await sendMessage(ctx, `Предупреждение №${count}/${COUNT_WARNINGS}: ${response}`, messageId);
            }
        }
        await sendMessage(ctx, "✅ Ваш запрос обрабатывается...", messageId);
        await handleMessage(ctx, messageText, messageId);
    } catch (error) {
        logError(`Error processing message(detectThreatInRequest.js): ${error.message}`);
        await sendMessage(ctx, "Произошла ошибка. Попробуй снова.", messageId);
    }
};

module.exports = { detectThreatInRequest };