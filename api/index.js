import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import path from 'path';

const app = express();

dotenv.config()
mongoose.connect(process.env.MONOGO_URL).then(()=>{
    console.log("mongodb is connected")
}).catch((err)=>{
    console.log(err)
})

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser())

app.listen(3000, ()=>{
    console.log("server is running !!! ..")
})

import userRouter from './routes/user.route.js'
app.use("/api/user", userRouter )
import authRouter from './routes/auth.route.js'
app.use("/api/auth", authRouter)
import listingRouter from './routes/listing.route.js'
app.use("/api/listing", listingRouter)

app.use(express.static(path.join(__dirname, '/client/dist')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

//creating middlewar
app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'internal server error'
    return res.status(500).json({
        success : false,
        statusCode,
        message
    })
})