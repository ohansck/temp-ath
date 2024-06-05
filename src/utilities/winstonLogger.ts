import * as winston from 'winston';
import * as DailyRotate from 'winston-daily-rotate-file';
const hostname = require('os').hostname();

const config = {
    levels: {
        error: 0,
        debug: 1,
        warn: 2,
        data: 3,
        info: 4,
        verbose: 5,
        silly: 6
    },
    colors: {
        error: 'red',
        debug: 'blue',
        warn: 'yellow',
        data: 'magenta',
        info: 'white',
        verbose: 'cyan',
        silly: 'grey'
    }
};

winston.addColors(config.colors);
const rotateFileFormat = winston.format.combine(
    winston.format.printf(info => {
        return `${info.timestamp} [${info.level.toLocaleUpperCase()}] [${info.context ? info.context : info.stack}] ${info.message
            }`;
    }),
    winston.format.errors({ stack: true })
)
export const winstonTransports = {
    console: new winston.transports.Console({
        level: 'debug',
        format: winston.format.combine(
            winston.format.timestamp({
            }),
            winston.format.colorize({ all: true }),
            winston.format.printf(info => {
                return `${new Date(info.timestamp).toLocaleDateString('tr-Tr', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })} [${info.level}] [${info.context ? info.context : info.stack}] ${info.message
                    }`;
            })
        )
    }),
    combinedFile: new DailyRotate({
        dirname: `logs/${hostname}/combined`,
        filename: 'combined',
        extension: '.log',
        level: 'info',
        format: rotateFileFormat
    }),
    errorFile: new DailyRotate({
        dirname: `logs/${hostname}/error`,
        filename: 'error',
        extension: '.log',
        level: 'error',
        format: rotateFileFormat
    })
};