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

    public getNotasFiscais(): NotaFiscal[] {
        return this.notasFiscais;
    }

    public getNotasFiscaisByClienteId(id_cliente: number): NotaFiscal[] {
        return this.notasFiscais.filter(nota => nota.id_cliente === id_cliente);
    }

    public getNotasFiscaisByCarroId(id_carro: number): NotaFiscal[] {
        return this.notasFiscais.filter(nota => nota.id_carro === id_carro);
    }

    public getNotasFiscaisByVendedorId(id_vendedor: number): NotaFiscal[] {
        return this.notasFiscais.filter(nota => nota.id_vendedor === id_vendedor);
    }

    public getNotaFiscalById(id: number): NotaFiscal | undefined {
        return this.notasFiscais.find(nota => nota.id_nota === id);
    }

    public addNotaFiscal(notaFiscal: NotaFiscal): void {
        this.notasFiscais.push(notaFiscal);
    }

}