const salesforceService = require('../services/salesforceService');
//const customErrorHandler = require('../errorHandling/customErrorHandler');
const { logger, generateCorrelationId } = require('../logger/winstonLogger');

module.exports = async function (context, req) {
    try {

        const correlationId = generateCorrelationId();

        context.log("req=>", req);

        context.log("correlationId=>", correlationId);

        logger.log({
            level: 'info',
            message: 'Function Started',
            correlationId,
        });

        const action = req.action;
        const contactId = req.contactId;

        context.log("action=>", action);

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
            const contact = await salesforceService.getContact(contactId);
            context.log("Get Contact By ID=>", JSON.stringify(contact, null, 2));

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


        }
    } catch (error) {
        // context.log("error=>",error);
        // Handle errors using custom error handler and logging
        //customErrorHandler(error, context);

        logger.log({
            level: 'error',
            message: error,
            correlationId,
        });
    } finally {
        logger.log({
            level: 'info',
            message: 'Function Ended',
            correlationId,
        });

        context.res = {
            status: 200,
            body: "Operation End"
        };
        
    }
};