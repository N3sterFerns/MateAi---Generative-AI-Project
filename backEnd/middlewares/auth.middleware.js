import jwt from "jsonwebtoken"
import redisClient from "../services/redis.service.js";

const verifyAuth = async (req, res, next)=>{
    try {
        
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];        
        
        if(!token){
            return res.status(401).json({errors: "Invalid Token"})
        }

        const isBlackListed = await redisClient.get(token);

        if(isBlackListed){
            res.cookie('token', '')
            return res.status(401).json({error: "Unauthorized Access"})
        }
        
        const user = await jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = user;
        next()
    } catch (error) {
        console.log(error);
    }

}

export {verifyAuth}

