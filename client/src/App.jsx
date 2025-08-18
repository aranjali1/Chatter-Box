import { Routes,Route } from "react-router-dom"
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'


function App() {

  return (
    <div className="bg-black h-screen">
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
    </Routes>
    </div>
  )
}

export default App
