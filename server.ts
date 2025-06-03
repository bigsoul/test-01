import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { addError } from './config/logger';
import * as chatwootRoutes from './routes/chatwoot';
import * as testRoutes from './routes/test';

// Загрузка переменных окружения
dotenv.config();

const app = express();
app.use(express.json());

// SSL сертификаты
const sslOptions = {
  key: fs.readFileSync(path.resolve(__dirname, './certs/privkey.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, './certs/fullchain.pem')),
};

// Подключение routes
app.post('/chatwoot/webhook', chatwootRoutes.webhook);
app.get('/test', testRoutes.test);

// Глобальный обработчик ошибок
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  addError(`Глобальная ошибка: ${err.message}`);
  res.status(500).send('Внутренняя ошибка сервера');
});

// Запуск сервера
https.createServer(sslOptions, app).listen(443, () => {
  console.log('Сервер запущен на порту 443');
});
