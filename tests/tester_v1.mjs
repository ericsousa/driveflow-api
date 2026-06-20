const BASE_URL = 'http://localhost:3000';

// Antes de tudo, verifica se o servidor está de pé
try {
    await fetch(BASE_URL + '/');
} catch {
    console.error('❌ Servidor não está rodando em ' + BASE_URL);
    console.error('   Abra outro terminal e rode: npm run dev');
    process.exit(1);
}

let passaram = 0;
let falharam = 0;

function check(nome, esperado, recebido) {
    if (recebido === esperado) {
        passaram++;
        console.log(`\x1b[32m✓\x1b[0m ${nome}`);
    } else {
        falharam++;
        console.log(`\x1b[31m✗ ${nome} — esperado ${esperado}, recebeu ${recebido}\x1b[0m`);
    }
}

// Alguns testes do professor aceitam uma faixa de status (ex.: "retorna 400 ou 404").
// Aqui verificamos se o status recebido está dentro do intervalo [minimo, maximo].
function checkFaixa(nome, minimo, maximo, recebido) {
    if (recebido >= minimo && recebido <= maximo) {
        passaram++;
        console.log(`\x1b[32m✓\x1b[0m ${nome}`);
    } else {
        falharam++;
        console.log(`\x1b[31m✗ ${nome} — esperado ${minimo}-${maximo}, recebeu ${recebido}\x1b[0m`);
    }
}

async function api(metodo, caminho, corpo) {
    const opcoes = {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
    };
    if (corpo !== undefined) {
        opcoes.body = JSON.stringify(corpo);
    }
    const resposta = await fetch(BASE_URL + caminho, opcoes);

    // tenta ler o corpo como JSON; se não der (corpo vazio), segue sem ele
    let body = null;
    try { body = await resposta.json(); } catch {}

    return { status: resposta.status, body };
}

// Data futura usada nos testes de data_entrada/data_emissao (sempre 1 ano à frente de hoje)
const DATA_FUTURA = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);


/**
 * Conectividade
 */
console.log('\n— Conectividade —');

let r = await api('GET', '/');
check('Servidor respondendo na porta (200)', 200, r.status);

/**
 * Clientes — CRUD básico
 */
console.log('\n— Clientes — CRUD básico —');

r = await api('GET', '/clientes');
check('GET /clientes retorna lista (200)', 200, r.status);

r = await api('POST', '/clientes', {
    nome: 'Maria Silva', cpf: '111.222.333-44', telefone: '11999998888',
    email: 'maria@email.com', cidade: 'São Paulo'
});
check('POST /clientes cria cliente válido (201)', 201, r.status);

r = await api('GET', '/clientes/1');     // servidor recém-reiniciado → primeiro id é 1
check('GET /clientes/1 retorna cliente criado (200)', 200, r.status);

r = await api('PUT', '/clientes/1', {
    nome: 'Maria Silva Atualizada', cpf: '111.222.333-44', telefone: '11777776666',
    email: 'maria.nova@email.com', cidade: 'Campinas'
});
check('PUT /clientes/1 atualiza cliente (200)', 200, r.status);

/**
 * Clientes — Regras de negócio
 */
console.log('\n— Clientes — Regras de negócio —');

r = await api('POST', '/clientes', {
    nome: 'Outra Maria', cpf: '111.222.333-44', telefone: '11888887777'
});
check('POST /clientes — CPF duplicado retorna 409', 409, r.status);

r = await api('POST', '/clientes', { nome: 'Sem CPF' });
check('POST /clientes — campos obrigatórios ausentes retorna 400', 400, r.status);

r = await api('GET', '/clientes/999');
check('GET /clientes/999 — ID inexistente retorna 404', 404, r.status);

r = await api('POST', '/clientes', {
    nome: 'José Souza', cpf: '555.666.777-88', telefone: '11666665555',
    email: 'jose@email.com', cidade: 'Santos'
});
check('POST /clientes — segundo cliente válido, para testes futuros (201)', 201, r.status);  // id 2

