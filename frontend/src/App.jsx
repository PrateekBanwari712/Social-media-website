import react, { useEffect, useMemo } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import MainLayout from './pages/MainLayout'
import Home from './pages/Home'
import Profile from './pages/Profile'
import ChatPage from './components/ChatPage'
import EditProfile from './pages/EditProfile'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { setSocket } from './redux/socket.slice'
import { setOnlineUsers } from './redux/chat.slice'
import Reels from './pages/Reels'
import { setFollowNotification, setLikeNotification } from './redux/rtn.slice'
import ProtectedRoutes from './pages/auth/ProtectedRoutes'


function App() {
  const { user } = useSelector(store => store.user);
  const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      // if user connect socket io to frontend
      const socketio = io('http://localhost:3000', {
        query: {
          userId: user._id
        },
        //stops unnecessary api calls
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      //listening to all users
      socketio.on('getOnlineUsers', (onlineUser) => {
        dispatch(setOnlineUsers(onlineUser));
      });

      // listening to real time like/dislike notification
      socketio.on('notification', (notificaiton) => {
        dispatch(setLikeNotification(notificaiton))
      })

      //listening to real time follow/unfollow notification
      socketio.on('fNotification', (notificaiton) => {
        dispatch(setFollowNotification(notificaiton))
      })

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch])

  const browserRouter = useMemo(() => createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoutes>
          <MainLayout />
        </ProtectedRoutes>
      ),
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/profile/:id",
          element: <Profile />
        },
        {
          path: "/profile/edit",
          element: <EditProfile />
        },
        {
          path: "/reels",
          element: <Reels />
        },
        {
          path: "/messages",
          element: <ChatPage />
        }
      ]
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/signup",
      element: <Signup />
    }
  ]), [user])

  return (
    <RouterProvider router={browserRouter} />
  )
}

export default App
