const MySQL = require('./db/Mysql');

async function getUserByToken(token) {
    const db = new MySQL();
    await db.connect();

    const user = await db.table("tblUsers")
        .select("userAccessToken", "userRefreshToken", "userEmail")
        .where("userAccessToken", token)
        .first();

    await db.disconnect();
    return user;
}

/**
 * Encodes data to base64 format.
 * @param {string} data - The data to be encoded.
 * @returns {string} - The base64 encoded string.
 */
function base64Encode(data) {
    // Create a buffer from the input data and encode it to base64
    return Buffer.from(data).toString('base64');
}

module.exports = {
    getUserByToken,
    base64Encode
};