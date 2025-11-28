import { setMessages } from '@/redux/chat.slice'
import { setPosts, setSelectedPost } from '@/redux/post.slice'
import { setSelectedUser, setSuggestedUsers, setUser } from '@/redux/user.slice'
import React from 'react'
import toast from 'react-hot-toast'
import { API_URL } from './constant'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

const useLogoutHandler = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
      //logout handler
  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/logout`, { withCredentials: true })
      if (res.data.success) {
        navigate("/login")
        dispatch(setUser(null))
        dispatch(setSelectedPost(null))
        dispatch(setSelectedUser(null))
        dispatch(setPosts([]))
        dispatch(setSuggestedUsers([]))
        dispatch(setMessages([]))
        toast.success(res.data.message)

      }
    } catch (error) {
      console.log(error)
       toast.error(response.error.message)
    }
  }
  return {logoutHandler}
}

export default useLogoutHandler