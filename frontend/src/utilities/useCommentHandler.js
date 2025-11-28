import axios from 'axios';
import React, { useState } from 'react'
import { API_URL } from './constant';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { setPosts } from '@/redux/post.slice';
import { setUserProfile } from '@/redux/user.slice';

const useCommentHandler = (post) => {
    const [text, setText] = useState("");
    const [comment, setComment] = useState(post?.comments || []);
    const dispatch = useDispatch();
    const { posts } = useSelector(state => state.post);
    const { userProfile } = useSelector(state => state.user);

    if (!post) {
        return { comments: [], handleComment: () => { } };
    }


    const handleComment = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/post/${post._id}/addcomment`, { text }, { withCredentials: true })
                        if (response.data.success) {

                const updatedCommentData = [...post.comments, response.data.comment];
                setComment(updatedCommentData);

                // Update global posts
                const updatedPostData = posts.map(p => p._id === post._id ? { ...p, comments: updatedCommentData } : p);
                dispatch(setPosts(updatedPostData));

                // Update userProfile posts if it exists
                if (userProfile && userProfile.posts) {
                    const updatedUserProfilePosts = userProfile.posts.map(p => p._id === post._id ? { ...p, comments: updatedCommentData } : p);
                    dispatch(setUserProfile({ ...userProfile, posts: updatedUserProfilePosts }));

                }

                setText("");
                toast.success(response.data.message)
            }
        } catch (error) {
            console.log(error)
             toast.error(response.error.message)
        }

    }

    return { text, setText, handleComment }
}

export default useCommentHandler