import OpenAI from "openai"

//It takes a configuration Object; 
export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,

})