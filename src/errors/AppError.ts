/**
 * AppError
 *
 * A lightweight Error subclass used across the application to represent
 * HTTP-style errors with an associated numeric status code.
 * 
 * Each error carries the HTTP status code that describes it. Services throw a
 * typed error (e.g. NotFoundError) instead of a generic Error; controllers catch
 * it and, when it is an `instanceof AppError`, respond with `error.status` and
 * `error.message`. Anything that is not an AppError should be treated as an 
 * unexpected failure and returns 500. This removes string matching and keeps 
 * status mapping in one place.
 * 
 * How to use: 
 * - Instantiate it as AppError: `error instaceof AppError`
 * - Then you can access the status code using: `error.status`
 */

export class AppError extends Error {

    // public readonly status: torna status acessível fora da classe 
    // mas não pode ser alterado após a criação do objeto.
    // é uma synthetic sugar para criar e inicializar a propriedade status 
    // diretamente no construtor.

    constructor(message: string, public readonly status: number) {

        // Call the parent constructor with the error message. 
        super(message);

        // Set the name of the error to the name of the subclass (e.g., "AppError").
        this.name = new.target.name;
    }
}

// Dados inválidos, campos obrigatórios ausentes ou violação de
//regra de negócio (ex.: CPF duplicado, carro sem estoque)
export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}

// Recurso não encontrado pelo id informado
export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
    }
}

// Violação de unicidade (CPF, matrícula, placa, número da nota já existentes)
export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409);
    }
}

// Regra de negócio impede a operação 
// (ex.: remoção de cliente com notas, estoque insuficiente)
export class BusinessError extends AppError {
    constructor(message: string) {
        super(message, 422); 
    }
}





