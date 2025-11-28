import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { FiHeart, FiMessageCircle, FiBookmark, FiMoreHorizontal } from "react-icons/fi";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import CommentDialog from "../components/CommentDialog";
import { Button } from "@/components/ui/button";
import { useLikeHandler } from "@/utilities/useLikeHandler";
import useCommentHandler from "@/utilities/useCommentHandler";
import useBookmarkHandler from "@/utilities/useBookmarkHandler";
import useFollowHandler from "@/utilities/useFollowHanlder.js";

const Reels = () => {
  const { posts = [] } = useSelector((state) => state.post || {});
  const { user } = useSelector(state => state.user);

  const videos = posts.filter((p) => {
    const url = p?.media
    if (!url) return false;
    const isVideoByType = p?.mediaType === "video";
    const isVideoByExt = /\.(mp4|webm|ogg)($|\?)/i.test(url);
    return isVideoByType || isVideoByExt;
  });

  //refs
  const containerRefs = useRef([]);
  const videoRefs = useRef([]);
  const observer = useRef(null);
  const userInteractedRef = useRef({});

  //states
  const [activeIndex, setActiveIndex] = useState(0);
  const [pausedMap, setPausedMap] = useState({});
  const [overlayVisible, setOverlayVisible] = useState({});
  const [pausedByUserMap, setPausedByUserMap] = useState({});

  // Comment dialog state
  const [openComment, setOpenComment] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Memoized observer callback to prevent re-creating observer on every render
  const observerCallback = useCallback((entries) => {
    entries.forEach((entry) => {
      const idx = Number(entry.target.dataset.index);
      const vid = videoRefs.current[idx];
      if (!vid) return;

      if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
        // Pause others first
        videoRefs.current.forEach((v, i) => {
          try {
            if (v && i !== idx) {
              v.pause();
              setPausedMap((m) => ({ ...m, [i]: true }));
            }
          } catch (e) {
            console.log(e)
          }
        });

        // Try to autoplay the in-view video, unless the user recently interacted with it
        try {
          const last = userInteractedRef.current[idx] || 0;
          const isUserPaused = !!pausedByUserMap[idx];
          // If video is already playing, nothing to do.
          if (!vid.paused) {
            // already playing
          } else if (isUserPaused) {
            // user explicitly paused -> respect it
          } else if (!isUserPaused && Date.now() - last > 1500) {
            // only attempt play if it's actually paused and enough time passed since user interaction
            vid.play()
              .then(() => {
                setPausedMap((m) => ({ ...m, [idx]: false }));
                setOverlayVisible((m) => ({ ...m, [idx]: false }));
                // autoplay succeeded; clear any stale user-paused flag
                setPausedByUserMap((m) => ({ ...m, [idx]: false }));
              })
              .catch(() => {
                setPausedMap((m) => ({ ...m, [idx]: true }));
              });
          }
        } catch (e) { }

        setActiveIndex(idx);
      } else {
        try {
          // Pause when out of view to conserve resources
          if (!vid.paused) vid.pause();
          vid.currentTime = 0;
          setPausedMap((m) => ({ ...m, [idx]: true }));
          // Clear user-paused flag so it autoplays fresh when returning
          setPausedByUserMap((m) => ({ ...m, [idx]: false }));
        } catch (e) { }
      }
    });
  }, [pausedByUserMap]);

  useEffect(() => {
    observer.current = new IntersectionObserver(observerCallback, { threshold: [0.25, 0.6, 0.9] });

    // observe after the DOM paints so refs are set
    requestAnimationFrame(() => {
      containerRefs.current.forEach((el) => el && observer.current.observe(el));
    });

    return () => {
      observer.current && observer.current.disconnect();
    };
  }, [observerCallback, videos]);

  // Re-observe on resize to handle layout changes (refs may move)
  useEffect(() => {
    const handleResize = () => {
      if (!observer.current) return;
      observer.current.disconnect();
      requestAnimationFrame(() => {
        containerRefs.current.forEach((el) => el && observer.current.observe(el));
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openComments = useCallback((post) => {
    setSelectedPost(post);
    setOpenComment(true);
  }, []);

  return (
    <div className="w-full h-full flex justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="max-w-[xl] h-full  p-4 bg-gradient-to-br from-blue-100 to-purple-200">
        <div className="h-[98%] mt-1 overflow-y-auto snap-y snap-mandatory pb-20 lg:pb-0">

          {videos.length === 0 && (
            <div className="max-h-[xl] flex items-center justify-center text-gray-500 object-contain">No reels available</div>
          )}

          {videos.map((post, idx) => (
            <ReelItem
              key={post._id || idx}
              post={post}
              idx={idx}
              containerRefs={containerRefs}
              videoRefs={videoRefs}
              pausedMap={pausedMap}
              setPausedMap={setPausedMap}
              overlayVisible={overlayVisible}
              setOverlayVisible={setOverlayVisible}
              pausedByUserMap={pausedByUserMap}
              setPausedByUserMap={setPausedByUserMap}
              userInteractedRef={userInteractedRef}
              openComments={openComments}
              user={user}
            />
          ))}
        </div>

        {/* Comment dialog - rendered once, not per reel */}
        <CommentDialog
          openComment={openComment}
          setOpenComment={setOpenComment}
          post={selectedPost}
        />
      </div>
    </div>
  );
};

// Memoized ReelItem to prevent re-rendering per-reel
const ReelItem = React.memo(({
  post, idx, containerRefs, videoRefs, pausedMap, setPausedMap,
  overlayVisible, setOverlayVisible, pausedByUserMap, setPausedByUserMap,
  userInteractedRef, openComments, user
}) => {
  const { liked, postLike, likeOrDislikeHandler } = useLikeHandler(post);
  const { isBookmarked, handleBookmark } = useBookmarkHandler(post);
  const { followOrUnfollowHandler } = useFollowHandler();

  // Determine follow status
  const isFollowing = !!user?.following?.includes(post.author?._id);
  const isFollowed = !!user?.followers?.includes(post.author?._id);

  return (
    <div
      data-index={idx}
      ref={(el) => (containerRefs.current[idx] = el)}
      className="h-[90vh] md:h-[95vh] snap-start relative flex items-center justify-center bg-black"
    >
      <video
        ref={(el) => (videoRefs.current[idx] = el)}
        src={post?.media}
        className="w-full h-full object-cover"
        // muted
        autoPlay
        playsInline
        controls={false}
        loop
        preload="metadata"
        onPlay={() => {
          setPausedMap((m) => ({ ...m, [idx]: false }));
          // when playing because of user action, clear user-paused flag
          setPausedByUserMap((m) => ({ ...m, [idx]: false }));
        }}
        onPause={() => {
          setPausedMap((m) => ({ ...m, [idx]: true }));
        }}
        onClick={(e) => {
          e.stopPropagation();
          const v = e.currentTarget;
          const isPaused = v.paused;
          if (isPaused) {
            v.play().catch(() => { });
            setPausedMap((m) => ({ ...m, [idx]: false }));
            // user initiated play -> clear manual-pause flag
            setPausedByUserMap((m) => ({ ...m, [idx]: false }));
          } else {
            v.pause();
            setPausedMap((m) => ({ ...m, [idx]: true }));
            // record that user manually paused this video so observer won't auto-play it
            setPausedByUserMap((m) => ({ ...m, [idx]: true }));
          }
          // show overlay icon briefly on click
          setOverlayVisible((m) => ({ ...m, [idx]: true }));
          // record user interaction to prevent immediate auto-play from observer
          userInteractedRef.current[idx] = Date.now();
          setTimeout(() => setOverlayVisible((m) => ({ ...m, [idx]: false })), 1000);
        }}
      />

      {/* centered play/pause overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        {(overlayVisible[idx] || pausedMap[idx]) && (
          <div className="w-20 h-20 rounded-full bg- flex items-center justify-center text-white">
            {pausedMap[idx] ? <FaPlay size={56} /> : <FaPause size={66} />}
          </div>
        )}
      </div>

      {/* Right action bar */}
      <div className="absolute right-3 md:bottom-36 bottom-28 flex flex-col items-center gap-6 text-white z-20">
        <div
          className="flex flex-col items-center "
        >
          <FiHeart
            onClick={likeOrDislikeHandler}
            size={40} className={`mb-1 drop-shadow-lg fill-whit hover:fill-red-500 hover:text-red-500  ${post.likes.includes(user?. _id) && "fill-red-500 text-red-500"}`} />
          <div className="text-xs">{(post.likes?.length) ?? 0}</div>
        </div>
        <div className="flex flex-col items-center cursor-pointer" onClick={() => openComments(post)}>
          <FiMessageCircle size={40} className="mb-1 drop-shadow-lg hover:text-gray-400" />
          <div className="text-xs">{(post.comments && post.comments.length) || 0}</div>

        </div>
        <div
          onClick={handleBookmark}
          className="flex flex-col items-center">
          <FiBookmark size={40} className={`mb-1 drop-shadow-lg ${isBookmarked && "fill-white"}`} />
          <div className="text-xs">{isBookmarked ? "Saved" : "Save"}</div>
        </div>
        {/* <div className="flex flex-col items-center">
          <FiMoreHorizontal size={26} className="mb-1 drop-shadow-lg" />
        </div> */}
      </div>

      {/* Bottom-left info */}
      <div className="absolute left-4 bottom-[8%] text-white z-20 max-w-xs max-h-[20%]">
        <div className="max-w-xl flex-col overflow-hidden ">
          <div className="flex items-center gap-3 ">
            <img src={post.author?.profilePicture} alt={post.author?.userName} className="w-10 h-10 rounded-full border-2 border-white object-cover" />

            <div className=" overflow-hidden">{post.author?.userName}</div>
            {
              user?. _id !== post.author._id ? (<Button
                className={`max-w-[40%] w-[80px] px-2 py-1 rounded-lg text-sm transition ${isFollowing
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                onClick={() => followOrUnfollowHandler(post.author)}
              >
                {
                  isFollowed && !isFollowing ? "Follow back"
                    : isFollowing ? "Unfollow"
                      : isFollowed && isFollowing ? "Unfollow"
                        : "Follow"
                }
              </Button>) : <Button>Your Post</Button>
            }


          </div>
          <div className="text-lg pl-2">{post.caption}</div>
        </div>
        <div className="text-sm opacity-80">#{(post.hashtags || []).join(" #")}</div>
      </div>

    </div>
  );
});

export default Reels;


