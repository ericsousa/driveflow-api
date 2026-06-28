import { NotaFiscal } from '../models/NotaFiscal';
import { executeQuery } from '../database/mysql';

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

    public async getNotasFiscais(): Promise<NotaFiscal[]> {

        const lines = await executeQuery('SELECT * FROM notas_fiscais', []);
        return lines.map((line: any) => new NotaFiscal(
            line.id_nota,
            line.numero_nota,
            line.data_emissao,
            Number(line.valor_total), //mysql devolve string par decimais
            line.id_cliente,
            line.id_vendedor,
            line.id_carro
        ));
    }

    public async getNotasFiscaisByClienteId(id_cliente: number): Promise<NotaFiscal[]> {
        const lines = await executeQuery(
            'SELECT * FROM notas_fiscais WHERE id_cliente = ?', 
            [id_cliente]
        );
        if (lines.length === 0) {
            return [];
        }
        return lines.map((line: any) => new NotaFiscal(
            line.id_nota,
            line.numero_nota,
            line.data_emissao,
            Number(line.valor_total),
            line.id_cliente,
            line.id_vendedor,
            line.id_carro
        ));
    }

    public async getNotasFiscaisByCarroId(id_carro: number): Promise<NotaFiscal[]> {
        const lines = await executeQuery(
            'SELECT * FROM notas_fiscais WHERE id_carro = ?', 
            [id_carro]
        );
        if (lines.length === 0) {
            return [];
        }
        return lines.map((line: any) => new NotaFiscal(
            line.id_nota,
            line.numero_nota,
            line.data_emissao,
            Number(line.valor_total),
            line.id_cliente,
            line.id_vendedor,
            line.id_carro
        ));
    }

    public async getNotasFiscaisByVendedorId(id_vendedor: number): Promise<NotaFiscal[]> {
        const lines = await executeQuery(
            'SELECT * FROM notas_fiscais WHERE id_vendedor = ?', 
            [id_vendedor]
        );
        if (lines.length === 0) {
            return [];
        }
        return lines.map((line: any) => new NotaFiscal(
            line.id_nota,
            line.numero_nota,
            line.data_emissao,
            Number(line.valor_total),
            line.id_cliente,
            line.id_vendedor,
            line.id_carro
        ));
    }

    public async getNotaFiscalById(id: number): Promise<NotaFiscal | null> {
        const lines = await executeQuery(
            'SELECT * FROM notas_fiscais WHERE id_nota = ?', 
            [id]
        );
        if (lines.length === 0) {
            return null;
        }
        const line = lines[0];
        return new NotaFiscal(
            line.id_nota,
            line.numero_nota,
            line.data_emissao,
            Number(line.valor_total),
            line.id_cliente,
            line.id_vendedor,
            line.id_carro
        );
    }

    public async addNotaFiscal(notaFiscal: NotaFiscal): Promise<NotaFiscal> {
        const result = await executeQuery(
            'INSERT INTO notas_fiscais (numero_nota, data_emissao, valor_total, id_cliente, id_vendedor, id_carro) VALUES (?, ?, ?, ?, ?, ?)',
            [
                notaFiscal.numero_nota,
                notaFiscal.data_emissao,
                Number(notaFiscal.valor_total),
                notaFiscal.id_cliente,
                notaFiscal.id_vendedor,
                notaFiscal.id_carro
            ]
        );
        return new NotaFiscal(
            result.insertId,
            notaFiscal.numero_nota,
            notaFiscal.data_emissao,
            Number(notaFiscal.valor_total),
            notaFiscal.id_cliente,
            notaFiscal.id_vendedor,
            notaFiscal.id_carro
        );
    }


}