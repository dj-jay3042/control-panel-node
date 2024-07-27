const MySQL = require('../utils/db/Mysql');
const Mail = require('../utils/mail/Mail');
const tables = require('../config/tables');
const crypto = require('crypto');
const Logger = require('../utils/log/Logger');

class LoginController {
    /**
     * @function login
     * @description Handles the login request and sends an email.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>}
     */
    static async login(req, res) {
        const db = new MySQL();
        try {
            const loginData = {
                username: req.body.username,
                password: req.body.password,
                otp: req.body.otp,
                loginKey: req.headers.loginkey
            };

            await db.connect();
            const user = await db.table(tables.TBL_USERS)
                .select("userId", "userFirstName", "userLastName", "userPassword", "userEmail", "userPhoneNumber", "userAccessToken", "userRefreshToken")
                .where("userLogin", loginData.username)
                .first();

            if (user) {
                if (LoginController.#sha1(loginData.password) === user.userPassword) {
                    const verificationData = await db.table(tables.TBL_USER_VERIFICATION_DETAILS)
                        .select("*")
                        .where("verificationUserId", user.userId)
                        .where("verificationType", "1")
                        .where("verificationStatus", "1")
                        .get();
                    if (verificationData) {
                        if (await LoginController.#verifyUser(verificationData, loginData, db)) {
                            res.status(200).json({ message: `Welcome ${user.userFirstName} ${user.userLastName}`, accessKey: user.userAccessToken, refreshKey: user.userRefreshToken });
                        } else {
                            res.status(401).json({ message: 'Invalid OTP' });
                        }
                    } else {
                        res.status(401).json({ message: 'Invalid credentials' });
                    }
                } else {
                    res.status(401).json({ message: 'Invalid credentials' });
                }
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            const logger = new Logger();
            logger.write("Error in Login: " + error, "login/error");
            res.status(500).json({ message: 'Opps! Something went wrong!' });
        } finally {
            await db.disconnect();
        }
    }

    static async sendOtp(req, res) {
        const email = new Mail();
        const db = new MySQL();

        try {
            const inputData = {
                username: req.body.username,
                password: req.body.password
            };

            await db.connect();
            const user = await db.table(tables.TBL_USERS)
                .select("userId", "userPassword", "userEmail", "userPhoneNumber")
                .where("userLogin", inputData.username)
                .first();

            if (user) {
                if (LoginController.#sha1(inputData.password) === user.userPassword) {
                    const otp = LoginController.#generateOtp();
                    const templateData = {
                        loginId: user.userLogin,
                        otp: otp
                    };
                    await email.sendEmailTemplate(1, templateData, user.userEmail);

                    // Otp Verification Detail Insertion
                    const otpVerificationData = {
                        verificationUserId: user.userId,
                        verificationType: "1",
                        verificationKeyType: "1",
                        verificationValue: otp,
                        verificationStatus: "1",
                    };
                    await db.table(tables.TBL_USER_VERIFICATION_DETAILS).insert(otpVerificationData);

                    // LoginKey Verification Detail Insertion
                    const loginKey = LoginController.#sha1(inputData.password + otp + user.userPassword);
                    const loginKeyVerificationData = {
                        verificationUserId: user.userId,
                        verificationType: "1",
                        verificationKeyType: "2",
                        verificationValue: loginKey,
                        verificationStatus: "1",
                    };
                    await db.table(tables.TBL_USER_VERIFICATION_DETAILS).insert(loginKeyVerificationData);

                    res.status(200).json({ message: 'OTP sent successfully', loginKey: loginKey });
                } else {
                    res.status(401).json({ message: 'Invalid credentials' });
                }
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            const logger = new Logger();
            logger.write("Error in sendOtp: " + error, "login/error");
            res.status(500).json({ message: 'Opps! Something went wrong!' });
        } finally {
            await db.disconnect();
        }
    }

    /**
     * @function #generateOtp
     * @description Generates a secure OTP (One-Time Password) consisting of digits only.
     * @param {number} length - The length of the OTP to generate.
     * @returns {string} - The generated OTP.
     * @private
     */
    static #generateOtp(length = 6) {
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = crypto.randomInt(0, digits.length);
            otp += digits[randomIndex];
        }
        return otp;
    }

    /**
     * @function #sha1
     * @description Generates a SHA-1 hash for the given data.
     * @param {string} data - The data to hash.
     * @returns {string} - The generated SHA-1 hash.
     * @private
     */
    static #sha1(data) {
        return crypto.createHash('sha1').update(data, 'utf8').digest('hex');
    }

    static async #verifyUser(verificationData, loginData, db) {
        let response = false;
        for (const details of verificationData) {
            if (details.verificationKeyType === "1") {
                response = (details.verificationValue == loginData.otp);
            } else if (details.verificationKeyType === "2") {
                response = (details.verificationValue == loginData.loginKey);
            }
            const updateVerificationDetails = {
                verificationStatus: response ? "2" : "0"
            };
            await db.table(tables.TBL_USER_VERIFICATION_DETAILS).where("verificationId", details.verificationId).update(updateVerificationDetails);
        }
        return response;
    }
}

module.exports = LoginController;