import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { addLog, addError } from './config/logger';

dotenv.config();

const app = express();
const PORT = 443;

// Middleware для парсинга JSON
app.use(express.json());

// Загрузка SSL сертификатов
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'certs', 'privkey.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'fullchain.pem')),
};

// Роут для webhook
app.post('/webhook', (req: Request, res: Response) => {
    addLog(`Получен POST запрос на /webhook: ${JSON.stringify(req.body)}`);
    res.sendStatus(200);
});

// Роут для test
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
    addLog(`Получен GET запрос на /test`);
    // Генерируем исключение с вероятностью 1 из 4
    if (Math.random() < 0.25) {
        return next(new Error('Синтетическая ошибка для целей тестирования.'));
    }
    res.sendStatus(200);
});

// Обработчик ошибок
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    addError(`Ошибка: ${err.message}`);
    res.status(500).send('Внутренняя ошибка сервера.');
});

// Запускаем сервер
https.createServer(sslOptions, app).listen(PORT, () => {
    addLog(`Сервер запущен на порту ${PORT}`);
});
