import { ClientError } from "../utils/errors";
import clientsHandler from "../services/whatsapp";
import { clients, users } from "../databases/mongodb/index";
import UserWppHandler from "../services/whatsapp";


// const InitWhatsappClient = async (req, res) => {

//     const {webId} = req.params

//     await clientsHandler.AddNewClient(webId)
//     res.status(200).json({ error: false, payload: { Message: "Ahora pruebe hacer peticiones a la ruta GET /v1/chat/getqr junto a su token, tiene un tiempo limitado hasta que se dejen de generar QRs" } })
//   }

const getQr = async (req,res) => {
	const UserId = req.user.id
	const { webUrl } = req.params

let webId = Math.floor(Math.random() * 1000).toString();

	const userHandler = new UserWppHandler()
	
	userHandler.CreateNewClient(webId,webUrl)

  res.status(200).send("qr generado")
}


  const Agregar = async (req, res) => {
    try {
      const { nombre, edad, genero, alergia, objetivos, apikey } = req.body;
      const nuevoCliente = new clients({ nombre, edad, genero, alergia, objetivos, apikey });
      await nuevoCliente.save();
      res.status(201).json({ mensaje: 'Cliente agregado con éxito', cliente: nuevoCliente });
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar el cliente' });
    }
  }
  const Editar = async (req, res) => {
    try {
      const { nombre, edad, genero, alergia, objetivos,apikey } = req.body;
      const clienteActualizado = await clients.findByIdAndUpdate(
        "65418e37616e0ad6026816aa",
        { nombre, edad, genero, alergia, objetivos, apikey},
        { new: true }
      );
      if (!clienteActualizado) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      res.json({ mensaje: 'Cliente actualizado con éxito', cliente: clienteActualizado });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el cliente' });
    }
  }
  const Ver = async (req, res) => {
    try {
      const cliente = await clients.findById("65418e37616e0ad6026816aa");
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      res.json({ cliente });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el cliente' });
    }
  }
const controller = {
	getQr,
  Agregar,
  Editar,
  Ver
}


export default controller
