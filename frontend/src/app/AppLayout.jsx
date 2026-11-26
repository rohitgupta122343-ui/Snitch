
import React from 'react'
import Header from '../feature/shared/components/Header'
import { Outlet } from 'react-router'

const AppLayout = () => {
  return (
    <>
    <Header/>
    <Outlet/>
    </>
  )
}

export default AppLayout