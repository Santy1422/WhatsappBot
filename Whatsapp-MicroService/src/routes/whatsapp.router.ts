import express from 'express'
import checkJwt from "../middlewares/checkJwt"
import controller from '../controllers/whatsapp.controller'
import clientsHandler from '../services/whatsapp';
import catchedAsync from '../utils/catchedAsync';
import {clients} from  "../databases/mongodb/index"

const whatsappRoutes = express.Router()
whatsappRoutes.route('/getqr/:webId/:webUrl').get( catchedAsync(controller.getQr))
whatsappRoutes.route('/agregar').post( catchedAsync(controller.Agregar))
whatsappRoutes.route('/editar').put( catchedAsync(controller.Editar))
whatsappRoutes.route('/ver').get( catchedAsync(controller.Ver))
whatsappRoutes.route('/getqr').get(checkJwt, catchedAsync(controller.getQr))



export default whatsappRoutes