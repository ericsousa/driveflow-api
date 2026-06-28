import { Request, Response } from 'express';
import { ClienteService } from '../services/clienteService';

const clienteService = new ClienteService();

export async function listarClientes(req: Request, res: Response): Promise<void> {
    const clientes = await clienteService.listarClientes();
    res.json(clientes);
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
    } catch (error){
        const message = (error as Error).message;
        if (message === 'Cliente não encontrado') {
            res.status(404).json({ error: message });
            return;
        }
        res.status(400).json({ error: message });
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
    } catch (e: unknown) {
        const message = (e as Error).message;
        if (message === 'Cliente não encontrado') {
            res.status(404).json({ error: message });
            return;
        } 
        res.status(400).json({ error: (e as Error).message });
    }
}

export async function criarCliente(req: Request, res: Response): Promise<void> {
    const cliente = req.body;
    try {
        const clienteCriado = await clienteService.criarCliente(cliente);
        res.status(201).json(clienteCriado);
    } catch (e: unknown) {
        const message = (e as Error).message;   
        if (message === 'CPF já cadastrado') {
            res.status(409).json({ error: message });
            return;
        }
        res.status(400).json({ error: (e as Error).message });
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
    } catch (e: unknown) {
        const message = (e as Error).message;   
        if (message === 'Cliente não encontrado') {
            res.status(404).json({ error: message });
            return;
        }
        if (message === 'CPF já cadastrado') {
            res.status(409).json({ error: message });
            return;
        }
        res.status(400).json({ error: (e as Error).message });
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
    } catch (e: unknown) {

        const message = (e as Error).message;
        if (message === 'Cliente não encontrado') {
            res.status(404).json({ error: message });
            return;
        }
        if (message === 'Não é possível excluir o cliente, existem notas fiscais associadas a ele') {
            res.status(422).json({ error: (e as Error).message });
            return;
        }

        res.status(400).json({error: message });
    }
}

