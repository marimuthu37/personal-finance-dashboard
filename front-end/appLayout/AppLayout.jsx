import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../src/components/Login'
import Summary from '../src/components/Summary'
import Signup from '../src/components/Signup'


const AppLayout = () => {  
  return (
    <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/summary' element={<Summary />} />
    </Routes>
  )
}

export default AppLayout
