import express from 'express'
import checkJwt from "../middlewares/checkJwt"
import controller from '../controllers/whatsapp.controller'
import clientsHandler from '../services/whatsapp';
import catchedAsync from '../utils/catchedAsync';
import {clients} from  "../databases/mongodb/index"

const whatsappRoutes = express.Router()
whatsappRoutes.route('/init/:id').get( catchedAsync(controller.InitWhatsappClient))
whatsappRoutes.route('/getqr/:id').get( catchedAsync(controller.getQr))
whatsappRoutes.post('/agregar', async (req, res) => {
    try {
      const { nombre, edad, genero, alergia, objetivos, apikey } = req.body;
      const nuevoCliente = new clients({ nombre, edad, genero, alergia, objetivos, apikey });
      await nuevoCliente.save();
      res.status(201).json({ mensaje: 'Cliente agregado con éxito', cliente: nuevoCliente });
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar el cliente' });
    }
  });
  
  // Ruta para editar un cliente existente
  whatsappRoutes.put('/editar/:id', async (req, res) => {
    try {
      const clienteId = req.params.id;
      const { nombre, edad, genero, alergia, objetivos,apikey } = req.body;
      const clienteActualizado = await clients.findByIdAndUpdate(
        clienteId,
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
  });
  whatsappRoutes.get('/receta/:id', async (req, res) => {
    try {
      const clienteId = req.params.id;
      const cliente = await clients.findById(clienteId);
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      res.json({ cliente });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el cliente' });
    }
  });


export default whatsappRoutes