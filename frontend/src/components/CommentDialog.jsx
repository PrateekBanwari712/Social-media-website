import React, { useRef, useEffect, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Comment from "./Comment";
import { useDispatch } from "react-redux";
import { Button } from "./ui/button";
import { IoMdClose } from "react-icons/io";
import useCommentHandler from "../utilities/useCommentHandler.js";




const CommentDialog = ({ openComment, setOpenComment, post }) => {
	const overlayRef = useRef();
	const dispatch = useDispatch();
	const [comment, setComment] = useState([])
	const url = post?.media;
	const isVideo = /\.(mp4|webm|ogg)($|\?)/i.test(url) || post?.mediaType === "video";
	const { text, setText, handleComment } = useCommentHandler(post);
	const updatePost = post;

	useEffect(() => {
		if (post) {
			setComment(post.comments);
		}
	}, [post])


	// Close dialog on outside click
	useEffect(() => {
		function handleClick(e) {
			if (openComment && overlayRef.current && e.target === overlayRef.current) {
				setOpenComment(false);
			}
		}
		window.addEventListener("mousedown", handleClick);
		return () => window.removeEventListener("mousedown", handleClick);
	}, [openComment, setOpenComment]);

	if (!openComment) return null;

	return (
		<div
			ref={overlayRef}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
		>
			<div className="bg-gradient-to-br from-blue-100 to-purple-200 h-[70vh] max-h-[70vh] w-full max-w-3xl m-4 rounded-lg shadow-lg flex flex-col animate-fadeIn overflow-hidden">

				<div className="flex flex-1 md:flex-row overflow-y-auto ">

					{/* Left: Media */}
					<div className="md:w-1/2 w-full h-full hidden md:flex md:flex-col items-center justify-center bg-black/10 contain-content p-1 ">

						{isVideo ? (
							<video
								src={url}
								className="max-w-[98%] max-h-[98%] object-cover rounded-lg "
								autoPlay
								controls
								preload="metadata"
							/>
						) : (
							<img
								src={url}
								alt={post.caption || 'post'}
								className="w-full h-full object-contain"
							/>
						)}

					</div>

					{/* Right: Details */}
					<div className="md:w-1/2 w-full flex flex-col bg-white/80 backdrop-blur-sm">

						{/* Header */}
						<div className="flex items-center justify-between p-3 border-b border-black/20">
							<div className="flex gap-3 items-center">
								<Link>
									<Avatar className={'border-2 border-blue-500 h-12 w-12'}>
										{post.author?.profilePicture ? (
											<AvatarImage src={post.author?.profilePicture} />
										) : (
											<AvatarFallback>CN</AvatarFallback>
										)}
									</Avatar>
								</Link>
								<div>
									<h2 className="font-semibold text-lg">
										{post.author.userName}
									</h2>
								</div>
							</div>
							<div
								onClick={() => setOpenComment(false)}
								className="text-xl hover:text-red-500 cursor-pointer"
							>
								<IoMdClose />

							</div>
						</div>

						{/* Comments Section */}
						<div className="flex-1 overflow-y-auto max-h-[55vh] p-4 space-y-3">
							{post.comments.length > 0 ? (
								post.comments.map((comment) => (
									<Comment key={comment._id} comment={comment} />
								))
							) : (
								<p className="text-center text-gray-500 text-sm">
									No comments yet.
								</p>
							)}
						</div>

						{/* Comment Input */}
						<div className="border-t border-gray-300 p-4 flex items-center gap-2">
							<input
								type="text"
								value={text}
								onChange={(e) => setText(e.target.value)}
								className="w-full outline-none border border-gray-300 p-2 rounded text-sm"
								placeholder="Add a comment..."
							/>
							<Button
								className="px-4 py-2 text-sm bg-blue-500"
								disabled={!text.trim()}
								onClick={handleComment}
							>
								Send
							</Button>
						</div>

					</div>
				</div>
			</div>
		</div>


	);
};

export default CommentDialog;
