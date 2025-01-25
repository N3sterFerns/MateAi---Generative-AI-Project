import React, { useEffect, useState,  } from 'react'
import { useUserContext } from '../context/user.context';
import { useNavigate } from 'react-router-dom';

const UserAuth = ({children}) => {
  const {user} = useUserContext();
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("token")
  const navigate = useNavigate()
  
  
  
  
  useEffect(() => {
    if(user){
      setLoading(false)
    }
    if(!token){
      navigate("/login")
    }
    
    if(!user){
      navigate("/login")
    }
  }, [])
  
  if(loading){
    return <div>Loading...</div>
  }
  

  return (
    <>{children}</>
  )
}

export default UserAuth