import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'


const Protected = ({children,role="buyer"}) => {

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    if(loading){
        return (
          <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center text-[#757470] text-xs uppercase tracking-widest font-semibold">
            Loading Atelier...
          </div>
        )
    }

    if(!user){
        return <Navigate to="/login"/>
    }
    console.log(user);
    if(user.role !== role){
        return <Navigate to="/" />
    }

  return children
}

export default Protected