// const { createLogger, format, transports } = require('winston');
// const path = require('path');

// const logFilePath = path.join(__dirname, 'logs', 'combined.log');

// const logger = createLogger({
//     level: 'info',  // Set the desired log level
//     format: format.combine(
//         format.timestamp(),
//         format.json()
//     ),
//     transports: [
//         // Log to a file
//         new transports.File({ filename: logFilePath })
//     ]
// });

// module.exports = logger;

//// new file size ///

const { createLogger, transports, format } = require('winston');
//const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const maxSize = 1024 * 256; // 250 MB

// Check if we're in debug mode
const isDebugMode = process.env.NODE_ENV === 'development' && process.env.DEBUG_MODE === 'true';

const generateCorrelationId = () => uuidv4();

const datePart = new Date().toISOString().slice(0, 10);
const logFilePath = path.join(__dirname, 'logs', `${datePart}-app.log`);

const customFileTransport = new transports.File(
    { filename: logFilePath },
    {
        format: format.combine(
            format.timestamp(),
            format.json(),
            format.printf((info) => {
                // Add correlation ID to the log message
                return `[${info.timestamp}] [Correlation ID: ${info.correlationId}] ${info.level}: ${info.message}`;
            })
        ),
        maxsize: maxSize,
        maxFiles: 3, // Maximum number of files to keep (for rotation)
    });

const logger = createLogger({
    transports: [customFileTransport],
});

if (isDebugMode) {
    logger.add(new transports.File(
        {
            level: 'debug',
            filename: logFilePath
        },{
            format: format.combine(
                format.timestamp(),
                format.json(),
                format.printf((info) => {
                    // Add correlation ID to the log message
                    return `[${info.timestamp}] [Correlation ID: ${info.correlationId}] ${info.level}: ${info.message}`;
                })
            ),
            maxsize: maxSize,
            maxFiles: 3, // Maximum number of files to keep (for rotation)
        }));
}

// if (isDebugMode) {
//     logger.add(new transports.Console({
//         level: 'debug',
//         format: format.combine(
//             format.colorize(),
//             format.simple()
//         ),
//     }));
// }

// module.exports = async function (context, req) {
//   const correlationId = generateCorrelationId();

//   // Log information with the correlation ID
//   logger.log({
//     level: 'info',
//     message: 'This is an info message.',
//     correlationId,
//   });

//   // Log error with the correlation ID
//   logger.log({
//     level: 'error',
//     message: 'This is an error message.',
//     correlationId,
//   });

//   // Log warning with the correlation ID
//   logger.log({
//     level: 'warning',
//     message: 'This is a warning message.',
//     correlationId,
//   });

//   if (isDebugMode) {
//     // Log debug with the correlation ID (only in debug mode)
//     logger.log({
//       level: 'debug',
//       message: 'This is a debug message.',
//       correlationId,
//     });
//   }

//   // Your Azure Function logic here

//   context.res = {
//     status: 200,
//     body: 'Azure Function executed successfully',
//   };
// };

module.exports = { logger, generateCorrelationId };