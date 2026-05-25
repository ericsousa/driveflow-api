import { Vendedor } from '../models/Vendedor';

export class VendedorRepository {

    private static instance: VendedorRepository; // Singleton instance, only accessible through getInstance()
    private vendedores: Vendedor[] = []; // In-memory storage for Vendedor instances

    private constructor() {} // Private constructor to prevent direct instantiation

    // Returns the singleton instance of VendedorRepository
    public static getInstance(): VendedorRepository {
        if (!this.instance) {
            this.instance = new VendedorRepository();
        }
        return this.instance;
    }
}

