import express, { Request, Response } from 'express';
import { addLog, addError } from '../config/logger';

export function test(req: Request, res: Response): void {
  addLog(`Получен запрос на /test`);

  // Симуляция ошибки 1 раз из 4
  const randomNumber = Math.floor(Math.random() * 4);
  if (randomNumber === 0) {
    const errorMessage = 'Синтетическая ошибка для теста';
    addError(errorMessage);
    throw new Error(errorMessage);
  }

  res.status(200).send('OK');
}
