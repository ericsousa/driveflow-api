import { Estoque } from '../models/Estoque';
import { executeQuery } from '../database/mysql';

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

    static getCreateTableQuery(): string {
        return `
            CREATE TABLE IF NOT EXISTS estoques (
                id_estoque INT AUTO_INCREMENT PRIMARY KEY,
                id_carro INT NOT NULL UNIQUE,
                quantidade INT NOT NULL,
                localizacao_patio VARCHAR(255) NOT NULL,
                data_entrada DATE NOT NULL,
                FOREIGN KEY (id_carro) REFERENCES carros(id_carro)
            );
        `;
    }

    public async getEstoques(): Promise<Estoque[]> {
        const linhas = await executeQuery('SELECT * FROM estoques', []);
        return linhas.map((linha: any) => new Estoque(
            linha.id_estoque,
            linha.id_carro,
            linha.quantidade,
            linha.localizacao_patio,
            linha.data_entrada
        ));
    }

    public async getEstoqueById(id: number): Promise<Estoque | null> {
       const linhas = await executeQuery('SELECT * FROM estoques WHERE id_estoque = ?', [id]);
       if (linhas.length === 0) {
           return null;
       }
         return new Estoque(
            linhas[0].id_estoque,
            linhas[0].id_carro,
            linhas[0].quantidade,
            linhas[0].localizacao_patio,
            linhas[0].data_entrada
        );
    }

    public async getEstoquesByCarroId(id_carro: number): Promise<Estoque[]> {
        const linhas = await executeQuery('SELECT * FROM estoques WHERE id_carro = ?', [id_carro]);
        return linhas.map((linha: any) => new Estoque(
            linha.id_estoque,
            linha.id_carro,
            linha.quantidade,
            linha.localizacao_patio,
            linha.data_entrada
        ));
    }

    public async addEstoque(estoque: Estoque): Promise<Estoque> {
        const linhas = await executeQuery('INSERT INTO estoques (id_carro, quantidade, localizacao_patio, data_entrada) VALUES (?, ?, ?, ?)', [
            estoque.id_carro,
            estoque.quantidade,
            estoque.localizacao_patio,
            estoque.data_entrada
        ]);
        return new Estoque(linhas.insertId, estoque.id_carro, estoque.quantidade, estoque.localizacao_patio, estoque.data_entrada);
    }

    public async updateEstoque(id: number, updatedEstoque: Estoque): Promise<boolean> {
        const result = await executeQuery(
            'UPDATE estoques SET id_carro = ?, quantidade = ?, localizacao_patio = ?, data_entrada = ? WHERE id_estoque = ?',
            [updatedEstoque.id_carro, updatedEstoque.quantidade, updatedEstoque.localizacao_patio, updatedEstoque.data_entrada, id]
        );
        return result.affectedRows > 0; // Returns true if the update was successful, false otherwise
    }

    public async baixaEstoque(id_carro: number): Promise<boolean> {

        // Mitigaçao de risco:
        // Vericação de quantidade de estoque antes de dar baixa, para evitar que o estoque fique negativo
        const linhas = await executeQuery('SELECT quantidade FROM estoques WHERE id_carro = ? AND quantidade > 0', [id_carro]);
        if (linhas.length === 0) {
            return false; // No stock available for the given car ID
        }

        const result = await executeQuery(
            'UPDATE estoques SET quantidade = quantidade - 1 WHERE id_carro = ? AND quantidade > 0',
            [id_carro]
        );
        return result.affectedRows > 0; // Returns true if the stock was successfully decremented, false otherwise
    }

    public async deleteEstoque(id: number): Promise<boolean> {
        const result = await executeQuery(
            'DELETE FROM estoques WHERE id_estoque = ?', 
            [id]
        )
        return result.affectedRows > 0; // Returns true if the deletion was successful, false otherwise
    }
}