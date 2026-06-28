import { NotaFiscalService } from '../services/notaFiscalService';
import { Request, Response } from 'express';
import { AppError } from '../errors/AppError';

const notaFiscalService = new NotaFiscalService();

export async function listarNotasFiscais(req: Request, res: Response): Promise<void> {
    try {
        const notasFiscais = await notaFiscalService.listarNotasFiscais();
        res.json(notasFiscais);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function buscarNotaFiscalPorId(req: Request, res: Response): Promise<void> {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    try {
        const nota = await notaFiscalService.buscarNotaFiscalPorId(id);
        res.json(nota);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function criarNotaFiscal(req: Request, res: Response): Promise<void> {
    const data = req.body;
    try {
        const notaFiscal = await notaFiscalService.criarNotaFiscal(data);
        res.status(201).json(notaFiscal);
       } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}