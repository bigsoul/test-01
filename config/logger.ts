import fs from 'fs';
import path from 'path';
import winston from 'winston';

const logFilePath = process.env.LOG_FILE_PATH || path.resolve(__dirname, '../logs/express.log');

// Проверка и создание файла лога, если отсутствует
const ensureLogFile = () => {
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '', { flag: 'w' });
  }
};

// Конфигурация Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: logFilePath }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
      )
    })
  ]
});

// Добавление обычного лога
export function addLog(text: string): void {
  ensureLogFile();
  logger.info(text);
}

// Добавление ошибки
export function addError(text: string): void {
  ensureLogFile();
  logger.error(text);
}
