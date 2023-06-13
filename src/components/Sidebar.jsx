import calendar from "../assets/calendar.svg";
import resources from "../assets/resources.svg";
import clock from "../assets/clock.svg";
import planner from "../assets/planner.svg";
import analytics from "../assets/analytics.svg";
import addButton from "../assets/add-button.svg";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css"
import logo from "../assets/SuiteLogo.png"
import { useState } from "react";

function Sidebar() {

  const linkList = ["www.google.com", "www.youtube.com", "www.github.com", ]

  return (
    <div className="hidden sm:flex h-screen w-36 flex-row sticky top-0 left-0">
      <div className="flex flex-col items-center gap-8 py-6 h-full w-5/12 bg-slate-300">
        <NewLinks/>
        <div className="noScroll flex flex-col gap-4 my-2 h-auto overflow-y-auto">
            {linkList.map((e, key)=>{return <Link link={e} key={key}/>})}

        </div>
      </div>
      <div className="flex flex-col items-center gap-8  py-6 h-full w-7/12 bg-slate-500">
        <div className=""><img src={logo} className="w-12" /></div>

        <div className="flex flex-col gap-4 ">
          <Icon image={calendar} text={"Calendar"} link={"/"}/>
          <Icon image={resources} text={"Resources"} link={"resources"}/>
          <Icon image={clock} text={"Schedule"} link={"schedule"}/>
          <Icon image={planner} text={"Planner"} link={"planner"}/>
          <Icon image={analytics} text={"Analytics"} link={"analytics"}/>
        </div>

      </div>
    </div>
  );
}

function Icon({image, text, link}){
  const navigate = useNavigate()
  return(
    <div 
      className="group relative flex justify-center items-center transition-all
      w-14 h-14 bg-gray-700 rounded-3xl
      hover:bg-gray-800 hover:cursor-pointer hover:rounded-2xl shadow-md"
      onClick={()=>{navigate(link)}}
    >
      <img src={image} alt="calendar" className="w-10" />
      <ToolTip text={text}/>
    </div>
  )
}

function ToolTip({text}){

  return(
    <span className="absolute z-20 w-auto min-w-max invisible group-hover:visible group-hover:block opacity-0 group-hover:opacity-100 transition
    bg-gray-800 text-white p-1 rounded left-16 scale-50 group-hover:scale-100 origin-left shadow-md">
      {text}
    </span>

  )
}

function Link({link}){
  const linkRef = "https://s2.googleusercontent.com/s2/favicons?domain="+link+"&sz=256"
  return(
    <a href={link}>
      <div className={"group relative flex-none flex justify-center items-center transition-all rounded-lg bg-center bg-no-repeat bg-cover "
      +"w-10 h-10 hover:bg-slate-300 hover:opacity-80 shadow-md"
      } 
        style={{backgroundImage:"url("+linkRef+")"}}
      >
      </div>
    </a>
  )
}


function NewLinks() {
  const [modalState, setModalState] = useState(false);

  return (
    <div>
      <LinkModal state={modalState}/>
      <div 
      className="group relative flex-none flex justify-center items-center transition-all
      w-12 h-12 bg-slate-500 rounded-2xl
      hover:bg-gray-700 hover:cursor-pointer hover:rounded-xl shadow-md"
      onClick={()=>{setModalState(!modalState);console.log(modalState)}}
      >
        <img src={addButton} alt="calendar" className="w-10" />
        <ToolTip text={"Add New Link"} />
      </div>

    </div>
  );
}

function LinkModal({state}){

  return(
    <div className={state ? "hidden opacity-0" : "block opacity-100" +" flex flex-col gap-3 absolute translate-x-16 transition-all bg-gray-300 rounded-md p-4 z-30 shadow-lg"}>
      Enter website url:
      <input className="px-2 py-1" type="text" />
      <button className="bg-slate-400 w-1/2 m-auto rounded-md"
      onClick={()=>{}}>Submit</button>
    </div>
  )
}

export default Sidebar;
