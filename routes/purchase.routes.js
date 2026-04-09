import e from "express";
import { createPurchase } from "../controller/purchase.controller.js";

const router = e.Router()

router.post('/', createPurchase)

export default router