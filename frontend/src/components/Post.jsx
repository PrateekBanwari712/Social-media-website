import React, { useState } from "react";
import { FiHeart, FiBookmark, FiMessageCircle, FiMoreHorizontal } from "react-icons/fi";
import CommentDialog from "./CommentDialog";
import { useSelector } from 'react-redux'
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useLikeHandler } from "../utilities/useLikeHandler";
import useCommentHandler from "../utilities/useCommentHandler";
import useBookmarkHandler from "../utilities/useBookmarkHandler";
import { useNavigate } from "react-router-dom";
import useFollowHanlder from "../utilities/useFollowHanlder";




const Post = ({ post }) => {
    const navigate = useNavigate()
    const { user } = useSelector(store => store.user);
    const [openComment, setOpenComment] = useState(false)
    const { liked, postLike, likeOrDislikeHandler } = useLikeHandler(post);
    const { text, setText, handleComment } = useCommentHandler(post);
    const { isBookmarked, handleBookmark } = useBookmarkHandler(post);
    const { followOrUnfollowHandler } = useFollowHanlder();

    // timestamp
    const timestamp = post?.createdAt;
    const date = new Date(timestamp);
    const now = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const uploadDate = date.toLocaleDateString('en-GB', options);
    const diffInSeconds = Math.floor((now - date) / 1000);

    let formattedDate = "";

    if (diffInSeconds < 60) {
        formattedDate = "just now";
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        formattedDate = `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        formattedDate = `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        formattedDate = `${days} day${days > 1 ? "s" : ""} ago`;
    }


    //latest comment
    const latestComment = post.comments[post.comments.length - 1];

    const isFollowing = !!user?.following?.includes(post?.author._id);
    const isFollowed = !!user?.followers?.includes(post?.author._id);


    return (
        <div className="bg-white rounded-lg shadow p-4 mb-6 max-w-2xl md:w-[65vw] w-[85vw] ">
            {/* Post header */}
            <div className="flex items-center justify-between mb-3 ">
                <div
                    onClick={() => navigate(`/profile/${post?.author._id}`)}
                    className="flex items-center gap-3 cursor-pointer">
                    <Avatar className={'border-2 border-blue-500 w-12 h-12'} >
                        <AvatarImage src={post.author.profilePicture} alt={post?.author.userName} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-semibold text-gray-800">{post?.author.userName}</div>
                        <div className="text-xs text-gray-400">{formattedDate}</div>
                    </div>
                </div>


                {/* Dialog Box  */}
                <Dialog >
                    <DialogTrigger asChild>
                        <FiMoreHorizontal className='cursor-pointer "text-gray-400 hover:text-gray-600' />
                    </DialogTrigger>
                    <DialogContent className={'flex flex-col items-center justify-center text-center bg-gray-50 text-sm '}>
                        <div className=" w-full flex items-center gap-3 ">
                            <div className="flex items-center gap-2">
                                <Avatar className={'border-2 border-blue-500 w-12 h-12'} >
                                    <AvatarImage src={post?.author.profilePicture} alt={post.author.userName} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <h1 className="text-2xl font-semibold">

                                    {post?.author?.userName}
                                </h1>
                            </div>
                            {post?.author._id !== user?._id && <div>
                                <Button className={`bg-blue-500 text-white max-w-32  px-2 py-1 rounded-lg text-sm hover:bg-blue-600 transition ${isFollowing && "bg-red-500 hover:bg-red-600"} cursor-pointer`}
                                    onClick={() => followOrUnfollowHandler(targetUser)}
                                >
                                    {
                                        isFollowed && !isFollowing ? "Follow back"
                                            : isFollowing ? "Unfollow"
                                                : isFollowed && isFollowing ? "Unfollow"
                                                    : "Follow"
                                    } {
                                        post?.author.userName
                                    }
                                </Button>
                            </div>}
                        </div>
                        <div className="w-full flex flex-col justify-start">
                            <h2
                                className="flex mx-2 items-center gap-2 "
                            >uploaded on  < span className="font-semibold text-md" > {uploadDate}</span></h2>
                            <h1 className="text-2xl m-2  flex ">{post?.caption}</h1>
                            <h3 className="flex m-2 overflow-y-auto ">
                                {post?.hashtags?.length > 0 && `#${post?.hashtags.join(" #")}`}
                            </h3>

                        </div>



                    </DialogContent>
                </Dialog>


            </div>

            {/* Media */}

            <div className="mb-1">

                {post?.media?.endsWith("jpg") ? (
                    <img
                        src={post?.media}
                        alt="post"
                        className="w-full rounded-lg object-contain
                        max-h-96 z-10 "
                    />
                ) : (
                    <video
                        src={post?.media}
                        controls
                        className="w-full max-h-[50vh] rounded-lg object-contain"
                    />
                )}

            </div>
            <div>
                <h2 className="text-xl mb-1">
                    {
                        post?.caption
                    }</h2>
            </div>


            {/* Action buttons */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex gap-4">
                    <button
                        onClick={likeOrDislikeHandler}
                        className="text-gray-700 hover:text-red-500 transition flex gap-1 items-center justify-center"><FiHeart size={22} className={post.likes.includes(user?._id) && "text-red-500 fill-red-500"} /><span className=" text-gray-700 hover:text-red-500">{postLike} likes</span></button>



                    <button className="text-gray-700 hover:text-blue-500 transition flex gap-1 items-center justify-center"
                        onClick={() => setOpenComment(true)}
                    ><FiMessageCircle size={22} />{post.comments.length} comment</button>
                </div>


                <button
                    onClick={handleBookmark}
                    className="text-gray-600 hover:text-blue-500 transition"><FiBookmark size={22}
                        className={isBookmarked && "fill-gray-600"}
                    /></button>
            </div>

            {/* Latest comment */}
            {
                latestComment && (<div onClick={() => setOpenComment(true)}
                    className="cursor-pointer text-gray-700 hover:text-gray-900 flex items-center gap-2"
                > <Avatar className={'border-1 border-blue-500'}>
                        <AvatarImage src={latestComment?.author?.profilePicture} alt={latestComment?.author?.userName} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>{latestComment?.text}</span>

                </div>)
            }


            <CommentDialog openComment={openComment} setOpenComment={setOpenComment} post={post} />

            {/* Comment box */}
            <div className="flex items-center gap-2 mt-2">
                <input
                    type="text"
                    className="w-[75%]  border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Add a comment..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <Button
                    onClick={handleComment}
                    disabled={!text.trim()}
                    className="bg-blue-600 font-semibold px-1 py-1 rounded-lg hover:bg-blue-50 transition w-[20%]">Post</Button>

            </div>
        </div >
    );
};

export default Post;