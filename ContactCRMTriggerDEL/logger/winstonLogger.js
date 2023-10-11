const { createLogger, format, transports } = require('winston');
const path = require('path');

const logFilePath = path.join(__dirname, 'logs', 'combined.log');

const logger = createLogger({
    level: 'info',  // Set the desired log level
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        // Log to a file
        new transports.File({ filename: logFilePath })
    ]
});

module.exports = logger;