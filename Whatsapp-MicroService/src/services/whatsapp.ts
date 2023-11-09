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
  userInfo = {};
  toChatGpt = [];

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
    console.log(message);
    try {
      if (this.messageQueue.length > 0) {
        this.isSendingMessage = true;
        console.log("reciboMensaje");
        //Quitar de la queue
        message = this.messageQueue.shift();
        let userInfo = {};
        let toChatGpt = [];
        let mensaje = message.body.toLowerCase();
        console.log(toChatGpt);
        console.log(userInfo);
        const clientId = message.from.split('@')[0];
		console.log(userInfo[clientId] )
        if (!userInfo[clientId]) {
          userInfo[clientId] = {
            nombre: '',
            edad: '',
            genero: '',
            kg: '',
            objetivos: ''
          };
        }

        function checkTarget(target, message) {
          const targetWords = [target, ...(synonymMap[target] || [])];
          return targetWords.some(word => message.includes(word));
        }

        let respuestas = await clients.findById("65418e37616e0ad6026816aa");

        const lowerCaseMessage = message.body.toLowerCase();
        toChatGpt.push(message.body);

        // Push the user's messages to the userInfo array
        userInfo[message.from] = userInfo[message.from] || [];
        userInfo[message.from].push(message.body);

        if (lowerCaseMessage.includes('nombre')) {
          this.UserWppData.sendMessage(message.from, respuestas.nombre);
          userInfo[clientId].nombre = lowerCaseMessage;
        }

        if (checkTarget('edad', lowerCaseMessage)) {
          this.UserWppData.sendMessage(message.from, respuestas.edad);
          userInfo[clientId].edad = lowerCaseMessage;
        }

        if (checkTarget('genero', lowerCaseMessage)) {
          this.UserWppData.sendMessage(message.from, respuestas.genero);
          userInfo[clientId].genero = lowerCaseMessage;
        }
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
          userInfo[clientId].kg = lowerCaseMessage;
        }

        if (checkTarget('alergia', lowerCaseMessage) || checkTarget('comida', lowerCaseMessage)) {
          this.UserWppData.sendMessage(message.from, respuestas.objetivos);
          userInfo[clientId].objetivos = lowerCaseMessage;
        }

        if (checkTarget('objetivos', lowerCaseMessage)) {
          this.UserWppData.sendMessage(message.from, `¡Perfecto! 🎯 Hemos acabado. Déjame revisar circuitos y en unos segundos tendrás tu dieta lista.`);
		  const cliente = userInfo[message.from]; // Obtén los datos del cliente

          // Construye el prompt utilizando los datos del cliente
          const prompt = `Crea una dieta con estos datos:\n\nNombre: ${cliente.nombre}\nEdad: ${cliente.edad}\nGénero: ${cliente.genero}\nKg: ${cliente.kg}\nObjetivos: ${cliente.objetivos}\n\nIncluye: Estado aproximado de la persona, cantidad recomendada por su estado de ingesta de calorías y una lista de compra del supermercado. La respuesta es para enviarla por WhatsApp. Incluye emojis además de su descripción.`;

          console.log(prompt);
          let peticion = await peticionAI(prompt);
          this.UserWppData.sendMessage(message.from, peticion);
          this.toChatGpt = [];
          this.UserWppData.sendMessage(message.from, peticion);
          this.toChatGpt = [];
        }
        await this.ProcessMessageQueue();
      } else {
        // No hay más mensajes en la cola
        this.isSendingMessage = false;
      }
    } catch (error) {
      // Aquí, puedes manejar el error.
      console.log("Se produjo un error al responder:", error);
      await this.ProcessMessageQueue();
      if (this.UserWppData) {
        return this.UserWppData.sendMessage(message.from, "Hubo un error, intenta más tarde");
      }
    }
  }

  async EnqueueMessage(message: Message) {
    this.messageQueue.push(message);
    console.log("586", message);
    this.toChatGpt.push({ id: message.from, mensaje: message.body });

    // Si no se está enviando un mensaje actualmente, inicia el proceso de envío
    if (!this.isSendingMessage) {
      console.log("586", message);
      this.toChatGpt.push({ id: message.from, mensaje: message.body });

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
