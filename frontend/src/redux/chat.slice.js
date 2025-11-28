import { createSlice } from "@reduxjs/toolkit";


const chatSlice = createSlice({
    name: "chat",
    initialState:{
        onlineUsers: [],
        messages: []
    },
    reducers:{
        setOnlineUsers : (state, action) => {
            state.onlineUsers = action.payload;
        },
        setMessages : (state, action) => {
            // Support both direct array and functional updates
            if (typeof action.payload === 'function') {
                state.messages = action.payload(state.messages);
            } else {
                state.messages = action.payload;
            }
        },
        addMessage : (state, action) => {
            // Add a single message without clearing others
            if (Array.isArray(state.messages)) {
                state.messages.push(action.payload);
            } else {
                state.messages = [action.payload];
            }
        }
    }
})

export const {setOnlineUsers, setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;