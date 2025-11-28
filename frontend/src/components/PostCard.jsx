import useBookmarkHandler from '@/utilities/useBookmarkHandler';
import { useLikeHandler } from '@/utilities/useLikeHandler';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { MdDelete } from "react-icons/md";
import { FiBookmark, FiHeart, FiMessageCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import CommentDialog from './CommentDialog';
import { setUserProfile } from '@/redux/user.slice';

const PostCard = ({ post }) => {
    const { liked, postLike, likeOrDislikeHandler } = useLikeHandler(post);
    const { isBookmarked, handleBookmark } = useBookmarkHandler(post);
    const { user, userProfile } = useSelector(state => state.user);

    const dispatch = useDispatch();
    //delete post
    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`${API_URL}/post/delete/${post._id}`, { withCredentials: true });
            if (res.data.success) {
                const updatedUserPostData = userProfile.posts.filter((Item) => Item._id !== post._id);
                dispatch(setUserProfile({ ...userProfile, posts: updatedUserPostData }))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const isOwnProfile = user?._id === userProfile?._id;
    const isUploadedPost = isOwnProfile && post?.author._id === user?._id;

    const [openComment, setOpenComment] = useState(false);

    return (
        <div
            key={post._id}
            className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative group cursor-pointer hover:shadow-lg transition-shadow duration-300"
        >
            {/* Post Media */}
            {post?.media?.endsWith("jpg") || post?.media?.endsWith("png") ? (
                <img
                    src={post?.media}
                    alt="post"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            ) : (
                <video
                    src={post?.media}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            )}

            {/* Action Buttons */}
            <div className="absolute top-2 right-2 z-20">
                {isUploadedPost && 
                    < Dialog >
                        <DialogTrigger asChild>
                            <button className="bg-white p-1.5 sm:p-2 rounded-md shadow hover:bg-red-50 transition cursor-pointer">
                                <MdDelete className="size-4 sm:size-5 text-red-600" />
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader className="text-xl sm:text-2xl">Confirm Delete</DialogHeader>
                            <Button
                                className="bg-red-500 hover:bg-red-600 w-full text-base sm:text-lg py-2 sm:py-3"
                                onClick={deletePostHandler}
                            >
                                <span>Delete Post</span>
                                <MdDelete className="ml-2 size-5" />
                            </Button>
                        </DialogContent>
                    </Dialog>
}

            {  !isUploadedPost && <button
                onClick={handleBookmark}
                className="bg-white p-1.5 sm:p-2 rounded-md shadow hover:bg-blue-50 transition cursor-pointer z-10">
                <FiBookmark
                    className={`size-4 sm:size-5 text-blue-600 
                           ${isBookmarked && "fill-blue-600"}
                          `}
                />
            </button>

            }
        </div>

            {/* Interaction Buttons */ }
            <div
                onClick={likeOrDislikeHandler}
                className="absolute bottom-2 left-2 z-20  ">
                <button
                    className="bg-white p-1.5 sm:p-2 rounded-md shadow hover:bg-red-50 transition flex items-center justify-center gap-2"
                    title="Like"
                >
                    <FiHeart size={18}
                        className={liked ? "text-red-500 fill-red-500" : ""}
                    />
                    <span>{postLike}</span>
                </button>
            </div>

            <div
                onClick={() => dispatch(setOpenComment(true))}
                className="absolute bottom-2 right-2 z-20  ">
                <button
                    className="bg-white p-1.5 sm:p-2 rounded-md shadow hover:bg-blue-50 transition flex items-center justify-center gap-2"

                    title="Comment"
                >
                    <FiMessageCircle size={18} className="text-blue-600" /><span>{post.comments.length}</span>
                </button>
            </div>
    {/* Comment Dialog */ }
    <CommentDialog openComment={openComment} setOpenComment={setOpenComment} post={post} />
        </div >
    )
}

export default PostCard