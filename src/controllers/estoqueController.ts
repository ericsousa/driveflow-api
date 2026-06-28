import { EstoqueService } from '../services/estoqueService';
import { Request, Response } from 'express';
import { AppError } from '../errors/AppError';

const estoqueService = new EstoqueService();

export async function listarEstoque(req: Request, res: Response): Promise<void> {
    try {
        const estoques = await estoqueService.listarEstoques();
        res.json(estoques);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
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
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
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
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function criarEstoque(req: Request, res: Response): Promise<void> {
    const data = req.body;
    try {
        const estoqueCriado = await estoqueService.criarEstoque(data);
        res.status(201).json(estoqueCriado);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
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
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
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
        res.status(200).json(estoqueRemovido);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}
