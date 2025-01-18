import {createUser, getUsers} from "../services/user.service.js"
import {validationResult} from "express-validator"
import userModel from "../models/user.model.js";
import redisClient from "../services/redis.service.js"


export const createUserController = async (req, res)=>{
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    
    try {
        const user = await createUser(req.body)
        
        const token = await user.generateJWT();

        delete user._doc.password
        
        res.status(201).json({user, token})
        
    } catch (error) {
        console.log(error);
    }
}

export const loginUserController = async (req, res)=>{
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    
    try {
        const {email, password} = req.body;
        const userExists = await userModel.findOne({email}).select("+password")
        
        
        if(!userExists){
            return res.status(401).json({errors: "Invalid Credentials"})
        }
        
        
        const passwordValid = await userExists.isValidPassword(password)
        
        if(!passwordValid){
            return res.status(401).json({errors: "Invalid Credentials"})
        }

        const token = await userExists.generateJWT()

        delete userExists._doc.password

        res.status(200).json({userExists, token})

    } catch (error) {
        console.log(error);
    }
}


export const userProfile = async (req, res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(401).json({errors: errors.array()})
    }

    return res.json(req.user)
}


export const logOut = async (req, res)=>{
    try {
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];

        redisClient.set(token, 'logout', 'EX', 60*60*24)

        res.status(200).json({message: "Logged Out Successfully"})

    } catch (error) {
        console.log(error);
    }
}

export const getAllUsersController = async (req, res)=>{
    try {

        const loggedInUser = await userModel.findOne({email: req.user.email})

        const allUsers = await getUsers({userId: loggedInUser.id});
        return res.status(200).json({users: allUsers})
    } catch (error) {
        console.log(error);
    }
}


