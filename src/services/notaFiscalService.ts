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
    

    private gerarNovoId(): number {
        const notasFiscais = this.notaFiscalRepository.getNotasFiscais();
        if (notasFiscais.length === 0) {
            return 1; 
        }
        // map: percorre o array de notas fiscais e extrai os id_nota para uma array
        // ...: operador spread, espalha array em elementos individuais (1, 3, 5)
        // Math.max: encontra o maior valor 
        const maiorId = Math.max(...notasFiscais.map(nota => nota.id_nota));
        return maiorId + 1;
    }

    public listarNotasFiscais() {
        return this.notaFiscalRepository.getNotasFiscais();
    }

    public buscarNotaFiscalPorId(id: number) {
        const nota = this.notaFiscalRepository.getNotaFiscalById(id);
        if (!nota) {
            throw new Error('Nota fiscal não encontrada.');
        }
        return nota;
    }

    public criarNotaFiscal(data: any) {

        // validações de campos
        this.validarCamposObrigatorios(data);
        this.validaNotaUnica(data.numero_nota);
        this.validaDataEmissao(data.data_emissao);
        this.validaValorTotal(data.valor_total);

        // verificação de existência de cliente, vendedor e carro
        this.verificarExistenciaCliente(data.id_cliente);
        this.verificarExistenciaVendedor(data.id_vendedor);
        this.verificarExistenciaCarro(data.id_carro);

        // verifica estoque do carro
        this.verificarEstoqueCarro(data.id_carro);

        // formata data de emissão para Date
        const data_emissao = new Date(data.data_emissao);

        const novoId = this.gerarNovoId();
        const notaFiscal = new NotaFiscal(
            novoId,
            data.numero_nota,
            data_emissao,
            data.valor_total,
            data.id_cliente,
            data.id_vendedor,
            data.id_carro
        );
        this.notaFiscalRepository.addNotaFiscal(notaFiscal);

         // atualiza estoque do carro vendido
        this.atualizarEstoqueCarro(data.id_carro);
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

    private atualizarEstoqueCarro(id_carro: number): void {
        const updated = this.estoqueRepository.baixaEstoque(id_carro);
        if (!updated) {
            throw new Error('Não foi possível atualizar o estoque do carro.');
        }
    }

    private verificarExistenciaCliente(id_cliente: number): void {
        const cliente = this.clienteRepository.getClienteById(id_cliente);
        if (!cliente) {
            throw new Error('Cliente relacionado à nota fiscal não encontrado.');
        }
    }

    private verificarExistenciaVendedor(id_vendedor: number): void {
        const vendedor = this.vendedorRepository.getVendedorById(id_vendedor);
        if (!vendedor) {
            throw new Error('Vendedor relacionado à nota fiscal não encontrado.');
        }
    }

    private verificarExistenciaCarro(id_carro: number): void {
        const carro = this.carroRepository.getCarroById(id_carro);
        if (!carro) {
            throw new Error('Carro relacionado à nota fiscal não encontrado.');
        }
    }

    private validaNotaUnica(numero_nota: string): void {
        const notasFiscais = this.notaFiscalRepository.getNotasFiscais();
        const notaExistente = notasFiscais.find(nota => nota.numero_nota === numero_nota);
        if (notaExistente) {
            throw new Error('Número da nota fiscal já existe. Deve ser único.');
        }
    }

    private validaDataEmissao(data_emissao: string | Date): void {
        const dataAtual = new Date(data_emissao);
        if (isNaN(dataAtual.getTime())) {
            throw new Error('Data de emissão inválida.');
        }
        if (dataAtual > new Date()) {
            throw new Error('Data de emissão não pode ser futura.');
        }
    }

    private validaValorTotal(valor_total: number): void {
        if (valor_total <= 0) {
            throw new Error('Valor total deve ser maior que zero.');
        }
    }
    
    private validarCamposObrigatorios(data: any): void {
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
