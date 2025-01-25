import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMENI_API);
const model = genAI.getGenerativeModel(
    { 
        model: "gemini-1.5-flash",
        systemInstruction: "Your name is MateAi, and you are been developed by Nester Ferns"
    }
);

export const  generateResult = async (prompt)=>{
    const result = await model.generateContent(prompt);
    return result.response.text();
}

