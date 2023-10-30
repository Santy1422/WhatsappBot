import mongoose,{ Schema } from 'mongoose';
import { toJSON } from './plugins';
import { ObjectId } from 'mongodb';

const sitioWebSchema = new Schema({
	image: {
		type: String,
	},
	nombre: {
		type: String,
	},
	plataforma: {
		type: String,
	},
	url: {
		type: String,
		required: true
	},
	usuario: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'usersSchema',
		required: true
	},
	telefono: { //id del bot a utilizar
		type: String,
	},
	whatsapp: { type: Boolean,default: false },
	shopify: { type: Boolean,default: false },
	wordpress: { type: Boolean,default: false },

	messages: {
		recieved: { type: Number,default: 0 },

		sentAutomatically: { type: Number,default: 0 },
		sentManually: { type: Number,default: 0 },

		fromShopify: { type: Number,default: 0 },
		fromWordpress: { type: Number,default: 0 },
		fromMercadoLibre: { type: Number,default: 0 },
		fromWhatsApp: { type: Number,default: 0 }
	},
	respuestasenautomatico: {
		type: Boolean,
		default: true
	},
	uploadedPdf: {
		type: String
	},
	uploadedText: {
		type: String
	},
	chats: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "chatsSchema",
		default: []
	}],
	clientes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "clientsSchema",
		default: []
	}],
});

sitioWebSchema.plugin(toJSON);

export default sitioWebSchema;