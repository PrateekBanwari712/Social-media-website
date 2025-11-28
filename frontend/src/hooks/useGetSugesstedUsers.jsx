import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { API_URL } from '../utilities/constant';
import { setSuggestedUsers } from '../redux/user.slice.js';

const useGetSugesstedUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSuggestedUsers = async() => {
        try {
            const res = await axios.get(`${API_URL}/user/suggested`, {withCredentials: true})
            if(res.data.success){
                dispatch(setSuggestedUsers(res.data.users));
            }
        } catch (error) {
            console.log(error)
        }
    }
    fetchSuggestedUsers()
  })
}

export default useGetSugesstedUsers