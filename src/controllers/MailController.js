const Logger = require('../utils/logs/Logger'); // Import the Logger utility for logging
const Email = require('../utils/mail/Mail'); // Import the Email utility for sending mails
const Imap = require('../utils/mail/ImapClient'); // Import the ImapClient utility for fetching mails
const MySQL = require('../utils/db/Mysql'); // Import the MySQL utility for database operations
const tables = require('../config/tables'); // Import table configurations

/**
 * @class MailController
 * @description Controller class for handling data-related operations such as fetching visits, bot visits, visitor OS, and bank balance.
 *              This class contains static methods that interact with the database and handle HTTP requests and responses.
 * @version 1.0.0
 * @date 2024-07-30
 * @autor Jay Chauhan
 */
class MailController {
    /**
     * @function sendEmail
     * @description Sends an email using the Email utility.
     * @param {Object} req - The HTTP request object.
     * @param {Object} res - The HTTP response object.
     */
    static async sendEmail(req, res) {
        try {
            const to = req.body.to; // Get the recipient's email address from the request body

            // Prepare the email template data from the request body
            const templateData = {
                name: req.body.name,
                emailTitle: req.body.title,
                message: req.body.content,
                subject: req.body.subject,
            };
            const email = new Email(); // Create a new instance of the Email utility
            await email.sendEmailTemplate(3, templateData, to); // Send the email using the specified template and data
            res.status(200).json({ message: 'Email sent successfully!' }); // Send a success response
        } catch (error) {
            const logger = new Logger(); // Create a new instance of the Logger utility
            logger.write("Error in sending email: " + error, "email/error"); // Log the error
            res.status(500).json({ message: 'Oops! Something went wrong!' }); // Send an error response
        }
    }

    /**
     * @function fetchEmails
     * @description Fetches emails using the ImapClient utility and inserts them into the database.
     * @param {Object} req - The HTTP request object.
     * @param {Object} res - The HTTP response object.
     */
    static async fetchEmails(req, res) {
        const db = new MySQL(); // Create a new instance of the MySQL utility

        try {
            const imap = new Imap(); // Create a new instance of the ImapClient utility
            await imap.connect(); // Connect to the IMAP server
            const emails = await imap.getEmails(); // Get the emails from the IMAP server

            await db.connect(); // Connect to the database

            // Iterate through the fetched emails and insert them into the database
            emails.forEach(async (mail, index) => {
                const insertDetails = {
                    mailMessageId: mail.messageId,
                    mailFromEmail: mail.from.value[0].address,
                    mailFromName: mail.from.value[0].name || null,
                    mailToEmail: mail.to.value[0].address,
                    mailToName: mail.to.value[0].name || null,
                    mailSubject: mail.subject || null,
                    mailBody: mail.html,
                    mailType: "0"
                };
                await db.table(tables.TBL_MAILS).insert(insertDetails); // Insert email details into the database
            });

            res.status(200).json({ message: 'Email fetched successfully!' }); // Send a success response
        } catch (error) {
            const logger = new Logger(); // Create a new instance of the Logger utility
            logger.write("Error in fetching emails: " + error, "email/fetch"); // Log the error
            res.status(500).json({ message: 'Oops! Something went wrong!' }); // Send an error response
        } finally {
            await db.disconnect(); // Disconnect from the database
        }
    }
}

module.exports = MailController; // Export the MailController class
