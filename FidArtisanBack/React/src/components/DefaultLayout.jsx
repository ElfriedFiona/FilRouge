import React from 'react'
import { Outlet } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'

export default function DefaultLayout() {
   const{user, token} = useStateContext()

   if(!token){
    return <Navigate to="/login" />
   }

  return (
    <div>
        DefaultLayout
        <Outlet/>
    </div>
  )
}
