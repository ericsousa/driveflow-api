import { Request, Response } from 'express';
import { ClienteService } from '../services/clienteService';

const clienteService = new ClienteService();

export function listarClientes(req: Request, res: Response): void {
    const clientes = clienteService.listarClientes();
    res.json(clientes);
}

export function buscarClientePorId(req: Request, res: Response): void {
    
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    const cliente = clienteService.buscarClientePorId(id);

    if (!cliente) {
        res.status(404).json({ error: 'Cliente não encontrado' });
        return;
    }
    res.json(cliente);
}

export function listarNotasFiscaisPorCliente(req: Request, res: Response): void {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    try {
        const notasFiscais = clienteService.listarNotasFiscaisPorClienteId(id);
        res.json(notasFiscais);
    } catch (e: unknown) {
        const message = (e as Error).message;
        if (message === 'Cliente não encontrado') {
            res.status(404).json({ error: message });
            return;
        } 
        res.status(400).json({ error: (e as Error).message });
    }
}

export function criarCliente(req: Request, res: Response): void {
    const cliente = req.body;
    try {
        clienteService.criarCliente(cliente);
        res.status(201).json({ message: 'Cliente criado com sucesso' });
    } catch (e: unknown) {
        const message = (e as Error).message;   
        if (message === 'CPF já cadastrado') {
            res.status(409).json({ error: message });
            return;
        }
        res.status(400).json({ error: (e as Error).message });
    }
}

export function atualizarCliente(req: Request, res: Response): void {

    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    const updatedCliente = req.body;    
    try {
        const sucesso = clienteService.atualizarCliente(id, updatedCliente);
        if (sucesso) {
            res.json({ message: 'Cliente atualizado com sucesso' });
        } else {
            res.status(404).json({ error: 'Cliente não encontrado' });
        }
    } catch (e: unknown) {
        const message = (e as Error).message;   
        if (message === 'CPF já cadastrado') {
            res.status(409).json({ error: message });
            return;
        }
        res.status(400).json({ error: (e as Error).message });
    }
}

export function removerCliente(req: Request, res: Response): void {

    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    try {
        const sucesso = clienteService.removerCliente(id);
        if (sucesso) {
            res.json({ message: 'Cliente removido com sucesso' });
        } else {
            res.status(404).json({ error: 'Cliente não encontrado' });
        }
    } catch (e: unknown) {
        res.status(400).json({ error: (e as Error).message });
    }
}

