import React, { useState, useRef, useEffect } from "react";
import { readFileAsDataUrl } from '../lib/utils.js'
import toast from "react-hot-toast"
import axios from "axios";
import { API_URL } from "../utilities/constant.js";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/post.slice.js";

const CreatePost = ({ open, setOpen }) => {
	const dispatch = useDispatch();
	const {posts} = useSelector(store => store.post);
	const [media, setMedia] = useState(null);
	const [mediaPreview, setMediaPreview] = useState(null);
	const [caption, setCaption] = useState("");
	const [hashtags, setHashtags] = useState("");
	const [loading, setLoading] = useState(false)
	const overlayRef = useRef();

	useEffect(() => {
		if (!open) {
			setMedia(null);
			setMediaPreview(null);
			setCaption("");
			setHashtags("");
		}
	}, [open]);

	const handleMediaChange = async (e) => {
		const file = e.target.files?.[0];
		if (file) {
			setMedia(file);
			const dataUrl = await readFileAsDataUrl(file);
			setMediaPreview(dataUrl);
		}
	};
	const createPostHandler = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("caption", caption);
		formData.append("hashtags", hashtags);
		if (mediaPreview) { formData.append("media", media) };

		try {
			setLoading(true)
			const res = await axios.post(`${API_URL}/post/addpost`, formData, { withCredentials: true });
			if (res.data.success) {
				dispatch(setPosts([res.data.post, ...posts]))
				toast.success(res.data.message);
				setOpen(false)
				setLoading(false)
			}


		} catch (error) {
			console.log(error)
			toast.error(error.response.data.message)
		} finally {
			setLoading(false)
		}
	};
	
	// Close dialog on outside click
	useEffect(() => {
		function handleClick(e) {
			if (open && overlayRef.current && e.target === overlayRef.current) {
				setOpen(false);
			}
		}
		window.addEventListener("mousedown", handleClick);
		return () => window.removeEventListener("mousedown", handleClick);
	}, [open, setOpen]);

	if (!open) return null;

	return (
		<div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<form
				onSubmit={createPostHandler}
				className="bg-white max-w-lg w-full rounded-lg shadow-lg p-6 flex flex-col gap-4 animate-fadeIn">
				<h2 className="text-xl font-bold text-blue-700 mb-2 text-center">Create a Post</h2>
				<div className="flex flex-col gap-2">
					<label className="font-medium text-gray-700">Image/Video</label>
					<input
						type="file"
						accept="image/*,video/*"
						onChange={handleMediaChange}
						className="border border-gray-300 rounded px-2 py-1"
					/>
					{mediaPreview && (
						<div className="mt-2">
							{media.type.startsWith("image") ? (
								<img src={mediaPreview} alt="preview" className="max-h-48 rounded-lg mx-auto" />
							) : (
								<video src={mediaPreview} controls className="max-h-48 rounded-lg mx-auto" />
							)}
						</div>
					)}
				</div>
				<div className="flex flex-col gap-2">
					<label className="font-medium text-gray-700">Caption</label>
					<textarea
						value={caption}
						onChange={(e) => setCaption(e.target.value)}
						className="border border-gray-300 rounded px-2 py-1 resize-none"
						rows={3}
						placeholder="Write a caption..."
						required
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label className="font-medium text-gray-700">Hashtags</label>
					<input
						type="text"
						value={hashtags}
						onChange={(e) => setHashtags(e.target.value)}
						className="border border-gray-300 rounded px-2 py-1"
						placeholder="#fun #react #coding"
					/>
				</div>
				<div className="flex gap-2 justify-end mt-4">
					<button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold">Cancel</button>
					<button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700" disabled={!media || !caption.trim()}>{loading ? "posting" : "post"}</button>
				</div>
			</form>
		</div>
	);
};

export default CreatePost;
