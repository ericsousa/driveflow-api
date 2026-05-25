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
  criarCarro,
  atualizarCarro,
  removerCarro
} from './controllers/carroController';


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
app.get('/carros/:id', buscarCarroPorId);
app.post('/carros', criarCarro);
app.put('/carros/:id', atualizarCarro);
app.delete('/carros/:id', removerCarro);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


