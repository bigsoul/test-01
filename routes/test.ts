import express, { Request, Response } from 'express';
import { addLog, addError } from '../config/logger';

export function test(req: Request, res: Response): void {
    addLog('Получен GET запрос для тестирования');

    if (Math.floor(Math.random() * 4) === 0) {
        const error = new Error('Синтетическая ошибка для тестирования');
        addError(`Ошибка: ${error.message}`);
        throw error;
    }

    res.sendStatus(200);
}
