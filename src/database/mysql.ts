import mysql, { Connection, QueryError} from 'mysql2';
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
    database: process.env.DB_NAME
};

const mysqlConnection: Connection = mysql.createConnection(dbConfig);

mysqlConnection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados: ', err);
        throw err;
    }
    console.log('Conexão bem-sucedida ao banco de dados MySQL');
});

export function executeQuery(query: string, values: any[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        mysqlConnection.query(query, values, (err, results) => {
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
        await executeQuery(` USE ${dbConfig.database}`, []);
        console.log(`Conectado ao schema: ${dbConfig.database}`);

        for(const query of schemas) {
            await executeQuery(query, []);
        }
        console.log('Todos os repositórios foram inicializados com sucesso.');
    } catch (err) {
        console.error('Erro crítico na sincronização dos repositórios', err);
        process.exit(1);
    }
}

