import express from 'express';
import { postProduct } from '../controller/newProduct.controller';

const router = express.Router();

router.post('/', postProduct);

export default router;