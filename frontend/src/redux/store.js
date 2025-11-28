import { combineReducers, configureStore } from '@reduxjs/toolkit'
import postSlice from './post.slice.js'
import userSlice from './user.slice.js'
import chatSlice from './chat.slice.js'
import socketSlice from './socket.slice.js'
import rtnSlice from './rtn.slice.js'

import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const rootReducer = combineReducers({
    user: userSlice,
    post: postSlice,
    chat: chatSlice,
    socketio: socketSlice,
    realtimeNotification: rtnSlice,

})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'socketio/setSocket'],
                ignoredPaths: ["socketio.socket"]
            },
        }),
})
export default store;