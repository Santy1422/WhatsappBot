global.WhatsappInstances = {}
import { PORT } from "./config/env";
import express from 'express'
import morgan from 'morgan'
import bodyParser from "body-parser";
import routes from "./routes";
import redirectLocation from "./middlewares/redirectLocation";
import { globalLimit } from './utils/rate-limiters';
const cors = require('cors')


//SERVER INSTANCE
const server = express();

server.set('trust proxy', false); //POR AWS EC2 NGINX PROXY REDIRECT, sino limita todas las tu sabes

//MIDDLEWARES
server.use(morgan('dev'));
server.use(cors({ origin: '*' }));

server.use(globalLimit); //limite 150 peticiones por 1 minuto
server.use('/v1',express.json({ limit: '50mb' })); //para recibir body's
server.use('/v1',bodyParser.urlencoded({ extended: true })); //para poder enviar array dentro de body's
server.use(express.static('public'));




//ROUTES
//server.use(redirectLocation)
server.use(routes);


//DEFAULT 404
server.use('*', (req, res) => {
  res.status(404).send({ error: true, message: "Ruta no encontrada: " + req.baseUrl });
});



//EXPRESS DEFAULT ERROR HANDLER
server.use((err, req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  let message_to_send = 'API: ' + err.message;
  console.error(message_to_send)
  res.status(err.statusCode || 500).send({
    error: true,
    message: message_to_send,
  });
});


//START LISTENING
server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}!`);
});

