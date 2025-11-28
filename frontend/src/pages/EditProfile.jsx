import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "../utilities/constant.js";
import toast from 'react-hot-toast'
import { setUser } from "../redux/user.slice.js";
import { Button } from "@/components/ui/button.jsx";
import { RxCross2 } from "react-icons/rx";

const EditProfile = () => {
  const { user } = useSelector(state => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let [loading, setLoading] = useState(false)
  const [input, setInput] = useState({
    profilePicture: user?.profilePicture,
    bio: user?.bio,
    gender: "Male"
  })


  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput({ ...input, profilePicture: file })
    }
  };

  const selectChangeHandler = async (value) => {
    setInput({ ...input, gender: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bio", input.bio)
    formData.append("gender", input.gender)
    if (input.profilePicture) {
      formData.append("profilePicture", input.profilePicture)
    }
    try {
      setLoading(true)
      const res = await axios.post(`${API_URL}/user/edit-profile`, formData, { withCredentials: true })
      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user?.gender,
        }

        toast.success(res.data.message)
        dispatch(setUser(updatedUserData))
        setLoading(false)
        if (user?._id) navigate(`/profile/${user._id}`)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className=" min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 py-4 px-2 flex flex-co items-center justify-center">

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-xl shadow-lg p-4 flex flex-col gap-6 relative">
        <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Edit Profile</h2>
        <div className="absolute top-3 right-3">
          <Button className="bg-red-500 p-0 h-12 w-12 flex items-center justify-center">
            <RxCross2 className="h-12 w-12" />
          </Button>
        </div>
        <div className="flex flex-col items-center gap-2">
          <img
            src={user?.profilePicture}
            alt="profile preview"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 mb-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileChange}
            className="border border-gray-300 rounded px-2 py-1 w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Bio</label>
          <textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            className="border border-gray-300 rounded px-2 py-1 resize-none"
            rows={3}
            placeholder="Write something about yourself..."
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Gender</label>
          <select
            defaultValue={input?.gender}
            onChange={selectChangeHandler}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 mt-4">{loading ? "Saving" : "Save Changes"}</button>
      </form>
    </div>
  );
};

export default EditProfile;
