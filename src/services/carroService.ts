import { Carro } from '../models/Carro';
import { CarroRepository } from '../repositories/carroRepository';

export class CarroService {

    private carroRepository = CarroRepository.getInstance(); // Get the singleton instance of CarroRepository

    private gerarNovoId(): number {
        const carros = this.carroRepository.getCarros();
        if (carros.length === 0) {
            return 1; 
        }
        // map: percorre o array de carros e extrai os id_carro para uma array
        // ...: operador spread, espalha array em elementos individuais (1, 3, 5)
        // Math.max: encontra o maior valor 
        const maiorId = Math.max(...carros.map(carro => carro.id_carro));
        return maiorId + 1;
    }

    public listarCarros() {
        return this.carroRepository.getCarros();
    }

    public buscarCarroPorId(id: number) {
        return this.carroRepository.getCarroById(id);
    }

    public criarCarro(data: any) {
        this.validaCamposObrigatorios(data);
        this.validaPlaca(data.placa);
        this.validaAno(data.ano);
        this.validaPreco(data.preco);

        const id_carro = this.gerarNovoId();
        const carro = new Carro(id_carro, data.marca, data.modelo, data.ano, data.placa, data.preco, data.cor);
        this.carroRepository.addCarro(carro);
    }

    public atualizarCarro(id: number, data: any) {
        this.validaCamposObrigatorios(data);
        this.validaPlaca(data.placa, id);
        this.validaAno(data.ano);
        this.validaPreco(data.preco);

        const carro = new Carro(id, data.marca, data.modelo, data.ano, data.placa, data.preco, data.cor);
        return this.carroRepository.updateCarro(id, carro);
    }

    public removerCarro(id: number) {

        // --- verificar se carro possui notas fiscais associadas antes de permitir a exclusão

        return this.carroRepository.deleteCarro(id);
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

    private validaPlaca(placa: string, id?: number): void {

        const carroExistente = this.carroRepository.getCarros().find(carro => carro.placa === placa);
        if (!carroExistente) {
          return; // Placa é única, pode ser usada
        }

        // Criação de um novo carro
        if (id === undefined) {
          throw new Error('Placa já existe');
        }

        // Atualização de um carro existente
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