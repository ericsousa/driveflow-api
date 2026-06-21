import { EstoqueService } from '../services/estoqueService';
import { Request, Response } from 'express';

const estoqueService = new EstoqueService();

export function listarEstoque(req: Request, res: Response) {
    const estoques = estoqueService.listarEstoques();
    res.json(estoques);
}

export function buscarEstoquePorId(req: Request, res: Response) {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    try {
        const estoque = estoqueService.buscarEstoquePorId(id);
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

export function listarEstoquePorCarroId(req: Request, res: Response) {
    const id_carro = parseInt(String(req.params.id_carro));
    if (isNaN(id_carro)) {
        res.status(400).json({ error: 'ID do carro inválido' });
        return;
    }

    try {
        const estoques = estoqueService.listarEstoquesPorCarroId(id_carro);
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

export function criarEstoque(req: Request, res: Response) {
    const data = req.body;
    try {
        estoqueService.criarEstoque(data);
        res.status(201).json({ message: 'Estoque criado com sucesso' });
    } catch (error) {
        const message = (error as Error).message;
        if (message === 'Carro não encontrado') {
            res.status(404).json({ error: message });
            return;
        }
        if (message === 'Já existe estoque para este carro') {
            res.status(400).json({ error: message });
            return;
        }
        res.status(400).json({ error: message });
    }
}

export function atualizarEstoque(req: Request, res: Response) {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    const data = req.body;
    try {
        estoqueService.atualizarEstoque(id, data);
        res.status(200).json({ message: 'Estoque atualizado com sucesso' });
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
            res.status(422).json({ error: message });
            return;
        }
        res.status(400).json({ error: message });
    }
}

export function removerEstoque(req: Request, res: Response) {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    try {
        const sucesso = estoqueService.removerEstoque(id);
        if (sucesso) {
            res.status(200).json({ message: 'Estoque removido com sucesso' });
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
