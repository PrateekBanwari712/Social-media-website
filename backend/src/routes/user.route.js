import express from 'express'
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, register } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js'
import upload from '../middlewares/multer.js'

const userRoutes = express.Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.get("/logout", logout);
userRoutes.get("/:id/get-profile", isAuthenticated, getProfile);
userRoutes.post("/edit-profile", isAuthenticated, upload.single('profilePicture'), editProfile);
userRoutes.get("/suggested", isAuthenticated, getSuggestedUsers);
userRoutes.post("/followorunfollow/:id", isAuthenticated, followOrUnfollow);


export default userRoutes;