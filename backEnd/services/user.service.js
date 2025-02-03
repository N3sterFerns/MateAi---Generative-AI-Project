import userModel from "../models/user.model.js";


export const createUser = async ({email, password})=>{
    try {

        if(!email && !password) return console.log("Invalid pass and email");

        let user = await userModel.findOne({email: email});
        
        if(user){
            return user;
        }

        const hashpass = await userModel.hashPassword(password)

        user = await userModel.create({
            email,
            password: hashpass
        })
        
        return user;
    } catch (error) {
        console.log(error);
    }
}

// export const getUsers = async({userId})=>{
//     const users = await userModel.find({
//         _id: {$ne: userId}
//     })
//     return users
// }
 
export const getUsers = async({userId, search})=>{
    
    if (!search) {
        throw new Error("Search string is required.");
    }

    const users = await userModel.find({
        _id: {$ne: userId},
        email: {$regex: search, $options: "i"}
    })
    return users
}
 