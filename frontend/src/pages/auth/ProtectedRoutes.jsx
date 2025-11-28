import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const ProtectedRoutes = ({children}) => {
    const {user} = useSelector(state => state.user);
    const navigate = useNavigate();

    useEffect(()=>{
      if(user === null || !user){
        navigate("/login")
      }
    }, [user, navigate])
  return (
    <>
    {children}
    </>
  )
}

export default ProtectedRoutes