import { ClienteRepository } from '../repositories/clienteRepository';
import { Cliente } from '../models/Cliente';

export class ClienteService {

    private clienteRepository = ClienteRepository.getInstance(); // Get the singleton instance of ClienteRepository

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

        // ---- Verificar se cliente possui notas fiscais associadas antes de permitir a exclusão

        return this.clienteRepository.deleteCliente(id);
    }

    private validarCamposObrigatorios(cliente: any): void {
        if (!cliente.nome || !cliente.cpf || !cliente.telefone) {
            throw new Error('Campos obrigatórios não preenchidos');
        }
    }

    private validarCpfDuplicado(cpf: string, id?: number): void {
        const clienteExistente = this.clienteRepository.getClientes().find(cliente => cliente.cpf === cpf);

        // Se um cliente com o mesmo CPF já existir e 
        // Se o id for fornecido, verifica se o cliente encontrado é diferente do cliente que estamos atualizando 
        if (clienteExistente && (!id || clienteExistente.id_cliente !== id)) {
            throw new Error('CPF já cadastrado');
        }
    }
}


