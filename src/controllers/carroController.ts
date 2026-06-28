import { CarroService } from '../services/carroService';
import { Request, Response } from 'express';
import { AppError } from '../errors/AppError';

const carroService = new CarroService();

export async function listarCarros(req: Request, res: Response): Promise<void> {
    try {
        const carros = await carroService.listarCarros();
        res.json(carros);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
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
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function buscarCarrosDisponiveis(req: Request, res: Response): Promise<void> {
    try {
        const carrosDisponiveis = await carroService.buscarCarrosDisponiveis();
        res.json(carrosDisponiveis);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function criarCarro(req: Request, res: Response): Promise<void> {
    const data = req.body;
    try {
        const carroCriado = await carroService.criarCarro(data);
        res.status(201).json(carroCriado);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
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
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
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
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}