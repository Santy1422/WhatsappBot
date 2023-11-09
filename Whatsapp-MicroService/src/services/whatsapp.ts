import { Client, RemoteAuth, Message, Buttons, List } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { MyStore, clients, webs } from '../databases/mongodb/index';
import socket from "socket.io-client";
import axios from "axios";
import { peticionAI } from "./peticion";
import { synonymMap } from "./palabras";

const io = socket("https://whatsappbots2-production-9603.up.railway.app");

class UserWppHandler {
  UserWppData: Client;
  UserAppData: { webUrl: string, webId: string };
  QR: string;
  QRScanned: boolean = false;
  CleanUpFlag: boolean = false;

  messageQueue: any = [];
  isSendingMessage = false;
  userInfo: { [key: string]: any } = {};
  toChatGpt: { id: string, mensaje: string }[] = [];

  constructor() {
  }

  async CreateNewClient(webId: string, webUrl: string) {
    try {
      this.UserWppData = new Client({
        authStrategy: new RemoteAuth({
          store: MyStore,
          backupSyncIntervalMs: 300000,
          clientId: webId,
        }),
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
          ],
        },
      });
      this.UserAppData = { webId, webUrl };

      this.UserWppData.initialize();
      this.UserWppData.on('qr', async (qr) => {
        qrcode.generate(qr, { small: true });
        this.QR = qr;
        console.log("envíoQR");

        io.emit("whatsappAuth", { qr, webId, webUrl, paso: true });

        setTimeout(() => {
          if (!this.QRScanned) {
            this._CleanupClient();
            io.emit("whatsappFail", webUrl);
          }
        }, 30000); // 30 segundos en milisegundos
      });
      this._WhatsAppUserEvents(webId);
    } catch (error) {
      console.log("Error al crear usuario de wpp", error);
    }
  }

  async ProcessMessageQueue() {
	let message: Message;
	try {
	  if (this.messageQueue.length > 0) {
		this.isSendingMessage = true;
		message = this.messageQueue.shift();
		const clientId = message.from.split('@')[0];
  
		if (!this.userInfo[clientId]) {
		  this.userInfo[clientId] = {
			nombre: '',
			edad: '',
			genero: '',
			kg: '',
			objetivos: '',
			messages: []
		  };
		}
  
		const lowerCaseMessage = message.body.toLowerCase();
		this.toChatGpt.push({ id: message.from, mensaje: message.body });
  
		this.userInfo[clientId].messages.push(message.body);
  
		let respuestas = await clients.findById("65418e37616e0ad6026816aa");
		const cliente = this.userInfo[clientId];
  
		// Validar y enviar mensajes en el orden correcto
		if (!cliente.nombre) {
		  this.UserWppData.sendMessage(message.from, respuestas.nombre);
		  this.userInfo[clientId].nombre = lowerCaseMessage;
		} else if (!cliente.edad) {
		  this.UserWppData.sendMessage(message.from, respuestas.edad);
		  this.userInfo[clientId].edad = lowerCaseMessage;
		} else if (!cliente.genero) {
		  this.UserWppData.sendMessage(message.from, respuestas.genero);
		  this.userInfo[clientId].genero = lowerCaseMessage;
		} else if (!cliente.kg) {
		  let messageNumber = parseInt(lowerCaseMessage, 10);
		  if (
			lowerCaseMessage.includes('peso') ||
			lowerCaseMessage.includes('kg') ||
			lowerCaseMessage.includes('kilo') ||
			lowerCaseMessage.includes('kilogramo') ||
			lowerCaseMessage.includes('kilogramos') ||
			lowerCaseMessage.includes('kgs') ||
			lowerCaseMessage.includes('libra') ||
			lowerCaseMessage.includes('libras') ||
			(messageNumber >= 40 && messageNumber <= 260)
		  ) {
			this.UserWppData.sendMessage(message.from, respuestas.alergia);
			this.userInfo[clientId].kg = lowerCaseMessage;
		  } else {
			// Mensaje de error si el peso no se proporciona correctamente
			this.UserWppData.sendMessage(message.from, "Por favor, proporcione su peso en kilogramos.");
		  }
		} else if (!cliente.objetivos) {
		  if (lowerCaseMessage.includes('alergia') || lowerCaseMessage.includes('comida')) {
			this.UserWppData.sendMessage(message.from, respuestas.objetivos);
			this.userInfo[clientId].objetivos = lowerCaseMessage;
		  } else {
			// Mensaje de error si los objetivos no se proporcionan correctamente
			this.UserWppData.sendMessage(message.from, "Por favor, indique sus objetivos alimenticios o alergias.");
		  }
		} else {
		  // Todos los datos están disponibles, generar la dieta
		  const prompt = `Crea una dieta con estos datos ${JSON.stringify(cliente)} y incluye: Estado aproximado de la persona, cantidad recomendada por su estado de ingesta de calorías y una lista de compra del supermercado. La respuesta es para enviarla por WhatsApp. Incluye emojis además de su descripción, peso, edad, nombre, etc.`;
  
		  console.log(prompt);
		  let peticion = await peticionAI(prompt);
  
		  // Divide el mensaje en párrafos separados
		  const parrafos = peticion.split('\n\n');
  
		  // Enviar cada párrafo como un mensaje individual
		  for (const parrafo of parrafos) {
			this.UserWppData.sendMessage(message.from, parrafo);
		  }
  
		  // Reiniciar la información del cliente después de enviar la dieta
		  this.userInfo[clientId] = {
			nombre: '',
			edad: '',
			genero: '',
			kg: '',
			objetivos: '',
			messages: []
		  };
		}
  
		await this.ProcessMessageQueue();
	  } else {
		// No hay más mensajes en la cola
		this.isSendingMessage = false;
	  }
	} catch (error) {
	  console.log("Se produjo un error al responder:", error);
	  await this.ProcessMessageQueue();
	  if (this.UserWppData) {
		return this.UserWppData.sendMessage(message.from, "Hubo un error, intenta más tarde");
	  }
	}
  }
  

  async EnqueueMessage(message: Message) {
    this.messageQueue.push(message);

    if (!this.isSendingMessage) {
      this.isSendingMessage = true;
      const clientId = message.from.split('@')[0];

      if (!this.userInfo[clientId]) {
        this.userInfo[clientId] = {
          nombre: '',
          edad: '',
          genero: '',
          kg: '',
          objetivos: '',
          messages: []
        };
      }

      this.userInfo[clientId].messages.push(message.body);

      await this.ProcessMessageQueue();
    }
  }

  _WhatsAppUserEvents(webId: string) {
    this.UserWppData.on("ready", async () => {
      console.log("WhatsApp bot successfully connected!");
      this.UserWppData.sendPresenceAvailable();
      console.log(webId);

      io.emit("whatsappConnected", this.UserAppData);
    });

    this.UserWppData.on("message", async (msg) => {
      console.log("Llega mensaje:", msg.body);
      await this.EnqueueMessage(msg);
    });

    this.UserWppData.on('disconnected', () => {
      console.log('WhatsApp lost connection.');
      this._CleanupClient();
    });
    this.UserWppData.on('loading_screen', () => {
      this.QRScanned = true;
      console.log("qr escaneado");
    });
  }

  _CleanupClient() {
    if (this.UserWppData) {
      this.UserWppData.removeAllListeners();
      this.UserWppData.destroy();
      this.UserWppData = null;
      this.UserAppData = null;
      this.QR = null;
    }
  }
}

export default UserWppHandler;
