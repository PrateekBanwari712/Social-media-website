import { useEffect } from 'react';
import {useDispatch} from 'react-redux';
import axios from 'axios';
import {API_URL} from '../utilities/constant.js'
import {setPosts} from '../redux/post.slice.js'


const useGetAllPosts = () => {
 const dispatch = useDispatch();
 useEffect(()=>{
    const fetchAllPost = async () => {
        try {
            const response = await axios.get(`${API_URL}/post/getallpost`, {withCredentials: true})
            if(response.data){
                dispatch(setPosts(response.data.posts));
                }
        } catch (error) {
            console.log(error)
        }
    }
    fetchAllPost();
 },[])
}

export default useGetAllPosts