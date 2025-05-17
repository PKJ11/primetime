import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate() ; 
    const handleclick = ()=>{
        navigate('/register')
    }
  return (
    <div>
      <button onClick={handleclick}></button>
    </div>
  )
}

export default Home
