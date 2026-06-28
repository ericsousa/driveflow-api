import { NotaFiscalService } from '../services/notaFiscalService';
import { Request, Response } from 'express';

const notaFiscalService = new NotaFiscalService();

export async function listarNotasFiscais(req: Request, res: Response): Promise<void> {
    const notasFiscais = await notaFiscalService.listarNotasFiscais();
    res.json(notasFiscais);
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
        res.status(404).json({ error: (error as Error).message });
    }
}

export async function criarNotaFiscal(req: Request, res: Response): Promise<void> {
    const data = req.body;
    try {
        const notaFiscal = await notaFiscalService.criarNotaFiscal(data);
        res.status(201).json(notaFiscal);
    } catch (error) {
        const message = (error as Error).message;
        if (message === 'Cliente relacionado à nota fiscal não encontrado.' ||
            message === 'Vendedor relacionado à nota fiscal não encontrado.' ||
            message === 'Carro relacionado à nota fiscal não encontrado.' ||
            message === 'Carro não encontrado em estoque.'
        ) {
            res.status(404).json({ error: message });
            return;
        }
        if (message === 'Carro sem estoque disponível para venda.') {
            res.status(422).json({ error: message });
            return;
        }
        if (message === 'Número da nota fiscal já existe. Deve ser único.') {
            res.status(409).json({ error: message });
            return;
        }

        res.status(400).json({ error: message });
    }   
}