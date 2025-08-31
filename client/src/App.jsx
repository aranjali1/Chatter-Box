import { Routes,Route, Navigate } from "react-router-dom"
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import {Toaster} from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";


function App() {
    const {authUser} = useContext(AuthContext);
  
  return (
    <div className="bg-black h-screen">
      <Toaster/>
    <Routes>
      <Route path='/' element={authUser?<Home/>:<Navigate to="/login"/>}/>
      <Route path='/login' element={!authUser?<Login/>:<Navigate to="/"/>}/>
    </Routes>
    </div>
  )
}

export default App
