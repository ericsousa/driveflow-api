import { Estoque } from '../models/Estoque';
import { EstoqueRepository } from '../repositories/estoqueRepository';
import { CarroRepository } from '../repositories/carroRepository';

export class EstoqueService {

    private estoqueRepository = EstoqueRepository.getInstance();
    private carroRepository = CarroRepository.getInstance();

    private gerarNovoId(): number {
        const estoques = this.estoqueRepository.getEstoques();
        if (estoques.length === 0) {
            return 1;
        }
        // map: percorre o array de estoques e extrai os id_estoque para uma array
        // ...: operador spread, espalha array em elementos individuais (1, 3, 5)
        // Math.max: encontra o maior valor
        const maiorId = Math.max(...estoques.map(estoque => estoque.id_estoque));
        return maiorId + 1;
    }

    public listarEstoques() {
        return this.estoqueRepository.getEstoques();
    }

    public buscarEstoquePorId(id: number) {
        const estoque = this.estoqueRepository.getEstoqueById(id);
        if (!estoque) {
            throw new Error('Estoque não encontrado');
        }
        return estoque;
    }

    public listarEstoquesPorCarroId(id_carro: number) {
        const carro = this.carroRepository.getCarroById(id_carro);
        if (!carro) {
            throw new Error('Carro não encontrado');
        }
        return this.estoqueRepository.getEstoquesByCarroId(id_carro);
    }

    public criarEstoque(data: any) {
        this.validaCamposObrigatorios(data);
        this.validaQuantidade(data.quantidade);
        this.validaDataEntrada(data.data_entrada);

        // verifica se carro existe, no repository carros
        const carro = this.carroRepository.getCarroById(data.id_carro);
        if (!carro) {
            throw new Error('Carro não encontrado');
        }

        // verifica se ja existe estoque para o carro, no repository estoques
        const estoquesExistentes = this.estoqueRepository.getEstoquesByCarroId(data.id_carro);
        if (estoquesExistentes.length > 0) {
            throw new Error('Já existe estoque para este carro');
        }

        const id_estoque = this.gerarNovoId();
        const estoque = new Estoque(
            id_estoque,
            data.id_carro,
            data.quantidade,
            data.localizacao_patio,
            new Date(data.data_entrada)
        );
        this.estoqueRepository.addEstoque(estoque);
    }

    public atualizarEstoque(id: number, data: any) {
        this.validaCamposObrigatorios(data);
        this.validaQuantidade(data.quantidade);
        this.validaDataEntrada(data.data_entrada);

        // verifica se carro existe, no repository carros
        const carro = this.carroRepository.getCarroById(data.id_carro);
        if (!carro) {
            throw new Error('Carro não encontrado');
        }

        // verifica se estoque existe, no repository estoques
        const estoqueExistente = this.estoqueRepository.getEstoqueById(id);
        if (!estoqueExistente) {
            throw new Error('Estoque não encontrado');
        }

        // verifica se ja existe outro estoque para o mesmo carro, no repository estoques
        // caso seja alterado o id_carro, essa verificação é necessária para evitar que 
        // um estoque seja atualizado para um carro que já possui outro estoque
        const estoquesDoCarro = this.estoqueRepository.getEstoquesByCarroId(data.id_carro);
        const estoqueDuplicado = estoquesDoCarro.some(estoque => estoque.id_estoque !== id);
        if (estoqueDuplicado) {
            throw new Error('Já existe estoque para este carro');
        }

        const estoqueAtualizado = new Estoque(id, data.id_carro, data.quantidade, data.localizacao_patio, new Date(data.data_entrada));
        const sucesso = this.estoqueRepository.updateEstoque(id, estoqueAtualizado);
        if (!sucesso) {
            throw new Error('Estoque não encontrado');
        }
        return sucesso;
    }

    public removerEstoque(id: number) {
        const estoqueExistente = this.estoqueRepository.getEstoqueById(id);
        if (!estoqueExistente) {
            throw new Error('Estoque não encontrado');
        }
        return this.estoqueRepository.deleteEstoque(id);
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
