import express, { Request, Response } from 'express';
import { addLog } from '../config/logger';

export function webhook(req: Request, res: Response): void {
  addLog(`Получен webhook от Chatwoot: ${JSON.stringify(req.body)}`);
  res.status(200).send('OK');
}
