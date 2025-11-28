import sharp from "sharp"
import cloudinary from "../utils/cloudinary.js"
import { Post } from '../models/post.model.js'
import { User } from '../models/user.model.js'
import { Comment } from '../models/comment.model.js'
import { getRecieverSocketId, io } from "../socket/socket.js"


export const addNewPost = async (req, res) => {
    try {
        const { caption, hashtags } = req.body;
        const file = req.file;
        const authorId = req.id;
  
        if (!file) {
            return res.status(400).json({
                message: "file required",
            });
        }

        // Parse hashtags from input string (format: "#tag1 #tag2 #tag3")
        let parsedHashtags = [];
        if (hashtags && typeof hashtags === 'string') {
            parsedHashtags = hashtags
                .split(/\s+/)
                .filter(tag => tag.startsWith('#'))
                .map(tag => tag.toLowerCase().slice(1)); // Remove # and lowercase
        }
      
        let fileUri;

        if (file.mimetype.startsWith("image/")) {
            // Optimize image
            const optimizedImageBuffer = await sharp(file.buffer)
                .resize({ width: 800, height: 800, fit: "inside" })
                .toFormat("jpeg", { quality: 80 })
                .toBuffer();

            fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;
        } else if (file.mimetype.startsWith("video/")) {
            // Directly convert video to data URI (no optimization)
            fileUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
        } else {
            return res.status(400).json({ message: "Unsupported file type" });
        }
        // Upload to Cloudinary
        const cloudResponse = await cloudinary.uploader.upload(fileUri, {
            resource_type: "auto", // Important
        });

        const post = await Post.create({
            caption,
            media: cloudResponse.secure_url,
            author: authorId,
            hashtags: parsedHashtags
        });


        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }
        await post.populate({ path: 'author', select: "-password" });
        return res.status(201).json({
            message: "New post added",
            post,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: "userName profilePicture" })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: "userName profilePicture"
                }
            });

        return res.status(200).json({
            posts
        })
    } catch (error) {
        console.log(error)
    }
}
export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = (await Post.find({ author: authorId })).toSorted({ createdAt: -1 }).populate({
            path: 'author',
            select: "userName profilePicture",
            populate: {
                path: 'author',
                select: "userName profilePicture"
            }
        });
        return res.status(200).json({
            posts
        });
    } catch (error) {
        console.log(error)
    }
}
export const likePost = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(401).json({
                message: "Post not found"
            })
        }

        // like logic
        await post.updateOne({ $addToSet: { likes: userId } });
        await post.save();

        //socket io 
        const user = await User.findById(userId).select('userName profilePicture');

        // avoiding self liking notification
        const postOwnerId = post.author.toString();
        const postOwner = await User.findById(postOwnerId);
        if (postOwnerId !== userId) {
            // emit notification event
            const notification = {
                type: 'like',
                userId: userId,
                userDetails: user, // for socket io
                postId,
                message: `${userId?.userName} liked your post`
            }
            const postOwnerSocketId = getRecieverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({
            message: `you liked ${postOwner.userName}'s post`
        })


    } catch (error) {
        console.log(error)
    }
}
export const dislikePost = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(401).json({
                message: "Post not found"
            })
        }
        //dislike logic
        await post.updateOne({ $pull: { likes: userId } });
        await post.save();

        // socket io 
        const user = await User.findById(userId).select('userName profilePicture');

        // removing self dislike notification 
        const postOwnerId = post.author.toString();
        const postOwner = await User.findById(postOwnerId);
        if (postOwnerId !== userId) {
            //emit notification event
            const notification = {
                type: 'dislike',
                userId: userId,
                userDetails: user,
                postId,
                message: `${userId?.userName} disliked your post`
            }
            const postOwnerSocketId = getRecieverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification)

        }


        return res.status(200).json({
            message: `you disliked ${postOwner.userName}'s post`
        })
    } catch (error) {
        console.log(error)
    }
}
export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;
        const { text } = req.body;
        const post = await Post.findById(postId);
        if (!text) {
            return res.status(401).json({ mesage: "text is required" })
        };
        const comment = await Comment.create({
            text,
            author: userId,
            post: postId
        });

        await comment.populate({
            path: "author",
            select: "userName profilePicture"
        });

        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            comment,
            message: "Comment added",
            success: true
        })


    } catch (error) {
        console.log(error)
    }
}
export const getPostComment = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({ post: postId }).populate('author', 'userName profilePicture');

        if (!comments) {
            return res.status(404).json({
                message: "No comments found"
            })
        }
        return res.status(200).json({
            comments
        })
    } catch (error) {
        console.log(error)
    }
}
export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "post not found" })
        }

        //check if the logged in user is the author of the post
        if (post.author.toString() !== authorId) {
            return res.status(401).json({ message: "unauthorised user" })
        }

        //delete post
        await Post.findByIdAndDelete(postId)

        //remove the postId from the user's post
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() != postId);
        await user.save();

        //Delete associated comments from the post
        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            message: "Post deleted",
            success: true
        })

    } catch (error) {
        console.log(error)
    }
}
export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const user = await User.findById(userId);

        if (user.bookmarks.includes(post._id)) {
            // 🔹 Remove bookmark
            await User.findByIdAndUpdate(userId, { $pull: { bookmarks: post._id } });

            const updatedUser = await User.findById(userId).populate("bookmarks");
            return res.status(200).json({
                success: true,
                type: "unsaved",
                message: "Post removed from bookmarks",
                user: updatedUser,
            });
        } else {
            // 🔹 Add bookmark
            await User.findByIdAndUpdate(userId, { $addToSet: { bookmarks: post._id } });

            const updatedUser = await User.findById(userId).populate("bookmarks");
            return res.status(200).json({
                success: true,
                type: "saved",
                message: "Post bookmarked successfully",
                user: updatedUser,
            });
        }
    } catch (error) {
        console.error("Bookmark error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while bookmarking post",
        });
    }
};
