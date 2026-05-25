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
}