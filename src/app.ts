import express, {Request, Response} from 'express';
import { 
  listarClientes, 
  buscarClientePorId, 
  criarCliente, 
  atualizarCliente, 
  removerCliente
} from './controllers/clienteController';


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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


