import './css/App.css'
import './css/index.css'
import Sidebar from './pages/main/Sidebar'
import Main from './pages/main/Main'
import MobileSidebar from './pages/main/MobileSidebar'
import LoginPage from './pages/login'
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react'
import ProtectedRoutes from './hooks/ProtectedRoutes'
import { auth } from './config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { AuthProvider } from './hooks/AuthContext'



function App() {
  
  const [sideOpen, setSideOpen] = useState(false);

  const [loading, setLoading] = useState(true);


  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     setLoading(false);
  //       setAuthUser(user);
  //   });

  //   return unsubscribe;
  // }, [])

  return (
    <AuthProvider>
      <Routes>
        <Route path='login' element={<LoginPage/>}/>
        <Route element={<ProtectedRoutes/>}>
          <Route path='/*' element={

              <div className='flex h-screen flex-row-reverse justify-end overflow-scroll remove-scroll'>
                <Main setOpen={setSideOpen}/> 
                <Sidebar/>
                <MobileSidebar open={sideOpen} setOpen={setSideOpen}/>
              </div>

            }/>

        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
