//bot/bot.js 
const { Telegraf, session } = require ("telegraf");
const { INITIAL_SESSION } = require ('./config.js');
const { startNewSession } = require ('./commands/sessionCommands.js');
const { receiveMessage, processQueue } = require ('./middlewares/receiveMessage.js');
const { sendMessage, processSendQueue,processWaitQueue } = require ('./middlewares/sendMessage.js');
const { detectThreatInRequest } = require ('./middlewares/detectThreatInRequest.js');
const { addUser,getUserBanStatus } = require ('./controllers/warning.js');

const BOT_TOKEN = process.env.TELEGRAM_TOKEN;

const startBot = () => {
    const bot = new Telegraf(BOT_TOKEN); 

    bot.use(session());

    bot.command('start', async (ctx) => await startNewSession(ctx));
    bot.command('new', async (ctx) => await startNewSession(ctx));

    bot.on('text', async (ctx) => {
        try {
            ctx.session ??= INITIAL_SESSION;
            const messageText = ctx.message.text;

            const userId = ctx.message.from.id;

            await addUser(ctx, userId);
            const is_banned = await getUserBanStatus(ctx, userId);
    
            if (is_banned) {
                return await sendMessage(ctx, "Извините, Вы в нашем стоп листе", ctx.update.update?.processingMessageId ?? null);
            }

            await receiveMessage(ctx, async () => {
                const statusMessage = await sendMessage(ctx, "Сообщение получено. Обрабатываю...", ctx.update.update?.processingMessageId ?? null);

                if (!statusMessage || !statusMessage.message_id) {
                    console.warn("Сообщение не отправлено. Прерываем обработку.");
                    return;
                }

                await detectThreatInRequest(ctx, messageText, statusMessage.message_id);
            });
        } catch (error) {
            console.error("Ошибка в bot.on('text'):", error.message || error);
        }
    });

    bot.launch();

    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));

    processQueue();
    processSendQueue();
    processWaitQueue();
};

module.exports = { startBot };