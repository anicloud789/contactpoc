const salesforceService = require('../services/salesforceService');
//const customErrorHandler = require('../errorHandling/customErrorHandler');
const { logger, generateCorrelationId } = require('../logger/winstonLogger');
//const { v4: uuidv4 } = require('uuid');
// Function to generate a unique correlation ID
// const generateCorrelationId = () => uuidv4();
// const correlationId = generateCorrelationId();

// const generateCorrelationId = () => Math.random().toString(36).slice(2);
// const correlationId = generateCorrelationId();

module.exports = async function (context, req) {
    const correlationId = generateCorrelationId();
    context.log("S_correlationid=>", correlationId);
    logger.log({ level: 'info', message: 'Function Started', correlationId, });
    await contactRequestAPI(context, req, correlationId);
    logger.log({ level: 'info', message: 'Function End ', correlationId, });
};

async function contactRequestAPI(context, req, correlationId) {
    try {

        context.log("ENV=>", process.env.NODE_ENV);
        context.log("DebugMode=>", process.env.DEBUG_MODE);

        logger.log({ level: 'debug', message: JSON.stringify(req, null, 2), correlationId, });

        //context.log("req=>", req);
        //context.log("correlationId=>", correlationId);

        const action = req.action;
        const contactId = req.contactId;

        if (action === 'getAll') {
            const contact = await salesforceService.getAllContact();
            context.log("ALL contacts=>", JSON.stringify(contact.recentItems, null, 2));
            context.res = {
                status: 200,
                body: contact.recentItems
            };

        } else if (action === 'create') {
            // Implement create logic
            const contactDetails = req.data;
            const createdContact = await salesforceService.createContact(contactDetails);
            context.res = {
                status: 201,
                body: createdContact
            };
        }
        else if (action === 'update') {
            const contactDetails = req.data;
            context.log("Update Contact ID =>", contactId);
            context.log("Update Contact Request Details=>", JSON.stringify(contactDetails, null, 2));
            const updatedContact = await salesforceService.updateContact(contactId, contactDetails);
            context.log("Updated Contact By ID=>", JSON.stringify(updatedContact, null, 2));
            context.res = {
                status: 200,
                body: updatedContact
            };
        }
        else if (action === 'delete') {
            context.log("Delete Contact ID =>", contactId);
            await salesforceService.deleteContact(contactId);
            context.res = {
                status: 204
            };
        }
        else if (action === 'get') {
            logger.log({ level: 'info', message: "Start Get Method", correlationId, });
            const contact = await salesforceService.getContact(contactId);
            logger.log({ level: 'debug', message: JSON.stringify(contact, null, 2), correlationId, });
            // context.log("Get Contact By ID=>", JSON.stringify(contact, null, 2));
            logger.log({ level: 'info', message: "Exit Get Method", correlationId, });
            context.res = {
                status: 200,
                body: contact
            };
        }
        else {
            //customErrorHandler({ message: "Invalid action specified" }, context);
            context.res = {
                status: 200,
                body: 'Invalid action specified.'
            };
            logger.log({ level: 'error', message: "Invalid action specified", correlationId, });
        }
        context.log("E_correlationid=>", correlationId);
    } catch (error) {
        // context.log("error=>",error);
        // Handle errors using custom error handler and logging
        //customErrorHandler(error, context);
        context.log("Error_correlationid=>", correlationId);
        logger.log({ level: 'error', message: error, correlationId, });


        context.res = {
            status: 200,
            body: "Error Found"
        };

    }

}