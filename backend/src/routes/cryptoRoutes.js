import express from 'express';
import { fetchPrices } from '../controllers/cryptoController.js';

const router = express.Router();

router.get('/crypto-prices', fetchPrices);

export default router;
