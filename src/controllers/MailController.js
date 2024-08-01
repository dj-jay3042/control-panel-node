const Logger = require('../utils/logs/Logger'); // Import the Logger utility for logging
const Email = require('../utils/mail/Mail'); // Import the Email utility for sending mail

/**
 * @class MailController
 * @description Controller class for handling data-related operations such as fetching visits, bot visits, visitor OS, and bank balance.
 *              This class contains static methods that interact with the database and handle HTTP requests and responses.
 * @version 1.0.0
 * @date 2024-07-30
 * @author Jay Chauhan
 */
class MailController {
    static async sendEmail(req, res) {
        try {
            const to = req.body.to;

            const templateData = {
                name: req.body.name,
                emailTitle: req.body.title,
                message: req.body.content,
                subject: req.body.subject,
            };
            const email = new Email(); // Create a new instance of the Email utility
            await email.sendEmailTemplate(3, templateData, to);
            res.status(200).json({ message: 'Email sent successfully!' });
        } catch (error) {
            const logger = new Logger(); // Create a new instance of the Logger utility
            logger.write("Error in sending email: " + error, "email/error"); // Log the error
            res.status(500).json({ message: 'Oops! Something went wrong!' }); // Send an error response
        }
    }
}

module.exports = MailController; // Export the MailController class