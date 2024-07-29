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

module.exports = {
    getUserByToken
};