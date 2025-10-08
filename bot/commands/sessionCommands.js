//bot/commands/sessionCommands.js
const { INITIAL_SESSION } = require ('../config.js');

const startNewSession = async (ctx) => {
    ctx.session = INITIAL_SESSION;
    await ctx.reply("Привет! Я - Аяу, твоя менторка в дебатах. Жду твой запрос!");
};

module.exports = { startNewSession };