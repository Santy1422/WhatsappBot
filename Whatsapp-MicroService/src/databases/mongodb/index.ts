import mongoose from 'mongoose';

import { MONGO_URI } from '../../config/env';
import usersSchema from './schemas/usersSchema'; //1
import clientsSchema from './schemas/clientsSchema';

import sitioWebSchema from './schemas/sitiowebSchema';

mongoose.set('strictQuery', true); //ver sies necesario

const deploy = MONGO_URI;

const conn = mongoose.createConnection(deploy);

export const users = conn.model('users', usersSchema); //1
export const clients = conn.model('clientsSchema',clientsSchema) //3
export const webs = conn.model('sitioWebSchema',sitioWebSchema) //4

//whatsapp mongodb store
import { MongoStore } from'wwebjs-mongo'
export let MyStore

mongoose.connect(MONGO_URI).then(() => {
    MyStore = new MongoStore({ mongoose: mongoose });
    console.log("store connected");
});
 








