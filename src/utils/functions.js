const MySQL = require('./db/Mysql');

async function getUserByToken(token) {
    const db = new MySQL();
    await db.connect();

    const user = await db.table("tblUsers")
        .select("userAccessToken", "userRefreshToken", "userEmail")
        .where("userAccessToken", token)
        .get();

    await db.disconnect();
    return user[0];
}

module.exports = {
    getUserByToken
};