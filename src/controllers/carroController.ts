import { CarroService } from '../services/carroService';
import { Request, Response } from 'express';

const carroService = new CarroService();

export async function listarCarros(req: Request, res: Response): Promise<void> {
    const carros = await carroService.listarCarros();
    res.json(carros);
}

export async function buscarCarroPorId(req: Request, res: Response): Promise<void> {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    
    try {
        const carro = await carroService.buscarCarroPorId(id);
        res.status(200).json(carro);
    } catch (error) {
        const message = (error as Error).message;
        if (message === 'Carro não encontrado') {
            res.status(404).json({ error: message });
            return;
        }
        res.status(400).json({ error: message });
    }
}

export async function buscarCarrosDisponiveis(req: Request, res: Response): Promise<void> {
    const carrosDisponiveis = await carroService.buscarCarrosDisponiveis();
    res.json(carrosDisponiveis);
}

export async function criarCarro(req: Request, res: Response): Promise<void> {
    const data = req.body;
    try {
        const carroCriado = await carroService.criarCarro(data);
        res.status(201).json(carroCriado);
    } catch (error) {
        const message = (error as Error).message;
        if (message === 'Placa já existe') {
            res.status(409).json({ error: message });
            return;
        }
        res.status(400).json({ error: message });
    }
}

export async function atualizarCarro(req: Request, res: Response): Promise<void> {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    const data = req.body;
    try {
        const carroAtualizado = await carroService.atualizarCarro(id, data);
        res.status(200).json(carroAtualizado);
    } catch (error) {
        const message = (error as Error).message;
        if (message === 'Carro não encontrado') {
            res.status(404).json({ error: message });
            return;
        }
        if (message === 'Placa já existe') {
            res.status(409).json({ error: message });
            return;
        }
        res.status(400).json({ error: message });
    }  
}

export async function removerCarro(req: Request, res: Response): Promise<void> {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    try {
        const carroRemovido = await carroService.removerCarro(id);
        res.status(200).json(carroRemovido);

    } catch (error) {
        const message = (error as Error).message;
        if (message === 'Carro não encontrado') {
            res.status(404).json({ error: message });
            return;
        }
        if (message === 'Não é possível excluir o carro, existem notas fiscais associadas a ele') {
            res.status(422).json({ error: message });
            return;
        }
        if (message === 'Não é possível excluir o carro, existem estoques associados a ele') {
            res.status(422).json({ error: message });
            return;
        }
        res.status(400).json({ error: message });
    }
}