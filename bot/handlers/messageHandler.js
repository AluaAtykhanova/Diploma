const { generateChatResponse, analyzeResponse }  = require ('../utils/aiClient.js');
const { MAX_MESSAGES }  = require ('../config.js');
const { logInfo, logError, logSecure }  = require ('../utils/logger.js');
const { sendMessage } = require ('../middlewares/sendMessage.js');

const handleMessage = async (ctx, messageText, messageId = null) => {
    try {
        ctx.session ??= { messages: [] };

        if (ctx.session.messages.length > MAX_MESSAGES) {
            ctx.session.messages = [
                ctx.session.messages[0],
                ...ctx.session.messages.slice(-MAX_MESSAGES),
            ];
        }

        ctx.session.messages.push({ role: "user", content: messageText });
        logInfo(`User message: ${messageText}`);

        const response = await generateChatResponse(ctx.session.messages);
        ctx.session.messages.push({ role: "assistant", content: response });
        
        const moderationCheck = await analyzeResponse(ctx.session.messages);

        if (moderationCheck.startsWith("True")) {
            const cleaned = moderationCheck.replace(/^True\.\s*/, '');
            const warningMsg = `⚠️ Ответ ИИ признан некорректным: ${cleaned}`;
            ctx.session.messages.pop();
            await sendMessage(ctx, warningMsg, messageId);
            logSecure(`Moderation result: ${moderationCheck}`);
            logInfo(`❌ Забракованный ответ: ${response}`);
            logSecure(`❌ Забракованный ответ: ${response}`);
        } else {
            await sendMessage(ctx, response, messageId);
            logSecure(`Moderation result: ${moderationCheck}`);
            logInfo(`✅ Ответ отправлен: ${response}`);
            logSecure(`✅ Ответ отправлен: ${response}`);
        }

        await sendMessage(ctx, response, messageId);

    } catch (error) {
        logError(`Error processing message(messageHandler.js): ${error.message}`);
        await sendMessage(ctx, "Произошла ошибка. Попробуй снова.", messageId);
    }
};


module.exports = { handleMessage };