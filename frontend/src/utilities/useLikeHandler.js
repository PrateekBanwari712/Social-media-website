import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "./constant";
import axios from "axios";
import { setPosts } from "@/redux/post.slice";
import toast from "react-hot-toast";
import { useState } from "react";

export const useLikeHandler = (post) => {
    const dispatch = useDispatch();
    const { posts } = useSelector(state => state.post);
    const { user } = useSelector(state => state.user);

    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post.likes.length);

     if (!post) return { liked: false, postLike: 0, likeOrDislikeHandler: () => {} };

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`${API_URL}/post/${post?._id}/${action}`, { withCredentials: true });

            if (res.status === 200) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                setLiked(!liked);

                // Update the posts array in real time
                const updatedPosts = posts.map(p => {
                    if (p._id !== post._id) return p;
                    // if user is not available, don't modify likes
                    if (!user?._id) return p;
                    return {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    };
                });

                dispatch(setPosts(updatedPosts));
                toast(res.data.message);
            }

        } catch (error) {
            console.log(error);
             toast.error(response.error.message)
        }
    };
    return { liked, postLike, likeOrDislikeHandler };
};
