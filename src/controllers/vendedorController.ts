import { VendedorService } from '../services/vendedorService';
import { Request, Response } from 'express';

const vendedorService = new VendedorService();

export function listarVendedores(req: Request, res: Response) {
    const vendedores = vendedorService.listarVendedores();
    res.json(vendedores);
}

export function buscarVendedorPorId(req: Request, res: Response) {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    const vendedor = vendedorService.buscarVendedorPorId(id);
    if (!vendedor) {
        res.status(404).json({ error: 'Vendedor não encontrado' });
        return;
    }
    res.json(vendedor);
}

export function listarNotasFiscaisPorVendedor(req: Request, res: Response) {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    try {
        const notasFiscais = vendedorService.listarNotasFiscaisPorVendedorId(id);
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

export function criarVendedor(req: Request, res: Response) {
    const data = req.body;
    try {
        vendedorService.criarVendedor(data);
        res.status(201).json({ message: 'Vendedor criado com sucesso' });
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

export function atualizarVendedor(req: Request, res: Response) {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    const data = req.body;
    try {
        const sucesso = vendedorService.atualizarVendedor(id, data);
        if (sucesso) {
            res.json({ message: 'Vendedor atualizado com sucesso' });
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

export function removerVendedor(req: Request, res: Response) {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    try {
        const sucesso = vendedorService.removerVendedor(id);
        if (sucesso) {
            res.json({ message: 'Vendedor removido com sucesso' });
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
