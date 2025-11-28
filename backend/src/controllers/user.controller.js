import { User } from '../models/user.model.js';
import { Post } from '../models/post.model.js '
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import { getRecieverSocketId, io } from '../socket/socket.js';

export const register = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            return res.status(401).json({
                message: "Something is missing"
            })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: "Enter valid Email"
            })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({
                message: "Email already exists",
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            userName,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "Account created successfully",
            success: true
        });


    } catch (error) {
        console.log(error)
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing",
                success: false
            })
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password"
            });
        }
        let token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

        //populate each post if in the post array
        const populatePosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if (post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })
        )

        user = {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            gender: user.gender,
            followers: user.followers,
            following: user.following,
            posts: populatePosts,
            bookmarks: user.bookmarks,
        }

        return res.cookie('token', token).json({
            user,
            message: `Welcome ${user.userName}`,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
export const logout = async (req, res) => {
    try {
        return res.clearCookie("token").status(201).json({
            message: "Logged out successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId)
            // .populate({ path: 'posts', createdAt: -1 })
            // .populate('posts')
            .populate({
                path: "posts",
                populate: [{
                    path: "comments",
                    populate: {
                        path: 'author',
                        select: "userName profilePicture"
                    }
                },
                {
                    path: "author",
                    select: "userName profilePicture"

                }]
            })
            .populate({
                path: "followers",
                select: "userName profilePicture"
            })
            .populate({
                path: "following",
                select: "userName profilePicture"
            })
            .populate('bookmarks')
        return res.status(200).json({
            user,
            success: true
        })

    } catch (error) {
        console.log(error)
    }
}
export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudresponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudresponse = await cloudinary.uploader.upload(fileUri);
        }
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudresponse.secure_url;

        await user.save();

        return res.status(200).json({
            user,
            message: "Profile updated",
            success: true
        })

    } catch (error) {
        console.log(error)
    }
}
export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return register.status(400).json({
                message: "users unavailable",
                success: false
            });
        };
        return res.status(200).json({
            users: suggestedUsers,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
export const followOrUnfollow = async (req, res) => {
    try {
        const followerId = req.id;
        const followingId = req.params.id;

        if (followerId === followingId) {
            return res.status(400).json({
                message: "you cannot follow/unfollow yourself"
            });
        }

        const user = await User.findById(followerId);
        const targetUser = await User.findById(followingId);

        if (!user || !targetUser) {
            return res.status(401).json({
                message: "Someone is missing"
            });
        }

        const isFollowing = user.following.includes(followingId);

        // ---------- UNFOLLOW ----------
        if (isFollowing) {
            await Promise.all([
                User.updateOne({ _id: followerId }, { $pull: { following: followingId } }),
                User.updateOne({ _id: followingId }, { $pull: { followers: followerId } })
            ]);

            const fNotification = {
                type: 'unfollow',
                userId: followerId,
                userDetails: user,
                followingId,
                message: `${user.userName} stopped following you`
            };

         
            const receiverSocketId = getRecieverSocketId(followingId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("fNotification", fNotification);
            }

            const updatedUser = await User.findById(followerId);

            return res.status(200).json({
                message: `Unfollowed ${targetUser?.userName}`,
                success: true,
                following: updatedUser.following
            });
        }

        // ---------- FOLLOW ----------
        await Promise.all([
            User.updateOne({ _id: followerId }, { $push: { following: followingId } }),
            User.updateOne({ _id: followingId }, { $push: { followers: followerId } })
        ]);

        const fNotification = {
            type: 'follow',
            userId: followerId,
            userDetails: user,
            followingId,
            message: `${user.userName} started following you`
        };
 
            const receiverSocketId = getRecieverSocketId(followingId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("fNotification", fNotification);
        }

        const updatedUser = await User.findById(followerId);

        return res.status(200).json({
            message: `Followed ${targetUser?.userName}`,
            success: true,
            following: updatedUser.following
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};
