// const winston = require('../logger/winstonLogger');

// // const errorHandler = (error, context) => {
// //     winston.error('An error occurred: ' + error.message);
// //     context.log.error('An error occurred: ' + error.message);
// // };

// const errorHandler = async function (context, req) {
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

// module.exports = errorHandler;