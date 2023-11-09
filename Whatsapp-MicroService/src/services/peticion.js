import { OPENAI_API_KEY } from '../config/env';
import OpenAI from 'openai';


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  export const peticionAI = async (prompt)=> {
    try{

      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 1.0,
        max_tokens: 3000,
      });
      console.log(chatCompletion.data.choices[0].message)
      return chatCompletion.data.choices[0].message.content
    }catch(err) {
      console.log(err)
      return  "Ups, disculpa, mis circuitos han fallado"
    }
  }