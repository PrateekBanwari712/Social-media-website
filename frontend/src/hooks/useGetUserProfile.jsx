import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { API_URL } from '../utilities/constant.js'
import { useDispatch } from 'react-redux'
import { setUserProfile } from '../redux/user.slice.js'

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`${API_URL}/user/${userId}/get-profile`, { withCredentials: true })
                if (res.data.success) {
                    dispatch(setUserProfile(res.data.user))
                    setLoading(false);
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchUserProfile();
    }, [userId])
    return { loading };
}

export default useGetUserProfile