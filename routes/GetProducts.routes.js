import e from "express";
import { getAllProducts } from "../controller/GetProduct.comtroller.js";

const router = e.Router()

router.get('/', getAllProducts)

export default router

