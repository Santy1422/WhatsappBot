import { OPENAI_API_KEY } from '../config/env';
const { OpenAIAPI } = require("openai");

const openai = new OpenAIAPI({
	apiKey: OPENAI_API_KEY,
  });

  export const peticionAI = async (prompt)=> {
    try{

    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 1.0,
        max_tokens: 2000,
        top_p: 1.0,
        stop: ["You:"],
        n: 1,
      });
      return response.data.choices[0].message.content
    }catch(err) {
      return  "Ups, disculpa, mis circuitos han fallado"
    }
  }