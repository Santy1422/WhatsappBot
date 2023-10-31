import express from 'express'
import checkJwt from "../middlewares/checkJwt"
import controller from '../controllers/whatsapp.controller'
import clientsHandler from '../services/whatsapp';
import catchedAsync from '../utils/catchedAsync';
import {clients} from  "../databases/mongodb/index"

const whatsappRoutes = express.Router()
whatsappRoutes.route('/init/:id').get( catchedAsync(controller.InitWhatsappClient))
whatsappRoutes.route('/getqr/:id').get( catchedAsync(controller.getQr))
whatsappRoutes.route('/agregar').post( catchedAsync(controller.Agregar))
whatsappRoutes.route('/editar').put( catchedAsync(controller.Editar))
whatsappRoutes.route('/ver').get( catchedAsync(controller.Ver))



export default whatsappRoutes