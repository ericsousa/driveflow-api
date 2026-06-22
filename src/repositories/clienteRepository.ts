import { Cliente } from '../models/Cliente';

export class ClienteRepository {
    
    private static instance: ClienteRepository; // Singleton instance, only accessible through getInstance()
    private clientes: Cliente[] = []; // In-memory storage for Cliente instances

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

    public getClientes(): Cliente[] {
        return this.clientes;
    }

    public getClienteById(id: number): Cliente | undefined {
        return this.clientes.find(cliente => cliente.id_cliente === id);
    }

    public addCliente(cliente: Cliente): void {
        this.clientes.push(cliente);
    }

    public updateCliente(id: number, updatedCliente: Cliente): boolean {
        const index = this.clientes.findIndex(cliente => cliente.id_cliente === id);
        if (index !== -1) {
            this.clientes[index] = updatedCliente;
            return true;
        }
        return false;
    }

    public deleteCliente(id: number): boolean {
        const index = this.clientes.findIndex(cliente => cliente.id_cliente === id);
        if (index !== -1) {
            this.clientes.splice(index, 1);
            return true;
        }
        return false;
    }
}
