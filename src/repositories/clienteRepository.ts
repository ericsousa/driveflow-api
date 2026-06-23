import { Cliente } from '../models/Cliente';
import { executeQuery } from '../database/mysql';

export class ClienteRepository {
    
    private static instance: ClienteRepository; // Singleton instance, only accessible through getInstance()

    private constructor() {} // Private constructor to prevent direct instantiation

    // Returns the singleton instance of ClienteRepository
    public static getInstance(): ClienteRepository {
        if (!this.instance) {
            this.instance = new ClienteRepository();
        }
        return this.instance;
    }

    static getCreateTableQuery(): string {
        return `
            CREATE TABLE IF NOT EXISTS clientes (
                id_cliente INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(150) NOT NULL,
                cpf VARCHAR(14) NOT NULL UNIQUE,
                telefone VARCHAR(20) NOT NULL,
                email VARCHAR(50),
                cidade VARCHAR(50)
            );
        `;
    }

    // Função deve ser assíncrona para lidar com operações de banco de dados
    public async getClientes(): Promise<Cliente[]> {
        // Busca todos os clientes do banco de dados
        const linhas = await executeQuery('SELECT * FROM clientes', []);

        // Map cria um um novo array de objetos Cliente a partir das linhas 
        // retornadas do banco de dados
        return linhas.map((linha: any) => new Cliente(
            linha.id_cliente,
            linha.nome,
            linha.cpf,
            linha.telefone,
            linha.email,
            linha.cidade
        ));
    }

    public async getClienteById(id: number): Promise<Cliente | null> {
        
        // Busca o cliente pelo ID no banco de dados
        const linhas = await executeQuery('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
        
        // Se não houver linhas retornadas, significa que o cliente não foi encontrado
        if (linhas.length === 0) { 
            return null;
        }

        // Retorna o primeiro cliente encontrado, já que o ID é único
        return new Cliente(
            linhas[0].id_cliente,
            linhas[0].nome,
            linhas[0].cpf,
            linhas[0].telefone,
            linhas[0].email,
            linhas[0].cidade
        );
    }

    public async addCliente(cliente: Cliente): Promise<Cliente> {

        const result = await executeQuery(
            'INSERT INTO clientes (nome, cpf, telefone, email, cidade) VALUES (?, ?, ?, ?, ?)',
            [cliente.nome, cliente.cpf, cliente.telefone, cliente.email ?? null, cliente.cidade ?? null]
        );

        // Ao inserir um novo cliente o banco retorna um objeto ResultSetHeader que contém entre
        // outras informações, o insertId que é o ID gerado pelo banco de dados com auto_increment
        return new Cliente(result.insertId, cliente.nome, cliente.cpf, cliente.telefone, cliente.email, cliente.cidade);
    }

    public async updateCliente(id: number, updatedCliente: Cliente): Promise<boolean> {

        const result = await executeQuery(
            'UPDATE clientes SET nome = ?, cpf = ?, telefone = ?, email = ?, cidade = ? WHERE id_cliente = ?',
            [updatedCliente.nome, updatedCliente.cpf, updatedCliente.telefone, updatedCliente.email ?? null, updatedCliente.cidade ?? null, id]
        );       
        return result.affectedRows > 0;  // Retorna true se algum registro foi atualizado, caso contrário false
    }

    public async deleteCliente(id: number): Promise<boolean> {

        const result = await executeQuery(
            'DELETE FROM clientes WHERE id_cliente = ?',
            [id]
        );
        return result.affectedRows > 0; // Retorna true se algum registro foi deletado, caso contrário false
    }
}
