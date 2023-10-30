import { Schema,Document,Types,model } from 'mongoose';
import { toJSON } from './plugins';
import { ObjectId } from 'mongodb';



const clientsSchema = new Schema(
	{
		clientId: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
		},
		name: {
			type: String,
			required: true
		},
		email: {
			type: String
		},
		isOnline: {
			type: Boolean,
			default: false
		},
		chats: [{ type: ObjectId,ref: "chatsSchema",default: [] }],
		purchases: [{ type: ObjectId,ref: "purchaseSchema",default: [] }]
	},
	{
		timestamps: {
			createdAt: 'created_at', // Use `created_at` to store the created date
			updatedAt: 'updated_at', // and `updated_at` to store the last updated date
		},
	}
);

// Aplica el plugin toJSON al esquema
clientsSchema.plugin(toJSON);

export default clientsSchema;