/**
 * Vendedores — CRUD básico
 */
console.log('\n— Vendedores — CRUD básico —');

r = await api('GET', '/vendedores');
check('GET /vendedores retorna lista (200)', 200, r.status);

r = await api('POST', '/vendedores', {
    nome: 'João Vendedor', matricula: 'V001', comissao_percentual: 5
});
check('POST /vendedores cria vendedor válido (201)', 201, r.status);   // id 1

r = await api('GET', '/vendedores/1');
check('GET /vendedores/1 retorna vendedor (200)', 200, r.status);

r = await api('PUT', '/vendedores/1', {
    nome: 'João Vendedor Sênior', matricula: 'V001', comissao_percentual: 10
});
check('PUT /vendedores/1 atualiza vendedor (200)', 200, r.status);

/**
 * Vendedores — Regras de negócio
 */
console.log('\n— Vendedores — Regras de negócio —');

r = await api('POST', '/vendedores', {
    nome: 'Impostor', matricula: 'V001', comissao_percentual: 7
});
check('POST /vendedores — matrícula duplicada retorna 409', 409, r.status);

r = await api('POST', '/vendedores', {
    nome: 'Ganancioso', matricula: 'V002', comissao_percentual: 35
});
check('POST /vendedores — comissão > 30 retorna 400', 400, r.status);

r = await api('POST', '/vendedores', {
    nome: 'Negativo', matricula: 'V003', comissao_percentual: -5
});
check('POST /vendedores — comissão negativa retorna 400', 400, r.status);

r = await api('GET', '/vendedores/999');
check('GET /vendedores/999 — ID inexistente retorna 404', 404, r.status);

/**
 * Carros — CRUD básico
 */
console.log('\n— Carros — CRUD básico —');

r = await api('GET', '/carros');
check('GET /carros retorna lista (200)', 200, r.status);

r = await api('POST', '/carros', {
    marca: 'GM', modelo: 'Onix', ano: 2022, placa: 'ABC1D23',
    preco: 90000, cor: 'Prata'
});
check('POST /carros cria carro válido (201)', 201, r.status);   // id 1

r = await api('GET', '/carros/1');
check('GET /carros/1 retorna carro (200)', 200, r.status);

r = await api('PUT', '/carros/1', {
    marca: 'GM', modelo: 'Onix LT', ano: 2022, placa: 'ABC1D23',
    preco: 92000, cor: 'Preto'
});
check('PUT /carros/1 atualiza carro (200)', 200, r.status);

/**
 * Carros — Regras de negócio
 */
console.log('\n— Carros — Regras de negócio —');

r = await api('POST', '/carros', {
    marca: 'Fiat', modelo: 'Argo', ano: 2023, placa: 'ABC1D23',
    preco: 80000, cor: 'Branco'
});
check('POST /carros — placa duplicada retorna 409', 409, r.status);

r = await api('POST', '/carros', {
    marca: 'Ford', modelo: 'Modelo T', ano: 1949, placa: 'OLD0A11',
    preco: 200000, cor: 'Preto'
});
check('POST /carros — ano antes de 1950 retorna 400', 400, r.status);

r = await api('POST', '/carros', {
    marca: 'Tesla', modelo: 'Futuro', ano: new Date().getFullYear() + 2, placa: 'FUT2B22',
    preco: 300000, cor: 'Vermelho'
});
check('POST /carros — ano atual+2 retorna 400', 400, r.status);

r = await api('POST', '/carros', {
    marca: 'Renault', modelo: 'Kwid', ano: 2024, placa: 'GRA1C33',
    preco: 0, cor: 'Azul'
});
check('POST /carros — preço zero retorna 400', 400, r.status);

r = await api('GET', '/carros/999');
check('GET /carros/999 — ID inexistente retorna 404', 404, r.status);

