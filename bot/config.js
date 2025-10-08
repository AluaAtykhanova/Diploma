//bot/config.js
const {prompts} = require ('./prompts/prompts.js')
const {context} = require ('./prompts/requestFilter.js')
const {responseFilter} = require ('./prompts/responseFilter.js')

const INITIAL_SESSION = {
    messages: [
        { role: "system", content: prompts.instruction },
    ],
};

const REQUEST_ANALYSIS = {
    messages: [
        { role: "system", content: context.instruction },
    ],
};

const RESPONSE_ANALYSIS = {
    messages: [
        { role: "system", content: responseFilter.instruction },
    ],
};

const MAX_MESSAGES = 6; // Максимальное количество сохраняемых сообщений 

const LIMITS = {
    LIMIT_GLOBAL: 10,
};

const INTERVALS = {
    RESET_INTERVAL: 20_000,
    CHECK_QUEUE_INTERVAL: 2_000,
};

const COUNT_WARNINGS = 3

module.exports = {
    INITIAL_SESSION,
    REQUEST_ANALYSIS,
    RESPONSE_ANALYSIS,
    MAX_MESSAGES,
    LIMITS,
    INTERVALS,
    COUNT_WARNINGS,
};
