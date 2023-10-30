import express from 'express'
import checkJwt from "../middlewares/checkJwt"
import controller from '../controllers/whatsapp.controller'
import clientsHandler from '../services/whatsapp';
import catchedAsync from '../utils/catchedAsync';

const whatsappRoutes = express.Router()
whatsappRoutes.route('/init').get( catchedAsync(controller.InitWhatsappClient))
whatsappRoutes.route('/getqr').get( catchedAsync(controller.getQr))


// whatsappRoutes.route('/init').post(checkJwt, (req,res)=>{
//     res.status(200).json({clientes: (clientsHandler.AllClients), QRs:(clientsHandler.AllQR), readys:(clientsHandler.AllReadys)})
// })


// whatsappRoutes.route('/init').put(checkJwt,catchedAsync(async (req,res)=>{
//     const a = req as any
//     const x = await clientsHandler.AllClients[a.user.id].getState()
//     await clientsHandler.AllClients[a.user.id].sendMessage("5493435202921@s.whatsapp.net","testing")
//     res.status(200).json({status:x})
// }))


export default whatsappRoutes