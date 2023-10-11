const winston = require('../logger/winstonLogger');

const customErrorHandler = (error, context) => {
    winston.error('An error occurred: ' + error.message);
    context.log.error('An error occurred: ' + error.message);
};

module.exports = customErrorHandler;