import "../App.css";
import { Routes, Route } from "react-router-dom";
import Calendar from "../pages/Calendar";
import Planner from "../pages/Planner";
import search from "../assets/search.svg";
import ClickedPlan from "./ClickedPlan";

function Main() {
  return (
    <div className="flex h-screen w-full flex-1 flex-col">
      <div className="sticky top-0 z-[2] flex h-12 flex-none items-center justify-between bg-white pl-6 pr-12 shadow-lg">
        <div className="flex items-center gap-2">
          <img src={search} alt="search" className="m-auto w-6 sm:m-0 sm:w-6" />
          <input className="outline-none" type="text" placeholder="Search" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 flex-none rounded-full bg-stone-400 shadow-lg"></div>
          Hello, there
        </div>
      </div>
      <div className="grow">
        <Routes
        // Page routing
        >
          <Route path="/" element={<Calendar />}/>
          <Route path="planner/plans" element={<Planner />}/>
          <Route path={`planner/plans/:id`} element={<ClickedPlan/>}/>
          <Route path={`planner/plans/pinned/:id`} element={<ClickedPlan/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default Main;
