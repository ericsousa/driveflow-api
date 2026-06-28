import { VendedorService } from '../services/vendedorService';
import { Request, Response } from 'express';
import { AppError } from '../errors/AppError';

const vendedorService = new VendedorService();

export async function listarVendedores(req: Request, res: Response): Promise<void> {
    try {
        const vendedores = await vendedorService.listarVendedores();
        res.json(vendedores);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function buscarVendedorPorId(req: Request, res: Response): Promise<void> {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    try {
        const vendedor = await vendedorService.buscarVendedorPorId(id);
        res.status(200).json(vendedor);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function listarNotasFiscaisPorVendedor(req: Request, res: Response): Promise<void> {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    try {
        const notasFiscais = await vendedorService.listarNotasFiscaisPorVendedorId(id);
        res.json(notasFiscais);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function criarVendedor(req: Request, res: Response): Promise<void> {
    const data = req.body;
    try {
        const vendedorCriado = await vendedorService.criarVendedor(data);
        res.status(201).json(vendedorCriado);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function atualizarVendedor(req: Request, res: Response): Promise<void> {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    const data = req.body;
    try {
        const vendedorAtualizado = await vendedorService.atualizarVendedor(id, data);
        res.json(vendedorAtualizado);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function removerVendedor(req: Request, res: Response): Promise<void> {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    try {
        const vendedorRemovido = await vendedorService.removerVendedor(id);
        res.json(vendedorRemovido);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}
