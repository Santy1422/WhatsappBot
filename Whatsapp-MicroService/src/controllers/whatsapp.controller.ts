import { ClientError } from "../utils/errors";
import clientsHandler from "../services/whatsapp";
import { users } from "../databases/mongodb/index";


const InitWhatsappClient = async (req, res) => {

    const {webId} = req.params

    await clientsHandler.AddNewClient(webId)
    res.status(200).json({ error: false, payload: { Message: "Ahora pruebe hacer peticiones a la ruta GET /v1/chat/getqr junto a su token, tiene un tiempo limitado hasta que se dejen de generar QRs" } })
  }

const getQr = async (req, res) => {
  const {webId} = req.params

    const QR = clientsHandler.AllQR[webId]
    if (!QR) throw new ClientError("Primero debe inicializar su cliente haciendo un GET a la ruta /v1/chat/init con su token. Luego pruebe hacer peticiones nuevamente a esta ruta, el primer QR se genera y dura 60 segundos, luego se generarar otros 5 qr de 20 segundos cada uno.", 400)
    res.status(200).json({ error: false, payload: { qr: QR, message: "Se ha generado el codigo qr exitosamente" } })
  }



const controller = {
	InitWhatsappClient,
	getQr
}


export default controller
