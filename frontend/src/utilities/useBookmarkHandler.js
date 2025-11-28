import { useDispatch, useSelector } from 'react-redux'
import { API_URL } from './constant'
import axios from 'axios'
import toast from 'react-hot-toast';
import { setUser } from '@/redux/user.slice';

const useBookmarkHandler = (post) => {
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const isBookmarked = user?.bookmarks?.some((bookmark) => bookmark._id === post._id)
    const handleBookmark = async () => {
        try {
            const response = await axios.post(`${API_URL}/post/${post._id}/bookmark`, {}, { withCredentials: true })
            if (response.status == 200) {
                const updatedUser = response.data.user;
                dispatch(setUser(updatedUser));
                toast.success(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(response.error.message)
        }
    }
    return { isBookmarked, handleBookmark }
}

export default useBookmarkHandler