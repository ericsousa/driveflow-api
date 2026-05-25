import { Vendedor } from '../models/Vendedor';

export class VendedorRepository {

    private static instance: VendedorRepository; // Singleton instance, only accessible through getInstance()
    private vendedores: Vendedor[] = []; // In-memory storage for Vendedor instances

    private constructor() {} // Private constructor to prevent direct instantiation

    // Returns the singleton instance of VendedorRepository
    public static getInstance(): VendedorRepository {
        if (!this.instance) {
            this.instance = new VendedorRepository();
        }
        return this.instance;
    }

    public getVendedores(): Vendedor[] {
        return this.vendedores;
    }

    public getVendedorById(id: number): Vendedor | undefined {
        return this.vendedores.find(vendedor => vendedor.id_vendedor === id);
    }

    public addVendedor(vendedor: Vendedor): void {
        this.vendedores.push(vendedor);
    }

    public updateVendedor(id: number, updatedVendedor: Vendedor): boolean {
        const index = this.vendedores.findIndex(vendedor => vendedor.id_vendedor === id);
        if (index !== -1) {
            this.vendedores[index] = updatedVendedor;
            return true;
        }
        return false;
    }

    public deleteVendedor(id: number): boolean {
        const index = this.vendedores.findIndex(vendedor => vendedor.id_vendedor === id);
        if (index !== -1) {
            this.vendedores.splice(index, 1);
            return true;
        }
        return false;
    }
}
