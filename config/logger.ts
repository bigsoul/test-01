import fs from 'fs';
import path from 'path';
import winston from 'winston';

const logFilePath = process.env.LOG_FILE_PATH || path.join(__dirname, '..', 'logs', 'express.log');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: logFilePath }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
                })
            )
        })
    ]
});

// Создает файл, если он отсутствует
function ensureLogFileExists() {
    if (!fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, '');
    }
}

// Добавление обычного лога
export function addLog(text: string): void {
    ensureLogFileExists();
    logger.info(text);
}

// Добавление ошибки
export function addError(text: string): void {
    ensureLogFileExists();
    logger.error(text);
}
