import { Estoque } from '../models/Estoque';
import { EstoqueRepository } from '../repositories/estoqueRepository';
import { CarroRepository } from '../repositories/carroRepository';

export class EstoqueService {

    private estoqueRepository = EstoqueRepository.getInstance();
    private carroRepository = CarroRepository.getInstance();

    public async listarEstoques(): Promise<Estoque[]> {
        return await this.estoqueRepository.getEstoques();
    }

    public async buscarEstoquePorId(id: number): Promise<Estoque> {
        const estoque = await this.estoqueRepository.getEstoqueById(id);
        if (!estoque) {
            throw new Error('Estoque não encontrado');
        }
        return estoque;
    }

    public async listarEstoquesPorCarroId(id_carro: number): Promise<Estoque[]> {
        const carro = await this.carroRepository.getCarroById(id_carro);
        if (!carro) {
            throw new Error('Carro não encontrado');
        }
        return await this.estoqueRepository.getEstoquesByCarroId(id_carro);
    }

    public async criarEstoque(data: any): Promise<Estoque> {
        this.validaCamposObrigatorios(data);
        this.validaQuantidade(data.quantidade);
        this.validaDataEntrada(data.data_entrada);

        // verifica se carro existe, no repository carros
        const carro = await this.carroRepository.getCarroById(data.id_carro);
        if (!carro) {
            throw new Error('Carro não encontrado');
        }

        // verifica se ja existe estoque para o carro, no repository estoques
        const estoquesExistentes = await this.estoqueRepository.getEstoquesByCarroId(data.id_carro);
        if (estoquesExistentes.length > 0) {
            throw new Error('Já existe estoque para este carro');
        }

        const estoque = new Estoque(
            null,
            data.id_carro,
            data.quantidade,
            data.localizacao_patio,
            data.data_entrada
        );

        return this.estoqueRepository.addEstoque(estoque);
    }

    public async atualizarEstoque(id: number, data: any): Promise<Estoque> {
        this.validaCamposObrigatorios(data);
        this.validaQuantidade(data.quantidade);
        this.validaDataEntrada(data.data_entrada);

        // verifica se carro existe, no repository carros
        const carro = await this.carroRepository.getCarroById(data.id_carro);
        if (!carro) {
            throw new Error('Carro não encontrado');
        }

        // verifica se estoque existe, no repository estoques
        const estoqueExistente = await this.estoqueRepository.getEstoqueById(id);
        if (!estoqueExistente) {
            throw new Error('Estoque não encontrado');
        }

        // verifica se ja existe outro estoque para o mesmo carro, no repository estoques
        // caso seja alterado o id_carro, essa verificação é necessária para evitar que 
        // um estoque seja atualizado para um carro que já possui outro estoque
        const estoquesDoCarro = await this.estoqueRepository.getEstoquesByCarroId(data.id_carro);
        const estoqueDuplicado = estoquesDoCarro.some(estoque => estoque.id_estoque !== id);
        if (estoqueDuplicado) {
            throw new Error('Já existe estoque para este carro');
        }

        const estoqueAtualizado = new Estoque(id, data.id_carro, data.quantidade, data.localizacao_patio, data.data_entrada);
        await this.estoqueRepository.updateEstoque(id, estoqueAtualizado);
        return estoqueAtualizado;
    }

    public async removerEstoque(id: number): Promise<Estoque> {
        const estoqueExistente = await this.estoqueRepository.getEstoqueById(id);
        if (!estoqueExistente) {
            throw new Error('Estoque não encontrado');
        }
        await this.estoqueRepository.deleteEstoque(id);
        return estoqueExistente;
    }

    private validaCamposObrigatorios(data: any): void {
        if (data.id_carro === undefined || data.id_carro === null) {
            throw new Error('Campo id_carro é obrigatório');
        }
        if (data.quantidade === undefined || data.quantidade === null) {
            throw new Error('Campo quantidade é obrigatório');
        }
        if (!data.localizacao_patio) {
            throw new Error('Campo localizacao_patio é obrigatório');
        }
        if (!data.data_entrada) {
            throw new Error('Campo data_entrada é obrigatório');
        }
    }

    private validaQuantidade(quantidade: number): void {
        if (typeof quantidade !== 'number' || !Number.isInteger(quantidade) || quantidade < 0) {
            throw new Error('Campo quantidade deve ser um número inteiro maior ou igual a zero');
        }
    }

    private validaDataEntrada(data_entrada: string): void {
        const data = new Date(data_entrada);
        if (isNaN(data.getTime())) {
            throw new Error('Campo data_entrada deve ser uma data válida');
        }
        if (data > new Date()) {
            throw new Error('Campo data_entrada não pode ser uma data futura');
        }
    }
}
