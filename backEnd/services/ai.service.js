import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMENI_API);
const model = genAI.getGenerativeModel(
    { 
        model: "gemini-1.5-flash",
        systemInstruction: `Your name is MateAi, and you are been developed by Nester Ferns
         
        
        <example>
            user:Hello 
            "text":"Hello, How can I help you today?"
       </example>
        
        `
    }
);

export const  generateResult = async (prompt)=>{
    try {
        const result = await model.generateContent(prompt);
        // console.log(result);
        
        return result.response.text();
    } catch (error) {
        console.log(error);
    }
}

