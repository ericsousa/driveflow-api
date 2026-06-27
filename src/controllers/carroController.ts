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
    const carro = await carroService.buscarCarroPorId(id);
    if (!carro) {
        res.status(404).json({ error: 'Carro não encontrado' });
        return;
    }
    res.json(carro);
}

export async function buscarCarrosDisponiveis(req: Request, res: Response): Promise<void> {
    const carrosDisponiveis = await carroService.buscarCarrosDisponiveis();
    res.json(carrosDisponiveis);
}

export async function criarCarro(req: Request, res: Response): Promise<void> {
    const data = req.body;
    try {
        await carroService.criarCarro(data);
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

export async function atualizarCarro(req: Request, res: Response): Promise<void> {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    const data = req.body;
    try {
        const sucesso = await carroService.atualizarCarro(id, data);
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

export async function removerCarro(req: Request, res: Response): Promise<void> {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    try {
        const sucesso = await carroService.removerCarro(id);
        if (sucesso) {
            res.json({ message: 'Carro removido com sucesso' });
        } else {
            res.status(404).json({ error: 'Carro não encontrado' });
        }
    } catch (error) {
        const message = (error as Error).message;
        if (message === 'Não é possível excluir o carro, existem notas fiscais associadas a ele') {
            res.status(422).json({ error: message });
            return;
         }
        res.status(400).json({ error: message });
    }
}