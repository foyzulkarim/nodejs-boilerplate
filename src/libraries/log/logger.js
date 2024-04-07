const { retrieveRequestId } = require('../../middlewares/request-context');
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const LOG_DIR = 'logs';
class LogManager {
  static instance;
  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
        format((info) => {
          const requestId = retrieveRequestId();
          if (requestId) {
            info.requestId = requestId;
          }
          return info;
        })() 
      ),
      transports: [
        new transports.File({
          filename: `${LOG_DIR}/error.log`,
          level: 'error',
        }),
        new transports.File({ filename: `${LOG_DIR}/combined.log` }),
        new transports.DailyRotateFile({
          level: 'info',
          filename: `${LOG_DIR}/application-%DATE%.log`,
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        })
      );
    }
  }

  getLogger() {
    return this.logger;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new LogManager();
    }

    return this.instance;
  }
}

module.exports = LogManager.getInstance().getLogger();
