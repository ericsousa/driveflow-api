import { Cliente } from '../models/Cliente';
import { ClienteRepository } from '../repositories/clienteRepository';
import { NotaFiscalRepository } from '../repositories/notaFiscalRepository';

export class ClienteService {

    private clienteRepository = ClienteRepository.getInstance(); // Get the singleton instance of ClienteRepository
    private notaFiscalRepository = NotaFiscalRepository.getInstance(); // Get the singleton instance of NotaFiscalRepository

    private gerarNovoId(): number {
        const clientes = this.clienteRepository.getClientes();
        if (clientes.length === 0) {
            return 1; 
        }
        // map: percorre o array de clientes e extrai os id_cliente para uma array
        // ...: operador spread, espalha array em elementos individuais (1, 3, 5)
        // Math.max: encontra o maior valor 
        const maiorId = Math.max(...clientes.map(cliente => cliente.id_cliente));
        return maiorId + 1;
    }

    public listarClientes() {
        return this.clienteRepository.getClientes();
    }

    public buscarClientePorId(id: number) {
        return this.clienteRepository.getClienteById(id);
    }

    public criarCliente(data: any) {

        this.validarCamposObrigatorios(data);
        this.validarCpfDuplicado(data.cpf);

        const id_cliente = this.gerarNovoId();
        const cliente = new Cliente(id_cliente, data.nome, data.cpf, data.telefone, data.email, data.cidade);

        this.clienteRepository.addCliente(cliente);
    }

    public atualizarCliente(id: number, data: any) {

        this.validarCamposObrigatorios(data);
        this.validarCpfDuplicado(data.cpf, id);

        const cliente = new Cliente(id, data.nome, data.cpf, data.telefone, data.email, data.cidade);

        return this.clienteRepository.updateCliente(id, cliente);
    }

    public removerCliente(id: number) {

        // verifica se cliente existe antes de tentar excluir
        const clienteExistente = this.clienteRepository.getClienteById(id);
        if (!clienteExistente) {
            throw new Error('Cliente não encontrado');
        }

        // verificar se cliente possui notas fiscais associadas antes de permitir a exclusão
        const notasFiscaisAssociadas = this.notaFiscalRepository.getNotasFiscaisByClienteId(id);
        if (notasFiscaisAssociadas.length > 0) {
            throw new Error('Não é possível excluir o cliente, existem notas fiscais associadas a ele');
        }

        return this.clienteRepository.deleteCliente(id);
    }

    private validarCamposObrigatorios(cliente: any): void {
        if (!cliente.nome || !cliente.cpf || !cliente.telefone) {
            throw new Error('Campos obrigatórios não preenchidos');
        }
    }

    private validarCpfDuplicado(cpf: string, id?: number): void {
        const clienteExistente = this.clienteRepository.getClientes().find(cliente => cliente.cpf === cpf);

        // Se não existe nenhum cliente com esse CPF, então não há duplicidade
        if (!clienteExistente) {
            return; 
        }

        // Na criação, o parâmetro id não é envido
        // Então, se já existe um cliente com o mesmo CPF, é uma duplicidade
        if (id === undefined) {
            throw new Error('CPF já cadastrado');
        }

        // Na atualização, só há conflito se o CPF encontrado pertencer a outro cliente
        if (clienteExistente.id_cliente !== id) {
            throw new Error('CPF já cadastrado');
        }
    }
}


