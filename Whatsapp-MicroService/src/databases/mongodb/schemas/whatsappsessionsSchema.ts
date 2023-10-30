import { Schema } from 'mongoose';
import { toJSON } from './plugins';
import validator from 'validator'
import { ClientError } from '../../../utils/errors';

export interface ISession {
  owner: string;
  session: any
}


const whatsappsessionsSchema = new Schema<ISession>(
  {
    owner: {
      type: String,
      default: 'user', //user, empleado, gerente, admin, etc.
    },
    session: {
      
    },
  },
  {
    timestamps: {
      createdAt: 'created_at', // Use `created_at` to store the created date
      updatedAt: 'updated_at', // and `updated_at` to store the last updated date
    },
  }
);

whatsappsessionsSchema.plugin(toJSON);
//usersSchema.plugin(paginate);

export default whatsappsessionsSchema;
