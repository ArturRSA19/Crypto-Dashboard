import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cryptoRoutes from './routes/cryptoRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Rota principal de preços cripto
app.use('/api', cryptoRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Rota de preços cripto disponível em: http://localhost:${PORT}/api/crypto-prices`);
});