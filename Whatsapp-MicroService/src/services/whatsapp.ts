import { Client,RemoteAuth,Message, Buttons, List } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { MyStore,clients,webs } from '../databases/mongodb/index'
import socket from "socket.io-client";
import axios from "axios"
const { OpenAIAPI } = require("openai");


const io = socket("https://whatsappbots2-production-9603.up.railway.app");

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
		console.log(message)
		try {
			// if (this.messageQueue.length > 0) {
			// 	this.isSendingMessage = true;
				console.log("reciboMensaje");
				message = this.messageQueue.shift();
				let mensaje = message.body.toLowerCase();
			

				const synonymMap = {
					nombre: ["nombre", "nombres", "apellido",  "Sofía",
					"Valentina",
					"Isabella",
					"Camila",
					"Valeria",
					"Mariana",
					"Gabriela",
					"Victoria",
					"Lucía",
					"Martina",
					"José",
					"Luis",
					"Carlos",
					"Juan",
					"Andrés",
					"Diego",
					"Fernando",
					"Miguel",
					"Alejandro",
					"Daniel","Pedro",
					"Santiago",
					"Sebastián",
					"Matías",
					"Nicolás",
					"Samuel",
					"Alejandro",
					"David",
					"Benjamín",
					"Lucas",
					"Emma",
					"Mía",
					"Antonella",
					"Olivia",
					"Regina",
					"Fernanda",
					"Paula",
					"Emilia",
					"Renata",
					"Salomé",
					"Angel",
					"Leonardo",
					"Rodrigo",
					"Francisco",
					"Antonio",
					"Joaquín",
					"Tomás",
					"Manuel",
					"Gustavo",
					"Rafael",
					"Paola",
					"Laura",
					"Andrea",
					"Patricia",
					"Verónica",
					"Elizabeth",
					"Karla",
					"Diana",
					"Carla",
					"Adriana",
					"Julia",
					"Ana",
					"Violeta",
					"Esteban",
					"Agustín",
					"Javier",
					"Ramón",
					"Rubén",
					"Eduardo",
					"Armando", "Roberto",
					"Ángel",
					"Christian",
					"Franco",
					"Gabriel",
					"Ignacio",
					"Jorge",
					"Josué",
					"Julio",
					"Mario",
					"Martín",
					"Maximiliano",
					"Oscar",
					"Pablo",
					"Sergio",
					"Alex",
					"Alonso",
					"César",
					"Edgar",
					"Gerardo",
					"Hugo",
					"Isaac",
					"Ricardo",
					"Víctor",
					"Carolina",
					"Catalina",
					"Clara",
					"Daniela",
					"Elisa",
					"Elsa",
					"Fabiana",
					"Gabriella",
					"Giuliana",
					"Inés",
					"Irene",
					"Isabel",
					"Jimena",
					"Joanna",
					"Juana",
					"Luciana",
					"Luna",
					"Magdalena",
					"María",
					"Marisol",
					"Miranda",
					"Norma",
					"Raquel",
					"Sara",
					"Teresa",
					"Yolanda","Alfredo",
					"Arturo",
					"Adrián",
					"Bruno",
					"Claudio",
					"Domingo",
					"Enrique",
					"Ernesto",
					"Felipe",
					"Guillermo",
					"Horacio",
					"Iván",
					"Jaime",
					"León",
					"Lorenzo",
					"Marcelo",
					"Néstor",
					"Orlando",
					"Patricio",
					"Raúl",
					"René",
					"Simón",
					"Ulises",
					"Emilio",
					"Federico",
					"Flavio",
					"Gonzalo",
					"Gregorio",
					"Hernán",
					"Ismael",
					"Julián",
					"Kevin",
					"Leonel",
					"Luciano",
					"Mauricio",
					"Noel",
					"Norberto",
					"Pepe",
					"Quintín",
					"Reynaldo",
					"Salvador",
					"Thiago",
					"Valentín",
					"Xavier",
					"Yago",
					"Zacarías",
					"Alicia",
					"Alma",
					"Amanda",
					"Amelia",
					"Ana Paula", "soy", "me llamo", "mi apodo es", "apelativo", "denominación", "cognombre", "identificación, "],
					genero: ['genero', 'género', 'sexo', 'sex', 'sexo', "hombre", "mujer", "identidad de género", "orientación sexual", "masculino",   "género",
					"sexo",
					"identidad de género",
					"orientación sexual",
					"masculino",
					"femenino",
					"no binario",
					"transgénero",
					"cisgénero",
					"intersexual",
					"androgíneo",
					"trans",
					"cis",
					"identidad sexual",
					"expresión de género",
					"diferenciación sexual",
					"características sexuales",
					"atributos de género",
					"roles de género",
					"binarismo de género",
					"espectro de género",
					"fluidez de género",
					"queer",
					"género diverso",
					"identificación sexual",
					"orientación de género","femenino", "no binario"],
					alergia: ['alergia',   "alergia",
					"alérgico",
					"alérgica",
					"reacción alérgica",
					"hipersensibilidad",
					"intolerancia",
					"sensibilidad",
					"reacción de hipersensibilidad",
					"reacción adversa",
					"sensibilidad aumentada",
					"respuesta inmunitaria exagerada",
					"incompatibilidad",
					"desencadenante alérgico",
					"anafilaxia",
					"asma alérgico",
					"dermatitis atópica",
					"eczema",
					"urticaria",
					"rinitis alérgica",
					"conjuntivitis alérgica",
					"choque anafiláctico",
					"síndrome de alergia oral","reacción inmediata",
					"reacción retardada",
					"alergenos",
					"pruebas de alergia",
					"antígenos",
					"inmunoglobulina E",
					"hipoalergénico",
					"alergia estacional",
					"alergia perenne",
					"alergia alimentaria",
					"alergia a los ácaros del polvo",
					"alergia al polen",
					"alergia a las mascotas",
					"alergia al látex",
					"alergia a los medicamentos",
					"alergia al moho",
					"prick test",
					"test de parche",
					"desensibilización",
					"inmunoterapia",
					"autoinyector de epinefrina",
					"antihistamínicos",
					"corticosteroides",
					"broncodilatadores",
					"alergólogo",
					"evitar alérgenos",
					"contaminación cruzada",
					"epitopo",
					"alérgeno potencial",
					"factor desencadenante",
					"reacción cruzada",
					"sensibilización",
					"tolerancia inmunológica",
					"reacción exacerbada",
					"alergia ocupacional",
					"asma ocupacional",
					"dermatitis de contacto",
					"prueba de provocación",
					"eliminación de alérgenos",
					"dieta de eliminación",
					"intolerancia alimentaria",
					"pseudoalergia",
					"reacción no alérgica",
					"hipersensibilidad no alérgica",
					"síndrome de alergia no alérgica",
					"mediadores de la inflamación",
					"respuesta inmune",
					"proteínas de transferencia de lípidos",
					"alergia al níquel",
					"alergia a los sulfitos",
					"reacciones de fase tardía",'alérgico', 'alérgica', 'alérgias', 'alergias', 'alergico', 'alérgic@', "no me gusta", "me cae mal", "me hace mal", "hipersensibilidad", "intolerancia", "aversión", "reacción alérgica"],
					comida: ['comida', 'plato', 'platillo', 'alimento', 'alimentación', 'comidita', "me gusta", "siempre como", "manjar", "sustento", "vianda", "nutritivo", "alimenticio",   "Asado",
					"Empanadas argentinas",
					"Choripán",
					"Milanesa a la napolitana",
					"Dulce de leche",
					"Salteñas",
					"Pique macho",
					"Silpancho",
					"Anticuchos",
					"Ceviche peruano",
					"Lomo saltado",
					"Ají de gallina",
					"Tacos al pastor",
					"Chiles en nogada",
					"Pozole",
					"Feijoada",
					"Moqueca",
					"Pão de queijo",
					"Arepas",
					"Pabellón criollo","Hallacas venezolanas",
					"Carne en vara",
					"Tequeños",
					"Chupe de camarones",
					"Tamales",
					"Mondongo",
					"Sancocho",
					"Lechona",
					"Bandeja paisa",
					"Ajiaco",
					"Cazuela de mariscos",
					"Encebollado",
					"Seco de pollo",
					"Cuy asado",
					"Locro",
					"Sopa paraguaya",
					"Chipa guasu",
					"Pira caldo",
					"Sopa de maní",
					"Pastel de choclo","Ropa vieja",
					"Arroz con pollo",
					"Gallo pinto",
					"Casado",
					"Plátanos fritos",
					"Picadillo",
					"Chimichurri",
					"Matambre",
					"Vitel toné",
					"Barbacoa",
					"Cochinita pibil",
					"Mole poblano",
					"Enchiladas",
					"Tostadas",
					"Churrasco",
					"Feijão tropeiro",
					"Bobó de camarão",
					"Acargajé",
					"Empanadas chilenas",
					"Curanto",],
					objetivos: ['objetivos',  "condición física",
					"forma física",
					"tonificación",
					"definición muscular",
					"masa muscular",
					"fuerza",
					"resistencia",
					"capacidad aeróbica",
					"flexibilidad",
					"agilidad",
					"equilibrio",
					"potencia",
					"vigor",
					"salud",
					"bienestar",
					"rendimiento físico",
					"aptitud física",
					"cuerpo atlético",
					"composición corporal",
					"índice de masa corporal",
					"grasa corporal",
					"peso saludable",
					"estamina",
					"energía",
					"vitalidad",
					"recuperación muscular",
					"estado de forma",
					"mejora física",
					"progreso físico",
					"acondicionamiento físico",
					"habilidad deportiva",
					"competencia física",
					"aptitud deportiva",
					"rendimiento deportivo",
					"nutrición deportiva",
					"entrenamiento de fuerza",
					"entrenamiento cardiovascular",
					"entrenamiento de resistencia",
					"entrenamiento funcional",
					"culturismo",
					"fitness",
					"preparación física",
					"mejora de la postura",
					"salud física", 'meta', 'metas', 'objetivo', 'propósito', 'aspiración', 'metita', 'propósitos', "quiero", "propósitos", "anhelos", "ambiciones", "engordar", "adelgazar", "ser musculoso", "deseos", "metas personales", "ser"],
					edad: ["tengo", "mi edad es", "años",  "edad",
					"años",
					"tengo",
					"mi edad es",
					"cumplo",
					"vividos",
					"de edad",
					"añitos",
					"primaveras",
					"otoños",
					"juvenil",
					"adolescente",
					"adulto",
					"mayor",
					"menor",
					"infante",
					"niño",
					"joven",
					"anciano",
					"vejez",
					"madurez",
					"adultez",
					"senectud",
					"infancia",
					"pubertad",
					"juventud",
					"tercera edad",
					"edad adulta",
					"etapa de vida",
					"periodo vital",
					"década",
					"generación",
					"coetáneo",
					"contemporáneo",
					"natalicio",
					"fecha de nacimiento",
					"cumpleaños",
					"aniversario de nacimiento",
					"luz del día (en sentido figurado de nacimiento)",
					"ser del año de la pera (coloquial para indicar una edad avanzada)",
					"tener más años que Matusalén (expresión coloquial para referirse a alguien muy anciano)","edad"]
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
							const openai = new OpenAIAPI({
								apiKey: respuestas.apikey,
							  });
							const prompt = `Crea una dieta con estos datos ${toChatGpt} y incluye: Estado aproximado de la persona, cantidad recomendada por su estado de ingesta de calorías y una lista de compra del supermercado. La respuesta es para enviarla por WhatsApp. Incluye emojis además de su descripción, peso, edad, nombre, etc.`;
					  
							const response = await openai.createChatCompletion({
								model: "gpt-3.5-turbo",
								messages: [{ role: "user", content: prompt }],
								temperature: 1.0,
								max_tokens: 2000,
								top_p: 1.0,
								stop: ["You:"],
								n: 1,
							  });
						  
							  // Enviar el contenido de la respuesta a través de WhatsApp
							  this.UserWppData.sendMessage(message.from, response.data.choices[0].message.content);
						  } catch (err) {
							this.UserWppData.sendMessage(message.from,"Ups, disculpa, mis circuitos han fallado");
							console.log(err);
						  }
				
				const queueLength = this.messageQueue.length
				console.log(`${queueLength === 1 ? "Queda " + queueLength + " mensaje" : "Quedan " + queueLength + " mensajes"}  por responder`);
				console.log("mensaje enviado");
				this.isSendingMessage = false;

			// 	await this.ProcessMessageQueue();
			// }
			// } else {
			// 	// No hay más mensajes en la cola
			// 	this.isSendingMessage = false;
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

			// await webs.findByIdAndUpdate(webId,{ $set: { whatsapp: true } })
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
