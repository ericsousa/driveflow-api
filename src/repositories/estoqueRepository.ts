import { Estoque } from '../models/Estoque';

export class EstoqueRepository {

    private static instance: EstoqueRepository; // Singleton instance, only accessible through getInstance()
    private estoques: Estoque[] = []; // In-memory storage for Estoque instances

    private constructor() {} // Private constructor to prevent direct instantiation

    // Returns the singleton instance of EstoqueRepository
    public static getInstance(): EstoqueRepository {
        if (!this.instance) {
            this.instance = new EstoqueRepository();
        }
        return this.instance;
    }
}