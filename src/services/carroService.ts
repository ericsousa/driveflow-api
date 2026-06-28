import { Carro } from '../models/Carro';
import { CarroRepository } from '../repositories/carroRepository';
import { NotaFiscalRepository } from '../repositories/notaFiscalRepository';
import { EstoqueRepository } from '../repositories/estoqueRepository';

export class CarroService {

    private carroRepository = CarroRepository.getInstance(); // Get the singleton instance of CarroRepository
    private notaFiscalRepository = NotaFiscalRepository.getInstance(); // Get the singleton instance of NotaFiscalRepository
    private estoqueRepository = EstoqueRepository.getInstance(); // Get the singleton instance of EstoqueRepository

    public async listarCarros(): Promise<Carro[]> {
        return this.carroRepository.getCarros();
    }

    public async buscarCarroPorId(id: number): Promise<Carro> {
        const carro = await this.carroRepository.getCarroById(id);
        if (!carro) {
            throw new Error('Carro não encontrado');
        }
        return carro;
    }

    public async buscarCarrosDisponiveis(): Promise<Carro[]> {
        return await this.carroRepository.getCarrosDisponiveis();
    }

    public async criarCarro(data: any): Promise<Carro> {
        
        this.validaCamposObrigatorios(data);
        this.validaAno(data.ano);
        this.validaPreco(data.preco);

        await this.validaPlaca(data.placa); 

        const carro = new Carro(null, data.marca, data.modelo, data.ano, data.placa, data.preco, data.cor);
        return await this.carroRepository.addCarro(carro);
    }

    public async atualizarCarro(id: number, data: any): Promise<Carro> {
        this.validaCamposObrigatorios(data);
        await this.validaPlaca(data.placa, id);
        this.validaAno(data.ano);
        this.validaPreco(data.preco);

        // verifica se o carro existe antes de tentar atualizar
        const carroExistente = await this.carroRepository.getCarroById(id);
        if(!carroExistente) {
            throw new Error('Carro não encontrado');
        }
        
        const carro = new Carro(id, data.marca, data.modelo, data.ano, data.placa, data.preco, data.cor);
        await this.carroRepository.updateCarro(id, carro);
        return carro;
    }

    public async removerCarro(id: number): Promise<Carro> {

        // verifica se carro existe antes de tentar excluir
        const carroExistente = await this.carroRepository.getCarroById(id);
        if (!carroExistente) {
            throw new Error('Carro não encontrado');
        }

        // verificar se carro possui notas fiscais associadas antes de permitir a exclusão
        const notasFiscaisAssociadas = await this.notaFiscalRepository.getNotasFiscaisByCarroId(id);
        if (notasFiscaisAssociadas.length > 0) {
            throw new Error('Não é possível excluir o carro, existem notas fiscais associadas a ele');
        }

        // verifica se carro possui estoque associado antes de permitir a exclusão
        const estoquesAssociados = await this.estoqueRepository.getEstoquesByCarroId(id);
        if (estoquesAssociados.length > 0) {
            throw new Error('Não é possível excluir o carro, existem estoques associados a ele');
        }

        await this.carroRepository.deleteCarro(id);
        return carroExistente;  // Retorna o carro que foi removido
    }


    private validaCamposObrigatorios(data: any): void {
        if (!data.marca) {
            throw new Error('Campo marca é obrigatório');
        }
        if (!data.modelo) {
            throw new Error('Campo modelo é obrigatório');
        }
        if (!data.ano) {
            throw new Error('Campo ano é obrigatório');
        }
        if (!data.placa) {
            throw new Error('Campo placa é obrigatório');
        }
        if (data.preco === undefined || data.preco === null) {
            throw new Error('Campo preço é obrigatório');
        }
        if (!data.cor) {
            throw new Error('Campo cor é obrigatório');
        }
    }  

    private async validaPlaca(placa: string, id?: number): Promise<void> {

        //Busca 
        const carroExistente = await this.carroRepository.getCarroByPlaca(placa);

        // Se não existir carro com a placa informada, então a placa é válida
        if (!carroExistente) {
          return; // Placa é única, pode ser usada
        }

        // Se for na criação de novo carro e a placa já existir da erro
        if (id === undefined) {
          throw new Error('Placa já existe');
        }

        // Se for na atualização de um carro existente
        // Só da erro se a placa encontrada pertencer a outro carro
        if (carroExistente.id_carro !== id) {
          throw new Error('Placa já existe');
        }
    }

    private validaAno(ano: number): void {
        
        if (!Number.isInteger(ano)) {
            throw new Error('Ano deve ser um número inteiro');
        }

        if (ano < 1950 || ano > new Date().getFullYear() + 1) {
            throw new Error('Ano deve ser entre 1950 e o próximo ano');
        }
    }

    private validaPreco(preco: number): void {
        if (typeof preco !== 'number' || preco <= 0) {
            throw new Error('Preço deve ser um número positivo');
        }
    }
}