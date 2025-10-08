//controllers/warning.js
const userQuery = require("../queries/userQuery");
const { logError } = require ('../utils/logger.js');

const getUserBanStatus = async (ctx,userId) => {
    try {
        const query = await userQuery.getUserBanStatus(userId);

        return query.rows.length > 0 ? query.rows[0].is_banned : false;
    } catch (error) {
        logError(`Error processing message(warning.js): ${error.message}`);
        await ctx.reply("Произошла ошибка. Попробуй снова.");
    }
};

const addUser = async (ctx,userId) => {
    try {
        const check = await userQuery.getUser(userId);
        if (check.rows.length === 0) {
            const query = await userQuery.addUser(userId);

            return query.rows;
		}
    } catch (error) {
        await ctx.reply("Произошла ошибка. Попробуй снова.");
        logError(`Error processing message(warning.js): ${error.message}`);
    }
};

const addWarningsByUserId = async (ctx,messageId,warning,text,userId,countWarnings) => {
    try {
        const query = await userQuery.addWarningsByUserId(messageId,warning,text,userId,countWarnings);

        return {
            count: query.rows[0].count, 
            is_banned: query.rows[0].is_banned 
        };
    } catch (error) {
        logError(`Error processing message(warning.js): ${error.message}`);
        await ctx.reply("Произошла ошибка. Попробуй снова.");
    }
};

module.exports = { getUserBanStatus, addUser, addWarningsByUserId };