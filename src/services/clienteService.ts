import { Cliente } from '../models/Cliente';
import { NotaFiscal } from '../models/NotaFiscal';
import { ClienteRepository } from '../repositories/clienteRepository';
import { NotaFiscalRepository } from '../repositories/notaFiscalRepository';
import { ValidationError, NotFoundError, ConflictError, BusinessError } from '../errors/AppError';

export class ClienteService {

    private clienteRepository = ClienteRepository.getInstance(); // Get the singleton instance of ClienteRepository
    private notaFiscalRepository = NotaFiscalRepository.getInstance(); // Get the singleton instance of NotaFiscalRepository

    public async listarClientes(): Promise<Cliente[]> {
        return this.clienteRepository.getClientes();
    }

    public async buscarClientePorId(id: number): Promise<Cliente> {
        const cliente = await this.clienteRepository.getClienteById(id);
        if (!cliente) {
            throw new NotFoundError('Cliente não encontrado');
        }
        return cliente;
    }

    public async listarNotasFiscaisPorClienteId(id_cliente: number): Promise<NotaFiscal[]> {
        const clienteExistente = await this.clienteRepository.getClienteById(id_cliente);
        if (!clienteExistente) {
            throw new NotFoundError('Cliente não encontrado');
        }
        return this.notaFiscalRepository.getNotasFiscaisByClienteId(id_cliente);
    }

    public async criarCliente(data: any): Promise<Cliente> {

        this.validarCamposObrigatorios(data);
        await this.validarCpfDuplicado(data.cpf);

        const cliente = new Cliente(null, data.nome, data.cpf, data.telefone, data.email, data.cidade);
        return this.clienteRepository.addCliente(cliente);
    }

    public async atualizarCliente(id: number, data: any): Promise<Cliente> {

        this.validarCamposObrigatorios(data);
        await this.validarCpfDuplicado(data.cpf, id);

        // Verifica se o cliente existe antes de tentar atualizar
        const clienteExistente = await this.clienteRepository.getClienteById(id);
        if (!clienteExistente) {
            throw new NotFoundError('Cliente não encontrado');
        }

        const cliente = new Cliente(id, data.nome, data.cpf, data.telefone, data.email, data.cidade);
        await this.clienteRepository.updateCliente(id, cliente);
        return cliente;
    }

    public async removerCliente(id: number): Promise<Cliente > {

        // verifica se cliente existe antes de tentar excluir
        const clienteExistente = await this.clienteRepository.getClienteById(id);
        if (!clienteExistente) {
            throw new NotFoundError('Cliente não encontrado');
        }

        // verificar se cliente possui notas fiscais associadas antes de permitir a exclusão
        const notasFiscaisAssociadas = await this.notaFiscalRepository.getNotasFiscaisByClienteId(id);
        if (notasFiscaisAssociadas.length > 0) {
            throw new BusinessError('Não é possível excluir o cliente, existem notas fiscais associadas a ele');
        }

        await this.clienteRepository.deleteCliente(id);
        return clienteExistente;
    }

    private validarCamposObrigatorios(cliente: any): void {
        if (!cliente.nome || !cliente.cpf || !cliente.telefone) {
            throw new ValidationError('Campos obrigatórios não preenchidos');
        }
    }

    private async validarCpfDuplicado(cpf: string, id?: number): Promise<void> {

        // Parentese server para indicar ordem de precedência, garantindo que a
        // função getClientes() seja chamada e resolvida antes do método find()
        const clienteExistente = (await this.clienteRepository.getClientes()).find(cliente => cliente.cpf === cpf);

        // Se não existe nenhum cliente com esse CPF, então não há duplicidade
        if (!clienteExistente) {
            return; 
        }

        // Na criação, o parâmetro id não é envido
        // Então, se já existe um cliente com o mesmo CPF, é uma duplicidade
        if (id === undefined) {
            throw new ConflictError('CPF já cadastrado');
        }

        // Na atualização, só há conflito se o CPF encontrado pertencer a outro cliente
        if (clienteExistente.id_cliente !== id) {
            throw new ConflictError('CPF já cadastrado');
        }
    }
}


