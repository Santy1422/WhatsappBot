import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/../../.env' });



export const OPENAI_API_KEY = process.env.OPENAI_API_KEY
if (!OPENAI_API_KEY) { console.error('[ERROR] Missing .env: OPENAI_API_KEY'); process.exit(1); }

export const MONGO_URI = process.env.MONGO_URI
if (!MONGO_URI) { console.error('[ERROR] Missing .env: MONGO_URI'); process.exit(1); }

export const PORT = process.env.PORT || '8081'
export const NODE_ENV = process.env.NODE_ENV


console.log("URL MONGO DB: ", MONGO_URI);


if (NODE_ENV !== 'PRODUCTION') console.log("Si está en windows, debe usar 'npm run dev'");
console.log("NODE_ENV =", NODE_ENV);




