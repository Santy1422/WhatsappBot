import mongoose,{ Schema } from 'mongoose';
import { toJSON } from './plugins';
import validator from 'validator'
import { ClientError } from '../../../utils/errors';
import { ObjectId } from 'mongodb';
const { v4: uuidv4 } = require('uuid');

export interface IUser {
	role: string;
	password: string;
	email: string;
	name: string;
	token: string;
	company: string;
	phoneNumber: string; // Agregar el número de teléfono de la empresa
	country: string;
	customerId: string;
	googleApi: string;
	number: string;
	companyInfo: object;
	clientId: string
	lastName: string
	messages: any;
	clientes: any;
	web: string;
	sitiosWeb: any
	bots: any
	apiKey: any
	api: any
	paymentMethod: string
	plan: any
	recargandoMensajes: boolean
}


const usersSchema = new Schema<IUser>(
	{
		role: {
			type: String,
			default: 'user', //user, empleado, gerente, admin, etc.
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new ClientError('Email no valido.',400);
				}
			},
		},
		password: {
			type: String,
		},
		name: {
			type: String,
			required: true,
		},
		lastName: {
			type: String
		},
		company: {
			type: String,
			default: "none"

		},
		web: {
			type: String,
			default: "none"
		},
		token: {
			type: String,
		},
		phoneNumber: {
			type: String, // Agregar el número de teléfono de la empresa
		},
		country: {
			type: String
		},
		clientes: {
			type: Number,
			default: 0
		},
		customerId: {
			type: String, //stripe
		},
		clientId: {
			type: String, //google
		},
		apiKey: {
			type: String,
			default: uuidv4(), // Genera un UUID automáticamente cuando se crea un nuevo objeto
			unique: true, // Asegura que cada apiKey sea único
		},
		googleApi: {
			type: String
		},
		companyInfo: {
			ventasMensuales: {
				type: String,
				default: "none"
			},
			empleados: {
				type: String,
				default: "none"

			},
			sector: {
				type: String,
				default: "none"

			},
			plataforma: {
				type: String,
				default: "none"

			},
			facturacionAnual: {
				type: String,
				default: "none"

			},
			web: {
				type: String,
				default: "none"

			}
		},
		api: {
			type: String,
		},
		paymentMethod: {
			type: String
		},
		recargandoMensajes: {
			type: Boolean,
			default: false
		},
		plan: {
			name: { type: String,default: "gratis" },
			price: { type: Number,default: 0 },
			requests: { type: Number,default: 50 },
			extraRequestsCount: { type: Number,default: 50 },
			extraRequestsPrice: { type: Number,default: 1000 },
			maxWebsites: { type: Number,default: 1 }
		},
		messages: {
			recieved: { type: Number,default: 0 },

			sentAutomatically: { type: Number,default: 0 },
			sentManually: { type: Number,default: 0 },

			fromShopify: { type: Number,default: 0 },
			fromWordpress: { type: Number,default: 0 },
			fromMercadoLibre: { type: Number,default: 0 },
			fromWhatsApp: { type: Number,default: 0 }
		},
		sitiosWeb: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'sitioWebSchema',
			},
		]
	},
	{
		timestamps: {
			createdAt: 'created_at', // Use `created_at` to store the created date
			updatedAt: 'updated_at', // and `updated_at` to store the last updated date
		},
	}
);

usersSchema.plugin(toJSON);
//usersSchema.plugin(paginate);

export default usersSchema;
