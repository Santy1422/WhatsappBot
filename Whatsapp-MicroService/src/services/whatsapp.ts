import { Client,RemoteAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { MyStore,clients,users,webs } from '../databases/mongodb/index'
import socket from "socket.io-client";
import axios from "axios"
import { OPENAI_API_KEY } from '../config/env';
type ClientsRecord = Record<string,Client>;
type QRHolder = Record<string,string>;
type CanBeUsed = Record<string,boolean>;


class WspClientsHandler {
	AllClients: ClientsRecord = {}; //contiene usuarios en la memoria ram
	AllQR: QRHolder = {}; //contiene QR codes
	AllReadys: CanBeUsed = {};
	ChargingClients = []
	constructor() {
	}

	Init() {

		webs.find({ "whatsapp": true })
			.then(allusers => {
				for (const element of allusers) {
					console.log("Logeando a:",element.id);
					this._zStartSavedSession(element._id.toString())
				}
			})
	}

	async AddNewClient(webId: string) {
		this._zAttachNewClient(webId)
		this.AllClients[webId].initialize()
		this._zAttachQREventHandler_Option_TWO(webId)
		this._zAttachSharedEventListeners(webId)
		console.log(webId);

	}

	_zStartSavedSession(webId: string) {
		this._zAttachNewClient(webId)
		this.AllClients[webId].initialize()
		this._zAttachQREventHandler_Option_ONE(webId)
		this._zAttachSharedEventListeners(webId)
	}


	_zAttachNewClient(webId: string) {
		this.AllClients[webId] = new Client({
			authStrategy: new RemoteAuth({ store: MyStore,backupSyncIntervalMs: 300000,clientId: webId,}),
			/*             takeoverOnConflict: false,
									takeoverTimeoutMs: 999999, */
			puppeteer: {
				// executablePath: '/usr/bin/google-chrome-stable',
				headless: true,
				args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-accelerated-2d-canvas','--no-first-run','--no-zygote',
					//'--single-process',  <- this one doesn't works in Windows
					'--disable-gpu',],
			},
		});
		console.log(Object.keys(MyStore).length)
	}
	_zAttachQREventHandler_Option_ONE(webId: string) {
		this.AllClients[webId].on('qr',async (qr) => {
			console.log("no pudo logearse",webId);
			this._zSetWspState(webId,false)
			//lo de abajo no se muy bien
			this.AllClients[webId].removeAllListeners()
			this.AllQR[webId] = qr
			this.AllClients[webId] = undefined
			this.AllReadys[webId] = false
		});
	}

	_zAttachQREventHandler_Option_TWO(webId: string) {
		this.AllClients[webId].on('qr',async (qr) => {
			qrcode.generate(qr,{ small: true })
			this.AllQR[webId] = qr
		});
	}

	_zAttachSharedEventListeners(webId: string) {

		this.AllClients[webId].on('loading_screen',(percent,message) => {
			console.log('LOADING SCREEN',percent,message);
		});

		this.AllClients[webId].on('authenticated',async () => {
			const io = socket("https://whatsappbots2-production-9603.up.railway.app");

			io.emit("whatsappAuth",webId)
			console.log('Authenticated')
		});

		this.AllClients[webId].on('auth_failure',() => {

			console.log('Authentication failed.')
		});


	
		this.AllClients[webId].on('message',async (message) => {
			const synonymMap = {
				nombre: ["nombre", "nombres", "apellido", "soy", "me llamo", "mi apodo es", "apelativo", "denominación", "cognombre", "identificación"],
				genero: ['genero', 'género', 'sexo', 'sex', 'sexo', "hombre", "mujer", "identidad de género", "orientación sexual", "masculino", "femenino", "no binario"],
				alergia: ['alergia', 'alérgico', 'alérgica', 'alérgias', 'alergias', 'alergico', 'alérgic@', "no me gusta", "me cae mal", "me hace mal", "hipersensibilidad", "intolerancia", "aversión", "reacción alérgica"],
				comida: ['comida', 'plato', 'platillo', 'alimento', 'alimentación', 'comidita', "me gusta", "siempre como", "manjar", "sustento", "vianda", "nutritivo", "alimenticio"],
				objetivos: ['objetivos', 'meta', 'metas', 'objetivo', 'propósito', 'aspiración', 'metita', 'propósitos', "quiero", "propósitos", "anhelos", "ambiciones", "deseos", "metas personales", "ser"],
				edad: ["tengo", "mi edad es", "años", "edad"]
			  };
	
			function checkTarget(target, message) {
				const targetWords = [target, ...(synonymMap[target] || [])];
				return targetWords.some(word => message.includes(word));
			  }
		console.log(message)
			  let respuestas = await clients.findById("65418e37616e0ad6026816aa")
			  let userInfo = {};
			  let toChatGpt = [];
			  
				const lowerCaseMessage = message.body.toLowerCase();
				toChatGpt.push(message.body);
			  
				// Push the user's messages to the userInfo array
				userInfo[message.from] = userInfo[message.from] || [];
				userInfo[message.from].push(message.body);
			  
				if (lowerCaseMessage.includes('nombre')) {
				  message.reply(respuestas.nombre);
				}
			  
				if (checkTarget('edad', lowerCaseMessage)) {
				  message.reply(respuestas.edad);
				}
			  
				if (checkTarget('genero', lowerCaseMessage)) {
				  message.reply(respuestas.genero);
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
				  ){
									  message.reply(respuestas.alergia);
				}
			  
				if (checkTarget('alergia', lowerCaseMessage) || checkTarget('comida', lowerCaseMessage)) {
				  message.reply(respuestas.objetivos);
				}
			  
				if (checkTarget('objetivos', lowerCaseMessage)) {
				  message.reply(`¡Perfecto! 🎯 Hemos acabado. Déjame revisar circuitos y en unos segundos tendrás tu dieta lista.`);
			  
				  try {
					const prompt = `Crea una dieta con estos datos ${toChatGpt} y incluye: Estado aproximado de la persona, cantidad recomendada por su estado de ingesta de calorías y una lista de compra del supermercado. La respuesta es para enviarla por WhatsApp. Incluye emojis además de su descripción, peso, edad, nombre, etc.`;
			  
					const response = await axios.post(
					  'https://api.openai.com/v1/chat/completions',
					  {
						model: 'gpt-3.5-turbo',
						messages: [{ role: 'user', content: prompt }],
						temperature: 1.0,
						max_tokens: 2000, // Set a higher value for more tokens in the response
						top_p: 1.0,
						stop: ['You:'],
						n: 1, // Limitar la respuesta a 1
					  },
					  {
						headers: {
						  'Content-Type': 'application/json',
						  Authorization: respuestas.apikey,
						},
					  }
					);
					message.reply(response.data.choices[0].message.content);
				  } catch (err) {
					message.reply("Ups, disculpa, mis circuitos han fallado");
					console.log(err);
				  }
				}
		})
	

		this.AllClients[webId].on('disconnected',() => {
			console.log('WhatsApp lost connection.')
			this.AllReadys[webId] = false

		});

		this.AllClients[webId].on('ready',async () => {
			console.log('WhatsApp bot successfully connected!');
			this.AllClients[webId].sendPresenceAvailable();

		});

		this.AllClients[webId].on('remote_session_saved',() => {
			console.log('Remote Session saved')
			this._zSetWspState(webId,true)


		})

	}
	async _zSetWspState(webId: string,state: boolean) {
		await users.findByIdAndUpdate(webId,{ $set: { "whatsapp": state } })
		this.AllReadys[webId] = state

	}



}


const clientsHandler = new WspClientsHandler()
clientsHandler.Init()



export default clientsHandler;


