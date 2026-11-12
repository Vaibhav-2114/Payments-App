import { useState, useEffect } from 'react'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import axios from "axios"

axios.defaults.baseURL = "http://localhost:3000";

const App = () => {
  const [authStatus, setAuthStatus] = useState("checking");

  useEffect(() => {
    async function checkSession() {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthStatus("loggedOut")
        return;
      }

      try {
        await axios.get("/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAuthStatus("loggedIn");
      } catch {
        localStorage.removeItem("token");
        setAuthStatus("loggedOut");
      }
    }

    checkSession();
  }, [])

  if (authStatus === "checking") {
    return <p>Checking your Session...</p>
  }

  return (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={authStatus === "loggedIn" ? <Dashboard /> : <Navigate to="/signup" replace />} />

        <Route path='/signup' element={authStatus === "loggedIn" ? <Navigate to="/" replace /> : <Signup />} />


        <Route path='/signin' element={authStatus === "loggedIn" ? <Navigate to="/" replace /> : <Signin />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
