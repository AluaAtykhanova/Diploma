//queries/userQuery.js
const pool = require("../dbPool.js");

const getUserBanStatus = async (userId) => {
    const query = await pool.query(`SELECT is_banned FROM user_warnings WHERE user_id = $1`, [userId]);
    return query;
};

const getUser = async (userId) => {
    const query = await pool.query(`SELECT * FROM user_warnings WHERE user_id = $1`, [userId]);
    return query;
};

const addUser = async (userId) => {
    const query = await pool.query(`INSERT INTO user_warnings (user_id) VALUES ($1)`, [userId]);
    return query;
};

const addWarningsByUserId = async (messageId,warning,text,userId, countWarnings) => {
    const query = await pool.query(`
    WITH current_warning AS (
        SELECT warning
        FROM user_warnings
        WHERE user_id = $1
    ),
    new_warning AS (
        SELECT jsonb_build_array(
            jsonb_build_object(
                'id', jsonb_array_length(current_warning.warning),
                'message_id', $2::INTEGER,
                'warning', $3::TEXT,
                'message', $4::TEXT
            )
        ) AS warning_to_add
        FROM current_warning
    )
    UPDATE user_warnings
    SET warning = warning || nw.warning_to_add,
        is_banned = jsonb_array_length(warning || nw.warning_to_add) > $5
    FROM new_warning nw
    WHERE user_id = $1
    RETURNING jsonb_array_length(warning) AS count, is_banned;
`, [userId, messageId, warning, text, countWarnings-1]);

    return query;
};

module.exports = { getUserBanStatus, getUser, addUser, addWarningsByUserId};