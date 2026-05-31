import express, {Request, Response} from 'express';

import { 
  listarClientes, 
  buscarClientePorId, 
  criarCliente, 
  atualizarCliente, 
  removerCliente
} from './controllers/clienteController';

import {
  listarVendedores,
  buscarVendedorPorId,
  criarVendedor,
  atualizarVendedor,
  removerVendedor
} from './controllers/vendedorController';

import {
  listarCarros,
  buscarCarroPorId,
  buscarCarrosDisponiveis,
  criarCarro,
  atualizarCarro,
  removerCarro
} from './controllers/carroController';

import {
  listarEstoque,
  buscarEstoquePorId,
  listarEstoquePorCarroId,
  criarEstoque,
  atualizarEstoque,
  removerEstoque
} from './controllers/estoqueController';

import {
  listarNotasFiscais,
  buscarNotaFiscalPorId,
  criarNotaFiscal
} from './controllers/notaFiscalController';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.get('/', (req: Request, res: Response): void => {
    res.send('Welcome to the Driveflow API!');
});

app.get('/clientes', listarClientes);
app.get('/clientes/:id', buscarClientePorId);
app.post('/clientes', criarCliente);
app.put('/clientes/:id', atualizarCliente);
app.delete('/clientes/:id', removerCliente);

app.get('/vendedores', listarVendedores);
app.get('/vendedores/:id', buscarVendedorPorId);
app.post('/vendedores', criarVendedor);
app.put('/vendedores/:id', atualizarVendedor);
app.delete('/vendedores/:id', removerVendedor);

app.get('/carros', listarCarros);
app.get('/carros/disponiveis', buscarCarrosDisponiveis);
app.get('/carros/:id', buscarCarroPorId);
app.post('/carros', criarCarro);
app.put('/carros/:id', atualizarCarro);
app.delete('/carros/:id', removerCarro);

app.get('/estoque', listarEstoque);
app.get('/estoque/carro/:id_carro', listarEstoquePorCarroId); 
app.get('/estoque/:id', buscarEstoquePorId);
app.post('/estoque', criarEstoque);
app.put('/estoque/:id', atualizarEstoque);
app.delete('/estoque/:id', removerEstoque);

app.get('/notas', listarNotasFiscais);
app.get('/notas/:id', buscarNotaFiscalPorId);
app.post('/notas', criarNotaFiscal);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


