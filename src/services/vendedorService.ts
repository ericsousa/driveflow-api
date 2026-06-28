import { Vendedor } from '../models/Vendedor';
import { NotaFiscal } from '../models/NotaFiscal';
import { VendedorRepository } from '../repositories/vendedorRepository';
import { NotaFiscalRepository } from '../repositories/notaFiscalRepository';
import { ValidationError, NotFoundError, ConflictError, BusinessError } from '../errors/AppError';

export class VendedorService {

    private vendedorRepository = VendedorRepository.getInstance(); // Get the singleton instance of VendedorRepository
    private notaFiscalRepository = NotaFiscalRepository.getInstance(); // Get the singleton instance of NotaFiscalRepository

    public async listarVendedores(): Promise<Vendedor[]> {
        return this.vendedorRepository.getVendedores();
    }

    public async buscarVendedorPorId(id: number): Promise<Vendedor> {
        const vendedor = await this.vendedorRepository.getVendedorById(id);
        if (!vendedor) {
            throw new NotFoundError('Vendedor não encontrado');
        }
        return vendedor;
    }

    public async listarNotasFiscaisPorVendedorId(id_vendedor: number): Promise<NotaFiscal[]> {
        const vendedorExistente = await this.vendedorRepository.getVendedorById(id_vendedor);
        if (!vendedorExistente) {
            throw new NotFoundError('Vendedor não encontrado');
        }
        return this.notaFiscalRepository.getNotasFiscaisByVendedorId(id_vendedor);
    }


    public async criarVendedor(data: any): Promise<Vendedor> {
        this.validaCamposObrigatorios(data);
        await this.validaMatricula(data.matricula);
        this.validaComissao(data.comissao_percentual);

        const vendedor = new Vendedor(null, data.nome, data.matricula, data.comissao_percentual);
        return this.vendedorRepository.addVendedor(vendedor);
    }

    public async atualizarVendedor(id: number, data: any): Promise<Vendedor> {
       
        this.validaCamposObrigatorios(data);
        await this.validaMatricula(data.matricula, id);
        this.validaComissao(data.comissao_percentual);

        // Verifica se o vendedor existe antes de tentar atualizar
        const vendedorExistente = await this.vendedorRepository.getVendedorById(id);
        if (!vendedorExistente) {
            throw new NotFoundError('Vendedor não encontrado');
        }

        const vendedor = new Vendedor(id, data.nome, data.matricula, data.comissao_percentual);
        await this.vendedorRepository.updateVendedor(id, vendedor);
        return vendedor;
    }

    public async removerVendedor(id: number): Promise<Vendedor> {

        // verifica se vendedor existe antes de tentar excluir
        const vendedorExistente = await this.vendedorRepository.getVendedorById(id);
        if (!vendedorExistente) {
           throw new NotFoundError('Vendedor não encontrado');
        }

        // verificar se vendedor possui notas fiscais associadas antes de permitir a exclusão
        const notasFiscaisAssociadas = await this.notaFiscalRepository.getNotasFiscaisByVendedorId(id);
        if (notasFiscaisAssociadas.length > 0) {
            throw new BusinessError('Não é possível excluir o vendedor, existem notas fiscais associadas a ele');
        }

        await this.vendedorRepository.deleteVendedor(id);
        return vendedorExistente;
    }

    private validaCamposObrigatorios(data: any): void {
        if (!data.nome) {
            throw new ValidationError('Campo nome é obrigatório');
        }
        if (!data.matricula) {
            throw new ValidationError('Campo matrícula é obrigatório');
        }
        if (data.comissao_percentual === undefined || data.comissao_percentual === null) {
            throw new ValidationError('Campo comissão percentual é obrigatório');
        }
    }
    
    private validaComissao(comissao_percentual: number): void {

        if (comissao_percentual < 0 || comissao_percentual > 30) {
            throw new ValidationError('Comissão percentual deve ser entre 0 e 30');
        }
    }

    private async validaMatricula(matricula: string, id?: number): Promise<void> {
        const vendedorExistente = (await this.vendedorRepository.getVendedores()).find(v => v.matricula === matricula);

        // Se não existe matricula igual, então é valida
        if (!vendedorExistente) {
            return; // Se a matrícula não existe, é válida
        }

        // Na criação, o parâmetro id é undefined
        // Então se a matrícula já existe, é inválida
        if (id === undefined) {
            throw new ConflictError('Matrícula já existe');
        }

        // Na atualização, o parâmetro id é enviado, 
        // Então, se a matrícula já existe, mas pertence a outro vendedor, é inválida
        if (vendedorExistente.id_vendedor !== id) {
            throw new ConflictError('Matrícula já existe');
        }
    }
}
