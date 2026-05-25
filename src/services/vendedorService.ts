import { VendedorRepository } from '../repositories/vendedorRepository';
import { Vendedor } from '../models/Vendedor';

export class VendedorService {

    private vendedorRepository = VendedorRepository.getInstance(); // Get the singleton instance of VendedorRepository

    private gerarNovoId(): number {
        const vendedores = this.vendedorRepository.getVendedores();
        if (vendedores.length === 0) {
            return 1; 
        } 
        // map: percorre o array de clientes e extrai os id_cliente para uma array
        // ...: operador spread, espalha array em elementos individuais (1, 3, 5)
        // Math.max: encontra o maior valor 
        const maiorId = Math.max(...vendedores.map(vendedor => vendedor.id_vendedor));
        return maiorId + 1;
    }

    public listarVendedores() {
        return this.vendedorRepository.getVendedores();
    }

    public buscarVendedorPorId(id: number) {
        return this.vendedorRepository.getVendedorById(id);
    }

    public criarVendedor(data: any) {
        this.validaCamposObrigatorios(data);
        this.validaMatricula(data.matricula);
        this.validaComissao(data.comissao_percentual);

        const id_vendedor = this.gerarNovoId();
        const vendedor = new Vendedor(id_vendedor, data.nome, data.matricula, data.comissao_percentual);
        this.vendedorRepository.addVendedor(vendedor);
    }

    public atualizarVendedor(id: number, data: any) {
        this.validaCamposObrigatorios(data);
        this.validaMatricula(data.matricula, id);
        this.validaComissao(data.comissao_percentual);

        const vendedor = new Vendedor(id, data.nome, data.matricula, data.comissao_percentual);
        return this.vendedorRepository.updateVendedor(id, vendedor);
    }

    public removerVendedor(id: number) {

        // --- verificar se vendedor possui notas fiscais associadas antes de permitir a exclusão

        return this.vendedorRepository.deleteVendedor(id);
    }

    private validaCamposObrigatorios(data: any): void {
        if (!data.nome) {
            throw new Error('Campo nome é obrigatório');
        }
        if (!data.matricula) {
            throw new Error('Campo matrícula é obrigatório');
        }
        if (data.comissao_percentual === undefined || data.comissao_percentual === null) {
            throw new Error('Campo comissão percentual é obrigatório');
        }
    }
    
    private validaComissao(comissao_percentual: number): void {

        if (comissao_percentual < 0 || comissao_percentual > 30) {
            throw new Error('Comissão percentual deve ser entre 0 e 30');
        }
    }

    private validaMatricula(matricula: string, id?: number): void {
        const vendedorExistente = this.vendedorRepository.getVendedores().find(v => v.matricula === matricula);

        // Se não existe matricula igual, então é valida
        if (!vendedorExistente) {
            return; // Se a matrícula não existe, é válida
        }

        // Na criação, o parâmetro id é undefined
        // Então se a matrícula já existe, é inválida
        if (id === undefined) {
            throw new Error('Matrícula já existe');
        }

        // Na atualização, o parâmetro id é enviado, 
        // Então, se a matrícula já existe, mas pertence a outro vendedor, é inválida
        if (vendedorExistente.id_vendedor !== id) {
            throw new Error('Matrícula já existe');
        }
    }
}
