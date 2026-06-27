import { Carro } from '../models/Carro';
import { executeQuery } from '../database/mysql';

export class CarroRepository {

    private static instance: CarroRepository; // Singleton instance, only accessible through getInstance()
    private carros: Carro[] = []; // In-memory storage for Carro instances

    private constructor() {} // Private constructor to prevent direct instantiation

    // Returns the singleton instance of CarroRepository
    public static getInstance(): CarroRepository {
        if (!this.instance) {
            this.instance = new CarroRepository();
        }
        return this.instance;
    }

        static getCreateTableQuery(): string {
        return `
            CREATE TABLE IF NOT EXISTS carros (
                id_carro INT AUTO_INCREMENT PRIMARY KEY,
                marca VARCHAR(100) NOT NULL,
                modelo VARCHAR(100) NOT NULL,
                ano INT NOT NULL,
                placa VARCHAR(20) NOT NULL UNIQUE,
                preco DECIMAL(10, 2) NOT NULL,
                cor VARCHAR(30) NOT NULL
            );
        `;
    }

    public async getCarros(): Promise<Carro[]> {
        const linhas = await executeQuery('SELECT * FROM carros', []);

        return linhas.map((linha: any) => new Carro(
            linha.id_carro,
            linha.marca,
            linha.modelo,
            linha.ano,
            linha.placa,
            Number(linha.preco), // banco retorna string para decimais, precisamos converter para number
            linha.cor
        ));
    }

    public async getCarroById(id: number): Promise<Carro | null> {
        const linhas = await executeQuery('SELECT * FROM carros WHERE id_carro = ?', [id]);
        if (linhas.length === 0) {
            return null;
        }
        return new Carro(
            linhas[0].id_carro,
            linhas[0].marca,
            linhas[0].modelo,
            linhas[0].ano,
            linhas[0].placa,
            Number(linhas[0].preco),
            linhas[0].cor
        );
    }

    public async getCarroByPlaca(placa: string): Promise<Carro | null> {
        const linhas = await executeQuery(
            'SELECT * FROM carros WHERE placa = ?', [placa]);
        
        if (linhas.length === 0) {
            return null;
        }

        return new Carro(
            linhas[0].id_carro,
            linhas[0].marca,
            linhas[0].modelo,
            linhas[0].ano,
            linhas[0].placa,
            Number(linhas[0].preco),
            linhas[0].cor
        );
    }

    public async getCarrosDisponiveis(): Promise<Carro[]> {
        const linhas = await executeQuery(`
            SELECT c.* FROM carros c
            JOIN estoques e ON c.id_carro = e.id_carro
            WHERE e.quantidade > 0
        `, []);
        return linhas.map((linha: any) => new Carro(
            linha.id_carro,
            linha.marca,
            linha.modelo,
            linha.ano,
            linha.placa,
            Number(linha.preco),
            linha.cor
        ));
    }

    public async addCarro(carro: Carro): Promise<Carro> {
        const result = await executeQuery(
            'INSERT INTO carros (marca, modelo, ano, placa, preco, cor) VALUES (?, ?, ?, ?, ?, ?)',
            [carro.marca, carro.modelo, carro.ano, carro.placa, carro.preco, carro.cor]
        );

        return new Carro(result.insertId, carro.marca, carro.modelo, carro.ano, carro.placa, carro.preco, carro.cor
        );
    }

    public async updateCarro(id: number, updatedCarro: Carro): Promise<boolean> {
       const result = await executeQuery(
            'UPDATE carros SET marca = ?, modelo = ?, ano = ?, placa = ?, preco = ?, cor = ? WHERE id_carro = ?',
            [updatedCarro.marca, updatedCarro.modelo, updatedCarro.ano, updatedCarro.placa, updatedCarro.preco, updatedCarro.cor, id]
        );
        return result.affectedRows > 0; // Returns true if the update was successful, false otherwise
    }

    public async deleteCarro(id: number): Promise<boolean> {
        const result = await executeQuery('DELETE FROM carros WHERE id_carro = ?', [id]);
        return result.affectedRows > 0; // Returns true if the deletion was successful, false otherwise
    }
}