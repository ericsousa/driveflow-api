import { Carro } from '../models/Carro';

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

    public getCarros(): Carro[] {
        return this.carros;
    }

    public getCarroById(id: number): Carro | undefined {
        return this.carros.find(carro => carro.id_carro === id);
    }

    public addCarro(carro: Carro): void {
        this.carros.push(carro);
    }

    public updateCarro(id: number, updatedCarro: Carro): boolean {
        const index = this.carros.findIndex(carro => carro.id_carro === id);
        if (index !== -1) {
            this.carros[index] = updatedCarro;
            return true;
        }
        return false;
    }

    public deleteCarro(id: number): boolean {
        const index = this.carros.findIndex(carro => carro.id_carro === id);
        if (index !== -1) {
            this.carros.splice(index, 1);
            return true;
        }   
        return false;
    }
}