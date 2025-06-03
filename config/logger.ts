import fs from 'fs';
import path from 'path';
import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const logFilePath = process.env.LOG_FILE_PATH || path.join(__dirname, '../logs/express.log');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: logFilePath }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ level, message, timestamp }) => {
                    return `[${timestamp}] [${level}]: ${message}`;
                })
            )
        })
    ]
});

/**
 * Добавляет запись в лог-файл и выводит в консоль.
 * @param text Текст для записи в лог.
 */
export function addLog(text: string): void {
    if (!fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, '');
    }
    logger.info(text);
}
