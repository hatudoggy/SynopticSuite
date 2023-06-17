import '../App.css'
import { Routes, Route } from "react-router-dom";
import Calendar from "../pages/Calendar"
import Planner from '../pages/Planner';
import search from "../assets/search.svg";

function Main() {


  return (
    <div className='w-full h-screen flex flex-1 flex-col'>
      <div className='h-12 flex-none shadow-lg flex items-center pl-6 pr-12 justify-between sticky top-0 bg-white z-0'>
        <div className='flex items-center gap-2'>
          <img src={search} alt="search" className="sm:w-6 w-6 m-auto sm:m-0" />
          <input className='outline-none' type="text" placeholder='Search'/>
        </div>
        <div className='flex items-center gap-2'>
          <div className='flex-none w-9 h-9 rounded-full bg-stone-400 shadow-lg'></div>
          Hello, there
        </div>
      </div>
      <div className='grow'>
      <Routes
      // Page routing
      >
        <Route path='/' element={<Calendar/>}></Route>
        <Route path='planner/plans' element={<Planner/>}></Route>
      </Routes>
      </div>

    </div>
  )
}

export default Main
