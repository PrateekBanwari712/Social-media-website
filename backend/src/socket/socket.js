import {Server} from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', 
        methods:['GET', 'POST'],
        credentials: true
    }
});

const userSocketMap = {}; //socket id corresponding to the user => socket id
export const getRecieverSocketId = (recieverId) => userSocketMap[recieverId];

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id;
        console.log(`user connected : UserId = ${userId}, socketId = ${socket.id}`);
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        if(userId){
            // when the user disconnect delete the socketid

            delete userSocketMap[userId];
            console.log(`user disconnected: UserId = ${userId}, SocketId = ${socket.id}`);
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
})

export { app, server, io}; 