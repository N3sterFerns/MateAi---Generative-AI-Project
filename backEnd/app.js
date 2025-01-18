import express from "express"
import morgan from "morgan"
import connectDB from "./db/db.js"
import userRouter from "./routes/user.route.js"
import projectRouter from "./routes/project.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"



const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

connectDB()

app.use("/users", userRouter)
app.use("/project", projectRouter)

export default app;



