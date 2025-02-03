import mongoose from "mongoose";
import Project from "../models/project.model.js";


export const createProject = async ({name, userId})=>{
    if(!name && !userId){
        throw new Error("Name and User is required")
    }

    let project;

    try {
        project = Project.create({
            name, 
            users: [userId]
        }) 
    } catch (error) {
        if(error.code === 400){
            throw new Error("Project Already Exists")
        }
        throw error;
    }

    return project;
}

export const getAllProjectByUserId = async ({userId})=>{
    if(!userId){
        throw new Error("User Id is required")
    }

    const allUserProjects = await Project.find({
        users: userId
    })
    
    return allUserProjects;
}


export const addUsersToProject = async ({projectId, users, userId})=>{
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error("Project Id is required")
    }
    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new Error("User Id is required")
    }
    
    if(!Array.isArray(users)  && users.some((userId)=> !mongoose.Types.ObjectId.isValid(userId))){
        throw new Error("Invalid userid in users array")
    }
    
    const project = await Project.findOne({_id: projectId, users: userId})
    
    if(!project){
        throw new Error("Unauthorized Access")
    }

    const updatedProject = await Project.findOneAndUpdate({
        _id: projectId},
        {
            $addToSet: {
                users: {
                    $each: users
                }
            }
        },
        {
            new: true
        }
    )

    return updatedProject;
    
}

export const getProjectById = async ({projectId})=>{
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error("Project Id is required")
    }
    
    const project = await Project.findOne({_id: projectId}).populate("users")
    
    return project;
    
}



export const deleteProjectById = async ({projectId})=>{
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error("Project not found")
    }

    await Project.findOneAndDelete(projectId)
}


