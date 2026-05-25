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
}
