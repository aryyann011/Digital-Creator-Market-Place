import express from 'express';
import { postProduct } from '../controller/product.contoller.js';

const router = express.Router();

router.post('/', postProduct);

export default router;