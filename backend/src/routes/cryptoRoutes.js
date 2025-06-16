import express from 'express';
import { fetchPrices, fetchTrending } from '../controllers/cryptoController.js';  // :contentReference[oaicite:1]{index=1}

const router = express.Router();

// preços de mercado
router.get('/crypto-prices', fetchPrices);

// moedas em tendência
router.get('/crypto-trending', fetchTrending);

export default router;
