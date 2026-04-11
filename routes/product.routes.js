import express from 'express';
import { postProduct } from '../controller/newProduct.controller.js';

const router = express.Router();

router.post('/', postProduct);

export default router;