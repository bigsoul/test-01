import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import * as logger from './config/logger';
import * as chatwootRoutes from './routes/chatwoot';
import * as testRoutes from './routes/test';

dotenv.config();

const app = express();
app.use(express.json());

// Подключение роутов
app.post('/webhook', chatwootRoutes.webhook);
app.get('/test', testRoutes.test);

// Обработчик ошибок
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.addError(`Необработанная ошибка: ${err.message}`);
    res.status(500).send('Внутренняя ошибка сервера');
});

// Чтение SSL сертификатов
const cert = fs.readFileSync(path.join(__dirname, 'certs', 'fullchain.pem'));
const key = fs.readFileSync(path.join(__dirname, 'certs', 'privkey.pem'));

https.createServer({ key, cert }, app).listen(443, () => {
    logger.addLog('Сервер запущен на порту 443');
});
