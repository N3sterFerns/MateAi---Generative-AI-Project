import mongoose from "mongoose";

const connectDB = ()=>{
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("DB Connected")
    }).catch((err)=>{
        console.log("DB ERROR")
    })
}


export default connectDB;