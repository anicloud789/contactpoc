const salesforceService = require('../services/salesforceService');
const customErrorHandler = require('../errorHandling/customErrorHandler');

module.exports = async function (context, req) {
    try {

        context.log("req=>", req);

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
            const updatedContact = await salesforceService.updateContact(contactId, contactDetails);
            context.res = {
                status: 200,
                body: updatedContact
            };
        }
        else if (action === 'delete') {
            await salesforceService.deleteContact(contactId);
            context.res = {
                status: 204
            };
        }
        else if (action === 'get') {
            const contact = await salesforceService.getContact(contactId);
            context.res = {
                status: 200,
                body: contact
            };
        }
        else {
            customErrorHandler({ message: "Invalid action specified" }, context);
            context.res = {
                status: 200,
                body: 'Invalid action specified.'
            };


        }
    } catch (error) {
        // context.log("error=>",error);
        // Handle errors using custom error handler and logging
        customErrorHandler(error, context);
    }
};