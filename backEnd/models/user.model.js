import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

const userScheme = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [6, "Email must be atleast 6 characters long"]
    },
    password: {
        type: String,
        required: true,
        select: false
    }
})

// userScheme.pre("save", async function (next) {
//     if (this.isModified("password") || this.isNew) {
//         try {
//             this.password = await bcrypt.hash(this.password, 10);
//             next();
//         } catch (error) {
//             next(error);
//         }
//     } else {
//         next();
//     }
// });


userScheme.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10)
}

userScheme.methods.isValidPassword = async function (password) {   
    return await bcrypt.compare(password, this.password)
}


userScheme.methods.generateJWT = function(){
    return jwt.sign({email: this.email}, process.env.JWT_SECRET, {expiresIn: "24h"})
}

// userScheme.pre('save', async function(next) {
//     if (this.isModified('password')) {
//         this.password = await userScheme.statics.hashPassword(this.password);
//     }
//     next();
// });

const User = mongoose.model("user", userScheme)



export default User;