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

        static getCreateTableQuery(): string {
        return `
            CREATE TABLE IF NOT EXISTS estoques (
                id_estoque INT AUTO_INCREMENT PRIMARY KEY,
                id_carro INT NOT NULL,
                quantidade INT NOT NULL,
                localizacao_patio VARCHAR(255) NOT NULL,
                data_entrada DATE NOT NULL,
                FOREIGN KEY (id_carro) REFERENCES carros(id_carro)
            );
        `;
    }

    public getEstoques(): Estoque[] {
        return this.estoques;
    }

    public getEstoqueById(id: number): Estoque | undefined {
        return this.estoques.find(estoque => estoque.id_estoque === id);
    }

    public getEstoquesByCarroId(id_carro: number): Estoque[] {
        return this.estoques.filter(estoque => estoque.id_carro === id_carro);
    }

    public addEstoque(estoque: Estoque): void {
        this.estoques.push(estoque);
    }

    public updateEstoque(id: number, updatedEstoque: Estoque): boolean {
        const index = this.estoques.findIndex(estoque => estoque.id_estoque === id);
        if (index !== -1) {
            this.estoques[index] = updatedEstoque;
            return true;
        }
        return false;
    }

    public baixaEstoque(id_carro: number): boolean {

        // Mitigaçao de risco:
        // Vericação de quantidade de estoque antes de dar baixa, para evitar que o estoque fique negativo
        // Verificações de estoque ainda devem ser feitas antes de chamar esse método
        const index = this.estoques.findIndex(estoque => estoque.id_carro === id_carro && estoque.quantidade > 0);
        if (index !== -1) {
            this.estoques[index].quantidade -= 1;
            return true;
        }
        return false;
    }

    public deleteEstoque(id: number): boolean {
        const index = this.estoques.findIndex(estoque => estoque.id_estoque === id);
        if (index !== -1) {
            this.estoques.splice(index, 1);
            return true;
        }
        return false;
    }
}