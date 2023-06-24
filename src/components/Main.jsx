import "../App.css";
import { Routes, Route } from "react-router-dom";
import Calendar from "../pages/Calendar";
import Planner from "../pages/Planner";
import search from "../assets/search.svg";
import ClickedPlan from "./ClickedPlan";
import menu from "../assets/menu.svg";

function Main({setOpen}) {
  return (
    <div className="flex h-screen w-full flex-none sm:flex-1 flex-col">
      <div className="sticky top-0 z-0 flex h-12 flex-none items-center sm:justify-between bg-white pl-2 sm:pl-6 pr-12 shadow-lg">
        <Menu setSideOpen={setOpen}/>
        <SearchBar/>
        <Profile/>
      </div>
      <div className="grow">
        <Routes
        // Page routing
        >
          <Route path="/" element={<Calendar />}/>
          <Route path="planner" element={<Planner />}/>
          <Route path={`planner/:id`} element={<ClickedPlan/>}/>
          <Route path={`planner/pinned/:id`} element={<ClickedPlan/>}/>
        </Routes>
      </div>
    </div>
  );
}

function Menu({setSideOpen}){

  return(
    <button className="sm:hidden ml-2 flex-none" onClick={()=>{setSideOpen(true)}}>
      <img src={menu} alt="search" className="w-6" />
    </button>
  )
}

function SearchBar(){

  return(
    <div className="flex items-center gap-2 px-5 sm:px-0">
      <img src={search} alt="search" className="m-auto w-6 sm:m-0 sm:w-6 opacity-40" />
      <input className="outline-none" type="text" placeholder="Search" />
    </div>
  )
}

function Profile(){

  return(
    <div className="hidden items-center gap-2 sm:flex">
      <div className="h-9 w-9 flex-none rounded-full bg-stone-400 shadow-lg "></div>
      Hello, there
    </div>
  )
}

export default Main;
