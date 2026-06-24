import { Vendedor } from '../models/Vendedor';
import { executeQuery } from '../database/mysql';

export class VendedorRepository {

    private static instance: VendedorRepository; // Singleton instance, only accessible through getInstance()

    private constructor() {} // Private constructor to prevent direct instantiation

    // Returns the singleton instance of VendedorRepository
    public static getInstance(): VendedorRepository {
        if (!this.instance) {
            this.instance = new VendedorRepository();
        }
        return this.instance;
    }

        static getCreateTableQuery(): string {
        return `
            CREATE TABLE IF NOT EXISTS vendedores (
                id_vendedor INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(150) NOT NULL,
                matricula VARCHAR(50) NOT NULL UNIQUE,
                comissao_percentual DECIMAL(5,2) NOT NULL
            );
        `;
    }

    public async getVendedores(): Promise<Vendedor[]> {
        const linhas = await executeQuery('SELECT * FROM vendedores', []);
        return linhas.map((linha: any) => new Vendedor(
            linha.id_vendedor,
            linha.nome,
            linha.matricula,
            Number(linha.comissao_percentual)
        ));
    }

    public async getVendedorById(id: number): Promise<Vendedor | null> {
        const linhas = await executeQuery('SELECT * FROM vendedores WHERE id_vendedor = ?', [id]);
        if (linhas.length === 0) {
            return null;
        }
        return new Vendedor(
            linhas[0].id_vendedor,
            linhas[0].nome,
            linhas[0].matricula,
            Number(linhas[0].comissao_percentual)
        );
    }

    public async addVendedor(vendedor: Vendedor): Promise<Vendedor> {
        const result = await executeQuery(
            'INSERT INTO vendedores (nome, matricula, comissao_percentual) VALUES (?, ?, ?)',
            [vendedor.nome, vendedor.matricula, vendedor.comissao_percentual]
        );
        return new Vendedor(result.insertId, vendedor.nome, vendedor.matricula, vendedor.comissao_percentual);
    }

    public async updateVendedor(id: number, updatedVendedor: Vendedor): Promise<boolean> {
        const result = await executeQuery(
            'UPDATE vendedores SET nome = ?, matricula = ?, comissao_percentual = ? WHERE id_vendedor = ?',
            [updatedVendedor.nome, updatedVendedor.matricula, updatedVendedor.comissao_percentual, id]
        );
        return result.affectedRows > 0; // Returns true if the update was successful, false otherwise
    }

    public async deleteVendedor(id: number): Promise<boolean> {
        const result = await executeQuery('DELETE FROM vendedores WHERE id_vendedor = ?', [id]);
        return result.affectedRows > 0; // Returns true if the deletion was successful, false otherwise
    }
}
