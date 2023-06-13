import '../App.css'
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import CalendarPage from "../pages/CalendarPage"
import Planner from '../pages/Planner';
import search from "../assets/search.svg";


function Main() {
  const [title, setTitle] = useState('');
  const location = useLocation();
  
  useEffect(()=>{
    switch(location.pathname){
      case '/':
        setTitle('Calendar');
      break;

      case '/planner':
        setTitle('Planner');
      break;

      default:
        setTitle('');
    }
  }, [location])



  return (
    <div className='w-full flex flex-1 flex-col'>
      <div className='h-12 shadow-lg flex items-center pl-6 pr-12 justify-between'>
        <div className='flex items-center gap-2'>
          <img src={search} alt="search" className="sm:w-6 w-6 m-auto sm:m-0" />
          <input className='outline-none' type="text" placeholder='Search'/>
        </div>
        <div className='text-xl font-semibold'>{title}</div>
        <div className='flex items-center gap-2'>
          <div className='w-9 h-9 rounded-full bg-stone-400 shadow-lg'></div>
          Hello, there
        </div>
      </div>
      <div className='grow overflow-y-scroll'>
      <Routes
      // Page routing
      >
        <Route path='/' element={<CalendarPage/>}></Route>
        <Route path='planner' element={<Planner/>}></Route>
      </Routes>
      </div>

    </div>
  )
}

export default Main
