const Logger = require('../utils/logs/Logger'); // Import the Logger utility for logging
const Whatsapp = require('../utils/whatsapp/Whatsapp'); // Import whatsapp Whatsapp utility for whatsapp messages
/**
 * @class SmsController
 * @description Controller class for handling SMS-related operations such as fetching SMS data from the database.
 *              This class contains static methods that interact with the database and handle HTTP requests and responses.
 * @version 1.0.0
 * @date 2024-07-30
 * @Author Jay Chauhan
 */
class WhatsappController {
    static async sendMessage(req, res) {
        const clientId = 1;
        const whatsappNumber = req.body.whatsappNumber;
        const name = req.body.name;
        const templateName = req.body.templateName;
        const templateData = req.body.templateData;

        const whatsapp = new Whatsapp();
        const response = await whatsapp.sendTemplateMessage(clientId, templateName, whatsappNumber, name, templateData);
        res.status(200).json({ message: 'Whatsapp sent successfully!', response: response });
    }
}

module.exports = WhatsappController; // Export the WhatsappController class