r = await api('POST', '/carros', {
    marca: 'VW', modelo: 'Polo', ano: 2023, placa: 'DEF4E56',
    preco: 110000, cor: 'Cinza'
});
check('POST /carros — segundo carro para testes (201)', 201, r.status);   // id 2

/**
 * Estoque — CRUD básico
 */
console.log('\n— Estoque — CRUD básico —');

r = await api('GET', '/estoque');
check('GET /estoque retorna lista (200)', 200, r.status);

r = await api('POST', '/estoque', {
    id_carro: 1, quantidade: 12, localizacao_patio: 'A1', data_entrada: '2026-01-10'
});
check('POST /estoque cria registro válido (201)', 201, r.status);   // id 1

r = await api('GET', '/estoque/1');
check('GET /estoque/1 retorna registro (200)', 200, r.status);

r = await api('PUT', '/estoque/1', {
    id_carro: 1, quantidade: 10, localizacao_patio: 'A2', data_entrada: '2026-01-10'
});
check('PUT /estoque/1 atualiza quantidade (200)', 200, r.status);   // quantidade agora é 10

r = await api('GET', '/estoque/carro/1');
check('GET /estoque/carro/1 retorna estoque do carro (200)', 200, r.status);

/**
 * Estoque — Regras de negócio
 */
console.log('\n— Estoque — Regras de negócio —');

r = await api('POST', '/estoque', {
    id_carro: 999, quantidade: 5, localizacao_patio: 'C1', data_entrada: '2026-01-10'
});
checkFaixa('POST /estoque — carro inexistente retorna 400 ou 404', 400, 404, r.status);

r = await api('POST', '/estoque', {
    id_carro: 2, quantidade: -5, localizacao_patio: 'C2', data_entrada: '2026-01-10'
});
check('POST /estoque — quantidade negativa retorna 400', 400, r.status);

r = await api('POST', '/estoque', {
    id_carro: 2, quantidade: 5, localizacao_patio: 'C3', data_entrada: DATA_FUTURA
});
check('POST /estoque — data futura retorna 400', 400, r.status);

r = await api('POST', '/estoque', {
    id_carro: 1, quantidade: 5, localizacao_patio: 'B2', data_entrada: '2026-01-12'
});
checkFaixa('POST /estoque — estoque duplicado para mesmo carro retorna 400 ou 409', 400, 409, r.status);

r = await api('POST', '/estoque', {
    id_carro: 2, quantidade: 5, localizacao_patio: 'B1', data_entrada: '2026-01-11'
});
check('POST /estoque — estoque para carro2 (201)', 201, r.status);   // id 2

/**
 * Carros — Consultas especiais
 */
console.log('\n— Carros — Consultas especiais —');

r = await api('GET', '/carros/disponiveis');
// aqui verificamos o status E o conteúdo: os 2 carros têm estoque > 0, então os 2 devem aparecer
const disponiveis = Array.isArray(r.body) ? r.body.length : 'corpo inválido';
check(
    'GET /carros/disponiveis retorna apenas carros com estoque > 0 (200, 2 carros)',
    '200 com 2 carros',
    `${r.status} com ${disponiveis} carros`
);

/**
 * Notas Fiscais — Emissão
 */
console.log('\n— Notas Fiscais — Emissão —');

r = await api('GET', '/notas');
check('GET /notas retorna lista (200)', 200, r.status);

r = await api('POST', '/notas', {
    numero_nota: 'NF-001', data_emissao: '2026-01-15', valor_total: 90000,
    id_cliente: 1, id_vendedor: 1, id_carro: 1
});
check('POST /notas emite nota válida e decrementa estoque (201)', 201, r.status);   // id 1

r = await api('GET', '/estoque/carro/1');
// a nota vendeu 1 carro, então a quantidade deve ter caído de 10 para 9
check('Estoque decrementou após emissão da nota (quantidade = 9)', 9, r.body?.[0]?.quantidade);

