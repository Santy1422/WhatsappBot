import { Schema,Document,Types,model } from 'mongoose';
import { toJSON } from './plugins';
import { ObjectId } from 'mongodb';


const clientsSchema = new Schema(
	{
		nombre: {
			type: String,
		},
		edad: {
			type: String,
		},
		genero: {
			type: String,
		},
		alergia: {
			type: String
		},
		objetivos: {
			type: String,
		},
		apikey: 
{		type: String
}	

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
