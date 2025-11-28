import express from 'express';
import cookieparser from 'cookie-parser';
import cors from 'cors'
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import messageRoutes from './routes/message.route.js';
import { app } from './socket/socket.js';
import path from 'path'

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieparser());
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}))

app.use("/api/v1/user", userRoutes)
app.use("/api/v1/post", postRoutes)
app.use("/api/v1/message", messageRoutes)
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (_,res)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
})


export default app;
