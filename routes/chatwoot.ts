import express, { Request, Response } from 'express';
import { addLog } from '../config/logger';

export function webhook(req: Request, res: Response): void {
    addLog(`Получен POST запрос от Chatwoot: ${JSON.stringify(req.body)}`);
    res.sendStatus(200);
}
