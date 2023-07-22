import './css/App.css'
import './css/index.css'
import Sidebar from './pages/main/Sidebar'
import Main from './pages/main/Main'
import MobileSidebar from './pages/main/MobileSidebar'
import { useState } from 'react'


function App() {

  const [sideOpen, setSideOpen] = useState(false);


  return (
    <div className='flex h-screen flex-row-reverse justify-end overflow-scroll remove-scroll'>
      <Main setOpen={setSideOpen}/> 
      <Sidebar/>
      <MobileSidebar open={sideOpen} setOpen={setSideOpen}/>
    </div>
  )
}

export default App
