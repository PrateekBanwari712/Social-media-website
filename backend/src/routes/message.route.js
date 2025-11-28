import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js';
import {getMessage, sendMessage} from '../controllers/message.controller.js'

const messageRoutes = express.Router();

messageRoutes.post("/send/:id", isAuthenticated, sendMessage);
messageRoutes.get("/all/:id", isAuthenticated, getMessage);

export default messageRoutes;