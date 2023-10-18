const salesforceService = require('../services/salesforceService');
const { logger, generateCorrelationId } = require('../logger/winstonLogger');


module.exports = async function (context, req) {
    const correlationId = generateCorrelationId();
    //context.log("S_correlationid=>", correlationId);
    logger.log({ level: 'info', message: 'Contact Funcation call Started', correlationId, });
    await contactController(context, req, correlationId);
    logger.log({ level: 'info', message: 'Contact Funcation call Endded ', correlationId, });
};

async function contactController(context, req, correlationId) {
    try {
        const isDebugMode = process.env.NODE_ENV === 'development' && process.env.DEBUG_MODE === 'true';

        if (isDebugMode) {
            context.log("ENV=>", process.env.NODE_ENV);
            context.log("DebugMode=>", process.env.DEBUG_MODE);
            context.log("data=>", JSON.stringify(req, null, 2));
        }

        logger.log({ level: 'info', message: JSON.stringify(req, null, 2), correlationId, });
        const action = req.action;
        const contactId = req.contactId;

        if (action === 'getAll') {
            const contact = await salesforceService.getAllContact();
            context.res = {
                status: 200,
                body: contact.recentItems
            };

        } else if (action === 'create') {
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
            logger.log({ level: 'info', message: "Get Action Started", correlationId, });
            const contact = await salesforceService.getContact(contactId);
            if (isDebugMode) {
                context.log("Get Contact By ID=>", JSON.stringify(contact, null, 2));
            }
            logger.log({ level: 'info', message: "Get Action Ended", correlationId, });
            context.res = {
                status: 200,
                body: contact
            };
        }
        else {
            context.res = {
                status: 200,
                body: 'Invalid action specified.'
            };
            logger.log({ level: 'error', message: "Invalid action specified", correlationId, });
        }

    } catch (error) {
        if (isDebugMode) {
            context.log("Error_correlationid=>", correlationId);
        }
        logger.log({ level: 'error', message: error, correlationId, });
        context.res = {
            status: 200,
            body: "Error Found"
        };

    }

}