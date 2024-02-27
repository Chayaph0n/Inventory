import './App.css'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './template/Home'
import Login from './template/Login'
import HomeUpload from './template/HomeUpload'
import HomeTakeReturn from './template/HomeTakeReturn'
import HomeBackup from './template/HomeBackup'
import ProtectedRoute from './components/Authen/ProtectRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<ProtectedRoute element={<Home />} />} />
        <Route path="/upload" element={<ProtectedRoute element={<HomeUpload />} />} />
        <Route path="/takereturn/:InvCOSARefID" element={<ProtectedRoute element={<HomeTakeReturn />} />} />
        <Route path="/backup" element={<ProtectedRoute element={<HomeBackup />} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
