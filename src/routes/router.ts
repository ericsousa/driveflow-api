import { Router, Request, Response } from 'express';

import { 
  listarClientes, 
  buscarClientePorId, 
  listarNotasFiscaisPorCliente,
  criarCliente, 
  atualizarCliente, 
  removerCliente
} from '../controllers/clienteController';

import {
  listarVendedores,
  buscarVendedorPorId,
  listarNotasFiscaisPorVendedor,
  criarVendedor,
  atualizarVendedor,
  removerVendedor
} from '../controllers/vendedorController';

import {
  listarCarros,
  buscarCarroPorId,
  buscarCarrosDisponiveis,
  criarCarro,
  atualizarCarro,
  removerCarro
} from '../controllers/carroController';

import {
  listarEstoque,
  buscarEstoquePorId,
  listarEstoquePorCarroId,
  criarEstoque,
  atualizarEstoque,
  removerEstoque
} from '../controllers/estoqueController';

import {  
  listarNotasFiscais,
  buscarNotaFiscalPorId,
  criarNotaFiscal
} from '../controllers/notaFiscalController';

const router = Router();


router.get('/', (req: Request, res: Response): void => {
    res.send('Welcome to the Driveflow API!');
});

router.get('/clientes', listarClientes);
router.get('/clientes/notas/:id', listarNotasFiscaisPorCliente);
router.get('/clientes/:id', buscarClientePorId);
router.post('/clientes', criarCliente);
router.put('/clientes/:id', atualizarCliente);
router.delete('/clientes/:id', removerCliente);

router.get('/vendedores', listarVendedores);
router.get('/vendedores/notas/:id', listarNotasFiscaisPorVendedor);
router.get('/vendedores/:id', buscarVendedorPorId);
router.post('/vendedores', criarVendedor);
router.put('/vendedores/:id', atualizarVendedor);
router.delete('/vendedores/:id', removerVendedor);

router.get('/carros', listarCarros);
router.get('/carros/disponiveis', buscarCarrosDisponiveis);
router.get('/carros/:id', buscarCarroPorId);
router.post('/carros', criarCarro);
router.put('/carros/:id', atualizarCarro);
router.delete('/carros/:id', removerCarro);

router.get('/estoque', listarEstoque);
router.get('/estoque/carro/:id_carro', listarEstoquePorCarroId);  
router.get('/estoque/:id', buscarEstoquePorId);
router.post('/estoque', criarEstoque);
router.put('/estoque/:id', atualizarEstoque);
router.delete('/estoque/:id', removerEstoque);

router.get('/notas', listarNotasFiscais);
router.get('/notas/:id', buscarNotaFiscalPorId);
router.post('/notas', criarNotaFiscal);

export default router;