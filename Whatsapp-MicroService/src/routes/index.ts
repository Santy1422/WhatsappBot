import { Router } from "express";
import whatsappRoutes from "./whatsapp.router";
const router = Router();


router.use('/v1/whatsapp', whatsappRoutes);


export default router;

