import express from 'express'
import dotenv from 'dotenv';
dotenv.config();
import cookieparser from 'cookie-parser';
import cors from 'cors'
import { app } from './src/socket/socket.js'
import connectDB from './src/utils/db.js';
import { server } from './src/socket/socket.js';
import userRoutes from './src/routes/user.route.js';
import postRoutes from './src/routes/post.route.js';
import messageRoutes from './src/routes/message.route.js';
import path from 'path'

const _dirname = path.resolve();


const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieparser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
}));


app.use("/api/v1/user", userRoutes)
app.use("/api/v1/post", postRoutes)
app.use("/api/v1/message", messageRoutes)
app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});



connectDB();

server.listen(PORT, () => {
    console.log("Server running at", PORT);
});
