import fs from 'fs';
import path from 'path';
import winston from 'winston';

// Определяем путь к файлу лога
const logFilePath = process.env.LOG_FILE_PATH || path.resolve(__dirname, '../logs/express.log');

// Проверка существования файла лога
function ensureLogFileExists() {
  if (!fs.existsSync(logFilePath)) {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
    fs.writeFileSync(logFilePath, '');
  }
}

// Конфигурация Winston логгера
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
    new winston.transports.Console({ format: winston.format.colorize({ all: true }) })
  ]
});

// Функция для добавления лога (не ошибок)
export function addLog(text: string): void {
  ensureLogFileExists();
  logger.info(text);
}

// Функция для добавления ошибок
export function addError(text: string): void {
  ensureLogFileExists();
  logger.error(text);
}
