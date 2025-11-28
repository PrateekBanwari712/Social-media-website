import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "User",
    initialState: {
        user: null,
        suggestedUsers: [],
        userProfile: null,
        selectedUser: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload;
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action. payload;
        }
    }
})

export const { setUser, setSuggestedUsers, setUserProfile, setSelectedUser } = userSlice.actions;
export default userSlice.reducer;