import { Client,RemoteAuth,Message, Buttons, List } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { MyStore,clients,webs } from '../databases/mongodb/index'
import socket from "socket.io-client";
import axios from "axios"



// import { recargarMensajes,generarRespuesta } from '../helpers'

const io = socket("https://whatsappbots2-production-9603.up.railway.app");
// const io = socket("http://localhost:8081");

class UserWppHandler {
	UserWppData: Client
	UserAppData: { webUrl: string,webId: string }
	QR: string
	QRScanned: boolean = false
	CleanUpFlag: boolean = false

	messageQueue: any = []
	isSendingMessage = false;


	constructor() {
	}

	async CreateNewClient(webId: string,webUrl: string) {
		try {

			this.UserWppData = new Client({
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
			})
			this.UserAppData = { webId,webUrl }

			this.UserWppData.initialize()
			this.UserWppData.on('qr',async (qr) => {
				qrcode.generate(qr,{ small: true })
				this.QR = qr
				console.log("envíoQR");

				io.emit("whatsappAuth",{ qr,webId,webUrl,paso: true })

				setTimeout(() => {
					if (!this.QRScanned) {
						this._CleanupClient()
						io.emit("whatsappFail",webUrl)
					}
				},30000); // 30 segundos en milisegundos
			});
			this._WhatsAppUserEvents(webId)
		} catch (error) {
			console.log("Error al crear usuario de wpp",error);
		}
	}





	async ProcessMessageQueue() {
		let message: Message
		try {
			if (this.messageQueue.length > 0) {
				this.isSendingMessage = true;
				console.log("reciboMensaje");
				message = this.messageQueue.shift();
				let mensaje = message.body.toLowerCase();
			

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
			
					  let respuestas = await clients.findById("65418e37616e0ad6026816aa")
					  let userInfo = {};
					  let toChatGpt = [];
					  
						const lowerCaseMessage = message.body.toLowerCase();
						toChatGpt.push(message.body);
					  
						// Push the user's messages to the userInfo array
						userInfo[message.from] = userInfo[message.from] || [];
						userInfo[message.from].push(message.body);
					  
						if (lowerCaseMessage.includes('nombre')) {
						 this.UserWppData.sendMessage(message.from, respuestas.nombre);
						}
					  
						if (checkTarget('edad', lowerCaseMessage)) {
						 this.UserWppData.sendMessage(message.from, respuestas.edad);
						}
					  
						if (checkTarget('genero', lowerCaseMessage)) {
						 this.UserWppData.sendMessage(message.from, respuestas.genero);
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
											 this.UserWppData.sendMessage(message.from, respuestas.alergia);
						}
					  
						if (checkTarget('alergia', lowerCaseMessage) || checkTarget('comida', lowerCaseMessage)) {
						 this.UserWppData.sendMessage(message.from, respuestas.objetivos);
						}
					  
						if (checkTarget('objetivos', lowerCaseMessage)) {
							this.UserWppData.sendMessage(message.from,`¡Perfecto! 🎯 Hemos acabado. Déjame revisar circuitos y en unos segundos tendrás tu dieta lista.`);
					  
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
							this.UserWppData.sendMessage(message.from,response.data.choices[0].message.content);
						  } catch (err) {
							this.UserWppData.sendMessage(message.from,"Ups, disculpa, mis circuitos han fallado");
							console.log(err);
						  }
				
				const queueLength = this.messageQueue.length
				console.log(`${queueLength === 1 ? "Queda " + queueLength + " mensaje" : "Quedan " + queueLength + " mensajes"}  por responder`);
				console.log("mensaje enviado");
				this.isSendingMessage = false;

				await this.ProcessMessageQueue();
			}
			} else {
				// No hay más mensajes en la cola
				this.isSendingMessage = false;
			}
		} catch (error) {
			// Aquí, puedes manejar el error.
			console.log("Se produjo un error al responder:",error);
			await this.ProcessMessageQueue();
			if (this.UserWppData) {
				return this.UserWppData.sendMessage(message.from,"Hubo un error, intenta mas tarde")
			}
		}
	}

	async EnqueueMessage(message: Message) {
		this.messageQueue.push(message);
		// Si no se está enviando un mensaje actualmente, inicia el proceso de envío
		if (!this.isSendingMessage) {
			await this.ProcessMessageQueue();
		}
	}

	_WhatsAppUserEvents(webId: string) {
		this.UserWppData.on("ready",async () => {
			console.log("WhatsApp bot successfully connected!");
			this.UserWppData.sendPresenceAvailable()
			console.log(webId);

			await webs.findByIdAndUpdate(webId,{ $set: { whatsapp: true } })
			io.emit("whatsappConnected",this.UserAppData)
		})

		this.UserWppData.on("message",async (msg) => {
			console.log("Llega mensaje:",msg.body);
			await this.EnqueueMessage(msg)

		})

		this.UserWppData.on('disconnected',() => {
			console.log('WhatsApp lost connection.')
			this._CleanupClient()
		});
		this.UserWppData.on('loading_screen',() => {
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
			this.QR = null
		}
	}
}