r = await api('GET', '/notas/1');
check('GET /notas/1 retorna nota emitida (200)', 200, r.status);

/**
 * Notas Fiscais — Regras de negócio
 */
console.log('\n— Notas Fiscais — Regras de negócio —');

r = await api('POST', '/notas', {
    numero_nota: 'NF-001', data_emissao: '2026-01-16', valor_total: 50000,
    id_cliente: 1, id_vendedor: 1, id_carro: 1
});
check('POST /notas — numero_nota duplicado retorna 409', 409, r.status);

r = await api('POST', '/notas', {
    numero_nota: 'NF-002', data_emissao: DATA_FUTURA, valor_total: 50000,
    id_cliente: 1, id_vendedor: 1, id_carro: 1
});
check('POST /notas — data futura retorna 400', 400, r.status);

r = await api('POST', '/notas', {
    numero_nota: 'NF-003', data_emissao: '2026-01-16', valor_total: 0,
    id_cliente: 1, id_vendedor: 1, id_carro: 1
});
check('POST /notas — valor_total zero retorna 400', 400, r.status);

r = await api('POST', '/notas', {
    numero_nota: 'NF-004', data_emissao: '2026-01-16', valor_total: 50000,
    id_cliente: 999, id_vendedor: 1, id_carro: 1
});
checkFaixa('POST /notas — cliente inexistente retorna 400 ou 404', 400, 404, r.status);

// preparação (não contada): terceiro carro, SEM registro de estoque, para o teste seguinte
await api('POST', '/carros', {
    marca: 'Honda', modelo: 'Civic', ano: 2021, placa: 'GHI7J89',
    preco: 130000, cor: 'Branco'
});   // id 3

r = await api('POST', '/notas', {
    numero_nota: 'NF-005', data_emissao: '2026-01-16', valor_total: 130000,
    id_cliente: 1, id_vendedor: 1, id_carro: 3
});
checkFaixa('POST /notas — carro sem estoque retorna 400 ou 422', 400, 422, r.status);

r = await api('DELETE', '/notas/1');
checkFaixa('DELETE /notas/1 não é permitido — retorna 404 ou 405 ou 422', 404, 422, r.status);

/**
 * Consultas especiais (RN06)
 */
console.log('\n— Consultas especiais (RN06) —');

r = await api('GET', '/clientes/notas/1');
check('GET /clientes/notas/1 retorna notas do cliente (200)', 200, r.status);

r = await api('GET', '/vendedores/notas/1');
check('GET /vendedores/notas/1 retorna notas do vendedor (200)', 200, r.status);

/**
 * Deleção — Restrições de integridade
 */
console.log('\n— Deleção — Restrições de integridade —');

r = await api('DELETE', '/clientes/1');
check('DELETE /clientes/1 com notas vinculadas retorna 422', 422, r.status);

r = await api('DELETE', '/vendedores/1');
check('DELETE /vendedores/1 com notas vinculadas retorna 422', 422, r.status);

r = await api('DELETE', '/carros/1');
check('DELETE /carros/1 com estoque vinculado retorna 422', 422, r.status);

r = await api('DELETE', '/clientes/2');   // cliente 2 (José) nunca comprou nada
check('DELETE /clientes/2 sem notas retorna 200', 200, r.status);

// preparação (não contada): segundo vendedor, sem notas, para o teste seguinte
await api('POST', '/vendedores', {
    nome: 'Vendedor Novato', matricula: 'V010', comissao_percentual: 3
});   // id 2

r = await api('DELETE', '/vendedores/2');
check('DELETE /vendedores/2 sem notas retorna 200', 200, r.status);


/**
 * Resumo dos resultados
 */
const total = passaram + falharam;
console.log('\n' + '─'.repeat(50));
console.log(`${passaram} passaram · ${falharam} falharam · ${total} total`);

process.exit(falharam > 0 ? 1 : 0);
