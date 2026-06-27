import mysql, { Pool } from 'mysql2';
import { ClienteRepository } from '../repositories/clienteRepository';
import { VendedorRepository } from '../repositories/vendedorRepository';
import { CarroRepository } from '../repositories/carroRepository';
import { EstoqueRepository } from '../repositories/estoqueRepository';
import { NotaFiscalRepository } from '../repositories/notaFiscalRepository';

const dbConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings: true,                  // retorna datas como strings em vez de objetos Date
    waitForConnections: true,           // se todas conexões estiverem ocupadas, aguarda até que uma conexão seja liberada
    connectionLimit: 10,                // maximo de conexões simultâneas no pool
    queueLimit: 0                       // sem limite de fila de espera para conexões, se todas estiverem ocupadas
}
const mysqlPool: Pool = mysql.createPool(dbConfig);

async function testConnection(): Promise<void> {
    await executeQuery('SELECT 1', []);
    console.log('Conexão bem-sucedida ao banco de dados MySQL');
    console.log(`Conectado ao schema: ${dbConfig.database}`); 
}

export function executeQuery(query: string, values: any[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        mysqlPool.query(query, values, (err, results) => {
            if (err) {
                console.error('Erro ao executar a query: ', err);
                return reject(err);

            }
            resolve(results);
        });
    });
}

export async function setupDatabase(): Promise<void> {

    console.log('Sincronizando schemas do banco de dados...');
    
    const schemas: string[] = [
        ClienteRepository.getCreateTableQuery(),
        VendedorRepository.getCreateTableQuery(),
        CarroRepository.getCreateTableQuery(),
        EstoqueRepository.getCreateTableQuery(),
        NotaFiscalRepository.getCreateTableQuery()
    ];
    
    try {
        await testConnection(); // Testa a conexão com o banco de dados 
        for(const query of schemas) {
            await executeQuery(query, []);
        }
        console.log('Todos os repositórios foram inicializados com sucesso.');
    } catch (err) {
        console.error('Erro crítico na sincronização dos repositórios', err);
        process.exit(1);
    }
}

