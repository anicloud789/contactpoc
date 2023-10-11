const winston = require('../logger/winstonLogger');

const customErrorHandler = (error, context) => {
    // Log the error
    winston.error('An error occurred: ' + error.message);

    // Handle the error and send an appropriate response
    context.log.error('An error occurred: ' + error.message);
};

module.exports = customErrorHandler;