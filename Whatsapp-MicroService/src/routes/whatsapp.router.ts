import express from 'express'
import checkJwt from "../middlewares/checkJwt"
import controller from '../controllers/whatsapp.controller'
import clientsHandler from '../services/whatsapp';
import catchedAsync from '../utils/catchedAsync';

const whatsappRoutes = express.Router()
whatsappRoutes.route('/init').get( catchedAsync(controller.InitWhatsappClient))
whatsappRoutes.route('/getqr').get( catchedAsync(controller.getQr))



export default whatsappRoutes