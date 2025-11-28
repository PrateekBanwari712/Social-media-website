import useGetUserProfile from '@/hooks/useGetUserProfile';
import axios from 'axios';
import React from 'react'
import { API_URL } from './constant';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/user.slice';

const useFollowHanlder = () => {
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const followOrUnfollowHandler = async (targetUser) => {
    try {
      if (!user?._id) return;
      const res = await axios.post(`${API_URL}/user/followorunfollow/${targetUser._id}`, {}, { withCredentials: true });
      if (res.status === 200) {
        dispatch(setUser({
          ...user,
          following: res.data.following
        }));
      }
    } catch (error) {
      console.log(error)
       toast.error(response.error.message)
    }
  }
  return { followOrUnfollowHandler }
}

export default useFollowHanlder