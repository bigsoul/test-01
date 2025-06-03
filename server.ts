// Импортируем необходимые модули
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import express, { Request, Response } from 'express';
import path from 'path';
import { addLog } from './config/logger';

// Загружаем переменные окружения из .env
dotenv.config();

// Создаем экземпляр приложения Express
const app = express();

// Подключаем middleware для парсинга JSON
app.use(express.json());

// Загружаем SSL сертификаты
const privateKey = fs.readFileSync(path.resolve(__dirname, './certs/privkey.pem'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, './certs/fullchain.pem'), 'utf8');

const credentials = { key: privateKey, cert: certificate };

// Роут для POST-запроса webhook
app.post('/webhook', (req: Request, res: Response) => {
    // Логируем входящий запрос
    addLog(`POST /webhook - тело запроса: ${JSON.stringify(req.body)}`);
    res.sendStatus(200);
});

// Роут для GET-запроса test
app.get('/test', (req: Request, res: Response) => {
    // Логируем входящий запрос
    addLog('GET /test');
    res.sendStatus(200);
});

// Запускаем HTTPS сервер на порту 443
https.createServer(credentials, app).listen(443, () => {
    addLog('Сервер запущен на порту 443');
});
