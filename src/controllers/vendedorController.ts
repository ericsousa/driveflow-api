import { VendedorService } from '../services/vendedorService';
import { Request, Response } from 'express';

const vendedorService = new VendedorService();

export async function listarVendedores(req: Request, res: Response): Promise<void> {
    const vendedores = await vendedorService.listarVendedores();
    res.json(vendedores);
}

export async function buscarVendedorPorId(req: Request, res: Response): Promise<void> {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    const vendedor = await vendedorService.buscarVendedorPorId(id);
    if (!vendedor) {
        res.status(404).json({ error: 'Vendedor não encontrado' });
        return;
    }
    res.json(vendedor);
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
    } catch (e: unknown) {
        const message = (e as Error).message;
        if (message === 'Vendedor não encontrado') {
            res.status(404).json({ error: message });
            return;
        }
        res.status(400).json({ error: (e as Error).message });
    }
}

export async function criarVendedor(req: Request, res: Response): Promise<void> {
    const data = req.body;
    try {
        const vendedorCriado = await vendedorService.criarVendedor(data);
        res.status(201).json(vendedorCriado);
    } catch (error) {
        const message = (error as Error).message;
        if (message === 'Matrícula já existe') {
            res.status(409).json({ error: message });
            return;
        }
        // Comissão percentual inválida ou campo obrigatório não preenchido
        // Entra no código 400, pois é um erro de validação dos dados enviados pelo cliente
        res.status(400).json({ error: (error as Error).message });
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
        if (vendedorAtualizado) {
            res.json(vendedorAtualizado);
        } else {
            res.status(404).json({ error: 'Vendedor não encontrado' });
        }
    } catch (error) {
        const message = (error as Error).message;
        if (message === 'Matrícula já existe') {
            res.status(409).json({ error: message });
            return;
        }
        res.status(400).json({ error: (error as Error).message });
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
        if (vendedorRemovido) {
            res.json(vendedorRemovido);
        } else {
            res.status(404).json({ error: 'Vendedor não encontrado' });
        }
    } catch (error) {
        const message = (error as Error).message;

        if (message === 'Não é possível excluir o vendedor, existem notas fiscais associadas a ele') {
            res.status(422).json({ error: message });
            return;
        }
        res.status(400).json({ error: message });
    }
}
