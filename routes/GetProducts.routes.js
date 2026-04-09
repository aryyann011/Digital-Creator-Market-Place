import e from "express";
import { getAllProducts } from "../controller/GetProduct.comtroller";

const router = e.Router()

router.get('/', getAllProducts)

export default router

