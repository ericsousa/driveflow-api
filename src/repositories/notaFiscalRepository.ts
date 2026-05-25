import { NotaFiscal } from '../models/NotaFiscal';

export class NotaFiscalRepository {

    private static instance: NotaFiscalRepository; // Singleton instance, only accessible through getInstance()
    private notasFiscais: NotaFiscal[] = []; // In-memory storage for NotaFiscal instances

    private constructor() {} // Private constructor to prevent direct instantiation

    // Returns the singleton instance of NotaFiscalRepository
    public static getInstance(): NotaFiscalRepository {
        if (!this.instance) {
            this.instance = new NotaFiscalRepository();
        }
        return this.instance;
    }
}