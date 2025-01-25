import Project from "../models/project.model.js";
import { createProject, getAllProjectByUserId, addUsersToProject, getProjectById } from "../services/project.service.js";
import {validationResult} from "express-validator"
import userModel from "../models/user.model.js"


export const createProjectController = async (req, res)=>{
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    try {
        const {name} = req.body;
        const loggedInUser = await userModel.findOne({email: req.user.email});
        const userId = loggedInUser._id;

        const newProject = await createProject({name, userId})

        res.status(201).json(newProject)
    } catch (error) {
        console.log(error.message);
        res.status(400).send(error.message)
    }

}

export const getAllProject = async (req,res)=>{
    try {

        const loggedInUser = await userModel.findOne({email: req.user.email})
        
        const allProjects = await getAllProjectByUserId({userId: loggedInUser._id})

        return res.status(200).json({projects: allProjects})
        
    } catch (error) {
        console.log(error);
        res.status(404).json({error: "Something went wrong"})
    }
}


export const addUserToProject = async (req,res)=>{
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {

        const {projectId, users} = req.body;

        users.forEach(user => {
            console.log(typeof user);
        });
        

        const loggedInUser = await userModel.findOne({email: req.user.email})

        const project = await addUsersToProject({projectId: projectId, users ,userId: loggedInUser._id})

        return res.status(200).json({project})
        
        
    } catch (error) {
        console.log(error);
        res.status(400).json({error: "Something went wrong"})
    }
}


export const getProjectId = async (req,res)=>{
    try {

        const {projectId} = req.params;

        const project = await getProjectById({projectId: projectId})

        return res.status(200).json({project})
        
        
    } catch (error) {
        console.log(error);
        res.status(400).json({error: "Something went wrong"})
    }
}


