import { NotaFiscal } from '../models/NotaFiscal';
import { NotaFiscalRepository } from '../repositories/notaFiscalRepository';
import { ClienteRepository } from '../repositories/clienteRepository';
import { VendedorRepository } from '../repositories/vendedorRepository';
import { CarroRepository } from '../repositories/carroRepository';
import { EstoqueRepository } from '../repositories/estoqueRepository';

export class NotaFiscalService {

    private notaFiscalRepository = NotaFiscalRepository.getInstance(); 
    private clienteRepository = ClienteRepository.getInstance(); 
    private vendedorRepository = VendedorRepository.getInstance(); 
    private carroRepository = CarroRepository.getInstance(); 
    private estoqueRepository = EstoqueRepository.getInstance(); 
    
    public async listarNotasFiscais(): Promise<NotaFiscal[]> {
        return this.notaFiscalRepository.getNotasFiscais();
    }

    public async buscarNotaFiscalPorId(id: number): Promise<NotaFiscal> {
        const nota = await this.notaFiscalRepository.getNotaFiscalById(id);
        if (!nota) {
            throw new Error('Nota fiscal não encontrada.');
        }
        return nota;
    }

    public async criarNotaFiscal(data: any): Promise<NotaFiscal> {

        // validações de campos
        this.validarCamposObrigatorios(data);
        this.validaDataEmissao(data.data_emissao);
        this.validaValorTotal(data.valor_total);
        
        // validações que dependem do banco de dados
        await this.validaNotaUnica(data.numero_nota);
        await this.verificarExistenciaCliente(data.id_cliente);
        await this.verificarExistenciaVendedor(data.id_vendedor);
        await this.verificarExistenciaCarro(data.id_carro);
        await this.verificarEstoqueCarro(data.id_carro);

        // insere nota
        const nota = new NotaFiscal(
            null,
            data.numero_nota,
            data.data_emissao,
            data.valor_total,
            data.id_cliente,
            data.id_vendedor,
            data.id_carro
        );
        const notaCriada = await this.notaFiscalRepository.addNotaFiscal(nota);
        await this.decrementaEstoqueCarro(data.id_carro);
        return notaCriada;
    }

    private async verificarEstoqueCarro(id_carro: number): Promise<void> {
        const estoques = await this.estoqueRepository.getEstoquesByCarroId(id_carro);
        if (estoques.length === 0) {
            throw new Error('Carro não encontrado em estoque.');
        }

        if (estoques[0].quantidade <= 0) {
            throw new Error('Carro sem estoque disponível para venda.');
        }
    }

    private async decrementaEstoqueCarro(id_carro: number): Promise<void> {
        const updated = await this.estoqueRepository.baixaEstoque(id_carro);
        if (!updated) {
            throw new Error('Não foi possível atualizar o estoque do carro.');
        }
    }

    private async verificarExistenciaCliente(id_cliente: number): Promise<void> {
        const cliente = await this.clienteRepository.getClienteById(id_cliente);
        if (!cliente) {
            throw new Error('Cliente relacionado à nota fiscal não encontrado.');
        }
    }

    private async verificarExistenciaVendedor(id_vendedor: number): Promise<void> {
        const vendedor = await this.vendedorRepository.getVendedorById(id_vendedor);
        if (!vendedor) {
            throw new Error('Vendedor relacionado à nota fiscal não encontrado.');
        }
    }

    private async verificarExistenciaCarro(id_carro: number): Promise<void> {
        const carro = await this.carroRepository.getCarroById(id_carro);
        if (!carro) {
            throw new Error('Carro relacionado à nota fiscal não encontrado.');
        }
    }

    private async validaNotaUnica(numero_nota: string): Promise<void> {
        const notasFiscais = await this.notaFiscalRepository.getNotasFiscais();
        const notaExistente = notasFiscais.find(nota => nota.numero_nota === numero_nota);
        if (notaExistente) {
            throw new Error('Número da nota fiscal já existe. Deve ser único.');
        }
    }

    private validaDataEmissao(data_emissao: string | Date) {
        const dataAtual = new Date(data_emissao);
        if (isNaN(dataAtual.getTime())) {
            throw new Error('Data de emissão inválida.');
        }
        if (dataAtual > new Date()) {
            throw new Error('Data de emissão não pode ser futura.');
        }
    }

    private validaValorTotal(valor_total: number){
        if (valor_total <= 0) {
            throw new Error('Valor total deve ser maior que zero.');
        }
    }

    private validarCamposObrigatorios(data: any) {
        if (!data.numero_nota) {
            throw new Error('Campo numero_nota é obrigatório');
        }
        if (!data.data_emissao) {
            throw new Error('Campo data_emissao é obrigatório');
        }
        if (data.valor_total === undefined || data.valor_total === null) {
            throw new Error('Campo valor_total é obrigatório');
        }
        if (data.id_cliente === undefined || data.id_cliente === null) {
            throw new Error('Campo id_cliente é obrigatório');
        }
        if (data.id_vendedor === undefined || data.id_vendedor === null) {
            throw new Error('Campo id_vendedor é obrigatório');
        }
        if (data.id_carro === undefined || data.id_carro === null) {
            throw new Error('Campo id_carro é obrigatório');
        }
    }
}