export default UserWppHandler;
// async AddNewClient({ webId,webUrl }: any) {
// if (this.AllClients[webId]) throw new Error("Ya está logeado"); //verifica si ya no está logeado
// this._zAttachNewClient(webId)
// this.AllClients[webId].initialize()
// 	this._zAttachQREventHandler_Option_TWO({ webId,webUrl })
// 	this._zAttachSharedEventListeners(webId)


// }

// _zStartSavedSession(webId: string) {
// this._zAttachNewClient(webId)
// this.AllClients[webId].initialize()
// 	this._zAttachQREventHandler_Option_ONE(webId)
// 	this._zAttachSharedEventListeners(webId)
// }

// _zAttachQREventHandler_Option_ONE({ webId,webUrl }: any) {
// 	this.AllClients[webId].on('qr',async (qr) => {
// 		console.log("no pudo logearse",webId);
// 		//lo de abajo no se muy bien
// 		this.AllClients[webId].removeAllListeners()
// 		this.AllQR[webId] = qr
// 		this.AllClients[webId] = undefined
// 		this.AllReadys[webId] = false
// 	});
// }

// _zAttachQREventHandler_Option_TWO({ webId,webUrl }: any) {
// 	this.AllClients[webId].on('qr',async (qr) => {
// 		qrcode.generate(qr,{ small: true })
// 		this.AllQR[webId] = qr

// 		/////////////////////////////
// 		console.log(this.AllClients);
// 		console.log(this.AllQR);
// 		console.log(this.AllReadys);
// 		/////////////////////////////

// 		io.emit("whatsappAuth",{ qr,webId,webUrl,paso: true })
// 	});
// }

// _zAttachSharedEventListeners(webId: string) {

// 	this.AllClients[webId].on('loading_screen',(percent,message) => {
// 		console.log('LOADING SCREEN',percent,message);
// 	});

// 	this.AllClients[webId].on('authenticated',async () => {

// 		io.emit("whatsappAuth",webId)
// 		console.log('Authenticated')
// 	});

// 	this.AllClients[webId].on('auth_failure',() => {

// 		console.log('Authentication failed.')
// 	});

// 	this.AllClients[webId].on('message',async (msg) => {
// 		try {

// 			console.log(msg.body)
// 			console.log(webId)
// 			//@ts-ignore
// 			if (msg._data.deprecatedMms3Url) return msg.reply("Aún no puedo escuchar audios ni ver fotos");

// 			// const usersArray = await users.find({ sitiosWeb: webId });
// 			// const user = usersArray[0];
// 			const web = await webs.findById(webId)
// 			const user = await users.findById(web.usuario)

// 			//@ts-ignore
// 			const clientName = msg._data.notifyName || "Usuario de WhatsApp"


