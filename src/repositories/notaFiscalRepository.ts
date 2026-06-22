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

    static getCreateTableQuery(): string {
        return `
            CREATE TABLE IF NOT EXISTS notas_fiscais (
                id_nota INT AUTO_INCREMENT PRIMARY KEY,
                numero_nota VARCHAR(50) NOT NULL UNIQUE,
                data_emissao DATE NOT NULL,
                valor_total DECIMAL(10, 2) NOT NULL,
                id_cliente INT NOT NULL,
                id_vendedor INT NOT NULL,
                id_carro INT NOT NULL,
                FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
                FOREIGN KEY (id_vendedor) REFERENCES vendedores(id_vendedor),
                FOREIGN KEY (id_carro) REFERENCES carros(id_carro)
            );
        `;
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