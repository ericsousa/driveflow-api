import { CarroService } from '../services/carroService';
import { Request, Response } from 'express';

const carroService = new CarroService();

export function listarCarros(req: Request, res: Response) {
    const carros = carroService.listarCarros();
    res.json(carros);
}

export function buscarCarroPorId(req: Request, res: Response) {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    const carro = carroService.buscarCarroPorId(id);
    if (!carro) {
        res.status(404).json({ error: 'Carro não encontrado' });
        return;
    }
    res.json(carro);
}

export function criarCarro(req: Request, res: Response) {
    const data = req.body;
    try {
        carroService.criarCarro(data);
        res.status(201).json({ message: 'Carro criado com sucesso' });
    } catch (error) {
        const message = (error as Error).message;
        if (message === 'Placa já existe') {
            res.status(409).json({ error: message });
            return;
        }
        res.status(400).json({ error: message });
    }
}

export function atualizarCarro(req: Request, res: Response) {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    const data = req.body;
    try {
        const sucesso = carroService.atualizarCarro(id, data);
        if (sucesso) {
            res.json({ message: 'Carro atualizado com sucesso' });
        } else {
            res.status(404).json({ error: 'Carro não encontrado' });
        }
    } catch (error) {
        const message = (error as Error).message;
        if (message === 'Placa já existe') {
            res.status(409).json({ error: message });
            return;
        }
        res.status(400).json({ error: message });
    }  
}

export function removerCarro(req: Request, res: Response) {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    try {
        const sucesso = carroService.removerCarro(id);
        if (sucesso) {
            res.json({ message: 'Carro removido com sucesso' });
        } else {
            res.status(404).json({ error: 'Carro não encontrado' });
        }
    } catch (error) {
        const message = (error as Error).message;
        res.status(400).json({ error: message });
    }
}


// --- Implementar carros diponíveis