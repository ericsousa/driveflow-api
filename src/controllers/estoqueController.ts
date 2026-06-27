import { EstoqueService } from '../services/estoqueService';
import { Request, Response } from 'express';

const estoqueService = new EstoqueService();

export async function listarEstoque(req: Request, res: Response): Promise<void> {
    const estoques = await estoqueService.listarEstoques();
    res.json(estoques);
}

export async function buscarEstoquePorId(req: Request, res: Response): Promise<void> {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    try {
        const estoque = await estoqueService.buscarEstoquePorId(id);
        res.status(200).json(estoque);
    } catch (error) {
        const message = (error as Error).message;
        if (message === 'Estoque não encontrado') {
            res.status(404).json({ error: message });
            return;
        }
        res.status(400).json({ error: message });
    }
}

export async function listarEstoquePorCarroId(req: Request, res: Response): Promise<void> {
    const id_carro = parseInt(String(req.params.id_carro));
    if (isNaN(id_carro)) {
        res.status(400).json({ error: 'ID do carro inválido' });
        return;
    }

    try {
        const estoques = await estoqueService.listarEstoquesPorCarroId(id_carro);
        res.status(200).json(estoques);
    } catch (error) {
        const message = (error as Error).message;
        if (message === 'Carro não encontrado') {
            res.status(404).json({ error: message });
            return;
        }
        res.status(400).json({ error: message });
    }
}

export async function criarEstoque(req: Request, res: Response): Promise<void> {
    const data = req.body;
    try {
        const estoqueCriado = await estoqueService.criarEstoque(data);
        res.status(201).json(estoqueCriado);
    } catch (error) {
        const message = (error as Error).message;
        if (message === 'Carro não encontrado') {
            res.status(404).json({ error: message });
            return;
        }
        if (message === 'Já existe estoque para este carro') {
            res.status(409).json({ error: message });
            return;
        }
        res.status(400).json({ error: message });
    }
}

export async function atualizarEstoque(req: Request, res: Response): Promise<void> {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    const data = req.body;
    try {
        const estoqueAtualizado = await estoqueService.atualizarEstoque(id, data);
        res.status(200).json(estoqueAtualizado);
    } catch (error) {
        const message = (error as Error).message;
        if (message === 'Estoque não encontrado') {
            res.status(404).json({ error: message });
            return;
        }
        if (message === 'Carro não encontrado') {
            res.status(404).json({ error: message });
            return;
        }
        if (message === 'Já existe estoque para este carro') {
            res.status(409).json({ error: message });
            return;
        }
        res.status(400).json({ error: message });
    }
}

export async function removerEstoque(req: Request, res: Response): Promise<void> {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    try {
        const estoqueRemovido = await estoqueService.removerEstoque(id);
        if (estoqueRemovido) {
            res.status(200).json(estoqueRemovido);
        } else {
            res.status(404).json({ error: 'Estoque não encontrado' });
        }
    } catch (error) {
        const message = (error as Error).message;
        if (message === 'Estoque não encontrado') {
            res.status(404).json({ error: message });
            return;
        }
        res.status(400).json({ error: message });
    }
}
