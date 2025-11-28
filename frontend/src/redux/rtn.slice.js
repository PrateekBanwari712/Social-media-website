import { createSlice } from "@reduxjs/toolkit";


const rtnSlice = createSlice({
    name: 'realTimeNotification',
    initialState: {
        likeNotification: [],
        followNotification : [],
        removeNotification: null,
    },
    reducers: {
        setLikeNotification: (state, action) => {
            if (action.payload.type === 'like') {
                state.likeNotification.push(action.payload)
            } else if (action.payload.type === 'dislike') {
                state.likeNotification = state.likeNotification.filter(
                    (item => !(
                    item.userId === action.payload.userId && 
                    item.postId === action.payload.postId)))
            }
        },
        //removing the notification
        removeNotification: (state, action) => {
            const {userId, postId} = action.payload;
            state.likeNotification = state.likeNotification.filter(
                (item) => !(item.userId === userId && item.postId === postId));
        },
        setFollowNotification: (state , action) => {
            state.followNotification.push(action.payload)
        }
    }
});
export const {setLikeNotification, removeNotification , setFollowNotification } = rtnSlice.actions;
export default rtnSlice.reducer