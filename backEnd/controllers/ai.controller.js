import * as ai from "../services/ai.service.js"



export const getAiResult = async (req, res)=>{
    try {
        const {prompt} = req.query;
        const aiResult = await ai.generateResult(prompt)
        res.send(aiResult)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}