import './App.css'
import './index.css'
import Sidebar from './components/Sidebar'
import Main from './components/Main'
import MobileSidebar from './components/MobileSidebar'
import { useState } from 'react'


function App() {

  const [sideOpen, setSideOpen] = useState(false);


  return (
    <div className='flex flex-row-reverse justify-end overflow-scroll remove-scroll'>
      <Main setOpen={setSideOpen}/> 
      <Sidebar/>
      <MobileSidebar open={sideOpen} setOpen={setSideOpen}/>
    </div>
  )
}

export default App
