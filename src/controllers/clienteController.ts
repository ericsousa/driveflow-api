import { Request, Response } from 'express';
import { ClienteService } from '../services/clienteService';
import { AppError } from '../errors/AppError';

const clienteService = new ClienteService();

export async function listarClientes(req: Request, res: Response): Promise<void> {
    try {
        const clientes = await clienteService.listarClientes();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function buscarClientePorId(req: Request, res: Response): Promise<void> {
    
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    try {
        const cliente = await clienteService.buscarClientePorId(id);
        res.status(200).json(cliente);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function listarNotasFiscaisPorCliente(req: Request, res: Response): Promise<void> {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    try {
        const notasFiscais = await clienteService.listarNotasFiscaisPorClienteId(id);
        res.json(notasFiscais);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function criarCliente(req: Request, res: Response): Promise<void> {
    const cliente = req.body;
    try {
        const clienteCriado = await clienteService.criarCliente(cliente);
        res.status(201).json(clienteCriado);
     } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}


export async function atualizarCliente(req: Request, res: Response): Promise<void> {

    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    const updatedCliente = req.body;    
    try {
        const clienteAtualizado = await clienteService.atualizarCliente(id, updatedCliente);
        res.json(clienteAtualizado);
     } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function removerCliente(req: Request, res: Response): Promise<void> {

    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    try {
        const clienteRemovido = await clienteService.removerCliente(id);
        res.json(clienteRemovido);
     } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

