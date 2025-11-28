import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllPost, getPostComment, getUserPost, likePost } from '../controllers/post.controller.js';


const postRoutes = express.Router();

postRoutes.post("/addpost", isAuthenticated, upload.single("media"), addNewPost);
postRoutes.get("/getallpost", isAuthenticated, getAllPost);
postRoutes.get("/getuserpost", isAuthenticated, getUserPost);
postRoutes.get("/:id/like", isAuthenticated, likePost);
postRoutes.get("/:id/dislike", isAuthenticated, dislikePost);
postRoutes.post("/:id/addcomment", isAuthenticated, addComment);
postRoutes.post("/:id/comment/all", isAuthenticated, getPostComment);
postRoutes.delete("/delete/:id", isAuthenticated, deletePost);
postRoutes.post("/:id/bookmark", isAuthenticated, bookmarkPost);

export default postRoutes;