// 			if (user.plan.requests <= 0) {
// 				if (this.ChargingClients[user.id] === true) return
// 				this.ChargingClients[user.id] = true
// 				const { customerId,paymentMethod,plan,token } = user
// 				await recargarMensajes(user,token,customerId,paymentMethod,plan)
// 				console.log("cargando mensajes");

// 				this.ChargingClients[user.id] = false
// 				return msg.reply("Ha ocurrido un error, por favor ponte en contacto con la empresa.");
// 			}
// 			let promp = "Eres un agente de atencion al cliente responde en base las preguntas en base al contexto, si no la sabes se amable, si te preguntan por 1 producto y tienes el enlace intenta venderlo recuerda tratar al cliente por su nombre."
// 			let temperatura = "0.2"
// 			let modelo = undefined
// 			let company = web.url

// 			user.messages.recieved += 1
// 			user.messages.fromWhatsApp += 1
// 			user.messages.sentAutomatically += 1
// 			user.plan.requests -= 1

// 			web.messages.recieved += 1
// 			web.messages.sentAutomatically += 1
// 			web.messages.fromWhatsApp += 1

// 			await user.save();
// 			await web.save()
// 			const question: string = msg.body;

// 			// const responseia = await generarRespuesta(question,company,promp,temperatura,modelo);
// 			const responseia = "respuestaDefault"

// 			const userMessage = { text: question,date: new Date(),admin: false }
// 			const adminResponse = { text: responseia,date: new Date(),admin: true }

// 			const clientId = msg.from.split('@')[0]; // Solo el número de teléfono

// 			let existingClient = await clients.findOne({ clientId });

// 			if (existingClient) {
// 				let payload = { userMessage,adminResponse,clientId: existingClient.id,webUrl: web.url,newClient: null }

// 				const chat = await chats.findOneAndUpdate({ clientId: existingClient.id,webId: web.id },{
// 					$set: { lastMessage: adminResponse },
// 					$push: {
// 						messages: { $each: [userMessage,adminResponse] }
// 					}

// 				},{ new: true })

// 				if (!chat) {
// 					const newChat = await chats.create({ messages: [userMessage,adminResponse],lastMessage: adminResponse,platform: "whatsapp",web: web.url,webId: web.id,clientId: existingClient.id,uuidv4Id: existingClient.clientId,clientName })
// 					existingClient.chats.push(newChat.id)
// 					web.chats.push(newChat.id)
// 					user.clientes += 1
// 					web.clientes.push(existingClient.id)

// 					payload.newClient = newChat

// 					await newChat.save()
// 					await existingClient.save()
// 					await web.save()
// 				}

// 				io.emit("userMensajeWhatsapp",payload);
// 			}
// 			else {
// 				const newClient = await clients.create({ clientId,name: clientName,phone: clientId })
// 				const newChat = await chats.create({ messages: [userMessage],platform: "whatsapp",web: web.url,webId: web.id,clientId: newClient.id,uuidv4Id: newClient.clientId,clientName })

// 				newClient.chats.push(newChat.id)
// 				web.chats.push(newChat.id)

// 				newChat.messages.push(adminResponse)
// 				newChat.lastMessage = adminResponse

// 				user.clientes += 1
// 				web.clientes.push(newClient.id)

// 				await newChat.save()
// 				await newClient.save()
// 				await web.save()

// 				let payload = { userMessage,adminResponse,newClient: newChat,clientId: newClient.id,webUrl: web.url }

// 				io.emit("userMensajeWhatsapp",payload);
// 			}
// 			msg.reply(responseia)

// 		} catch (error) {
// 			console.log(error);

// 		}

// 	});




// 	this.AllClients[webId].on('ready',async () => {
// 		console.log('WhatsApp bot successfully connected!');
// 		this.AllClients[webId].sendPresenceAvailable();

// 	});

// 	this.AllClients[webId].on('remote_session_saved',() => {
// 		console.log('Remote Session saved')
// 	})

// }


