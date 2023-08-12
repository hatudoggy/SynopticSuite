import "../../css/App.css";
import Calendar from "../calendar";
import Planner from '../planner';
import search from "../../assets/search.svg";
import ClickedPlan from "../planner/ClickedPlan";
import QuickPlans from "../planner/QuickPlans";
import menu from "../../assets/menu.svg";
import Notes from "../notes";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useAuth } from "../../hooks/AuthContext";
import useClickClose from "../../hooks/useClickClose";


function Main({setOpen}) {
  return (
    <div className="flex h-screen w-full flex-none sm:flex-1 flex-col">
      <div className="sticky top-0 z-10 flex h-14 flex-none items-center sm:justify-between bg-white pl-2 sm:pl-6 pr-12 shadow-lg">
        <div className="flex gap-3">
          <Menu setSideOpen={setOpen}/>
          <SearchBar/>
        </div>
        <Profile/>
      </div>
      <div className="grow ">
        <Routes
        // Page routing
        >
          {/* public routes */}
          

          {/* private routes */}
          <Route path="/" element={<Navigate to={'calendar'} replace={true}/>}/>
          <Route path={'calendar'} element={<Calendar />}/>

          <Route path="planner/" element={<Planner />}>
            <Route path={`:id`} element={<ClickedPlan/>}/>
            <Route path={`pinned/:id`} element={<ClickedPlan/>}/>
            <Route path={`quick-plans`} element={<QuickPlans/>}/>
          </Route>
          <Route path="notes" element={<Notes />}/>
        </Routes>
      </div>
    </div>
  );
}

function Menu({setSideOpen}){

  return(
    <button className="lg:hidden ml-2 flex-none" onClick={()=>{setSideOpen(true)}}>
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
  const { authUser, signout } = useAuth();
  const [logVisible, setLogVisible] = useState(false);

  const modalRef = useRef();
  const buttonRef = useRef();

  useClickClose(modalRef, buttonRef, () => {
    setLogVisible(false);
  });

  return(
    <div className="flex flex-col items-center">
      <button ref={buttonRef} className="hidden items-center gap-2 sm:flex p-1 px-2 rounded-xl hover:bg-zinc-100"
        onClick={()=>setLogVisible(!logVisible)}>
        <div className="h-8 w-8 flex-none rounded-full bg-stone-400 shadow-lg "></div>
        Hello, there {authUser.displayName?.split(" ")[0]}
      </button>
      <div ref={modalRef} 
        className={"absolute mt-11 min-w-[13rem] p-3 rounded-xl shadow-2l bg-white overflow-hidden origin-top "+
              (logVisible?" visibile opacity-100 min-h-fit scale-100":" invisible opacity-0 scale-75 ")}
        style={{transition:'visibility 0.2s ease-in-out, opacity 0.2s ease-in-out, transform 0.2s ease-in-out'}}
      >
        <div className="">
          <div>
            <p className="text-lg">{authUser.displayName}</p>
            <p className="text-sm opacity-75">{authUser.email}</p>
          </div>
          <hr className="w-full border-[1px] border-primary opacity-25 mt-3 mb-1"/>
          <div className="text-left">
            <button className="w-full py-1 px-2 rounded text-left hover:bg-zinc-200 ">Manage Account</button>
            <button onClick={signout} className="w-full py-1 px-2 rounded text-left hover:bg-zinc-200 ">Logout</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main;
