import  "dotenv/config.js"
import app from "./app.js"
import http from "http"
import { Server as socketIo } from 'socket.io';
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import ProjectModel from "./models/project.model.js";
import {generateResult} from "./services/ai.service.js"

const server = http.createServer(app)

const io = new socketIo(server, {
    cors: {
        origin: "*"
    }
})

io.use(async (socket, next)=>{
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(" ")[1];        
        const projectId = socket.handshake.query.projectId;

        if(!mongoose.Types.ObjectId.isValid(projectId)){
            return next(new Error("Invalid project ID"))
        } 
        
        socket.project = await ProjectModel.findById(projectId)
        if (!socket.project) {
            return next(new Error("Project not found"));
        }
        
        if(!token){
            return next(new Error("Authentication Failed"))
        }        
        
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        
        if(!decoded){
            return next(new Error("Authentication Failed"))
        }
        
        socket.user = decoded
        next()
        
    } catch (error) {
        next(error);
    }
})

io.on('connection', (socket) => {

    socket.roomId = socket.project._id.toString()
    
    socket.join(socket.roomId);

    socket.on("project-message", async (data)=>{

        const message = data.message;

        const isAiPresent = message.includes("@ai");

        if(isAiPresent){
            const prompt = message.replace("@ai", "");

            let aiResponse = await generateResult(prompt)
            console.log(aiResponse);
            

            io.emit("project-message", {message: aiResponse, sender: {email:"@mateai"}})
            return 
        }

        socket.broadcast.to(socket.roomId).emit("project-message", data)
    })

    socket.on('disconnect', () => {
        console.log('User disconnected');
        socket.leave(socket.roomId);
    });
});

server.listen(process.env.PORT, ()=>{
    console.log("Listening...");
})