import { NotaFiscalService } from '../services/notaFiscalService';
import { Request, Response } from 'express';

const notaFiscalService = new NotaFiscalService();

export function listarNotasFiscais(req: Request, res: Response) {
    const notasFiscais = notaFiscalService.listarNotasFiscais();
    res.json(notasFiscais);
}

export function buscarNotaFiscalPorId(req: Request, res: Response) {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    try {
        const nota = notaFiscalService.buscarNotaFiscalPorId(id);
        res.json(nota);
    } catch (error) {
        res.status(404).json({ error: (error as Error).message });
    }
}

export function criarNotaFiscal(req: Request, res: Response) {
    const data = req.body;
    try {
        notaFiscalService.criarNotaFiscal(data);
        res.status(201).json({ message: 'Nota fiscal criada com sucesso' });
    } catch (error) {
        const message = (error as Error).message;
        if (message === 'Cliente relacionado à nota fiscal não encontrado.' ||
            message === 'Vendedor relacionado à nota fiscal não encontrado.' ||
            message === 'Carro relacionado à nota fiscal não encontrado.' ||
            message === 'Carro não encontrado em estoque.' ||
            message === 'Carro sem estoque disponível para venda.'
        ) {
            res.status(404).json({ error: message });
            return;
        }
        res.status(400).json({ error: message });
    }   
}