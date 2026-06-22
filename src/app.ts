import 'dotenv/config';
import express from 'express';
import router from "./routes/router";
import { setupDatabase } from './database/mysql';

const app = express();

const port = process.env.PORT || 3000;
app.use(express.json());

app.use('/', router);

async function startServer() {

  // Inicializa banco de dados
  await setupDatabase();
  
  // Inicia o servidor
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  }); 
}
startServer();

