import '../../css/index.css'
import calendar from "../../assets/calendar.svg";
import resources from "../../assets/resources.svg";
import clock from "../../assets/clock.svg";
import planner from "../../assets/planner.svg";
import notes from "../../assets/notes.svg"
import analytics from "../../assets/analytics.svg";
import logo from "../../assets/SuiteLogo.png";
import { Icon, LinkCont } from './Sidebar'
import { useNavigate } from "react-router-dom";

function MobileSidebar({open, setOpen}) {


  return (
    
    <>
    <div className={(open?'min-[450px]:w-3/5 w-64':'w-0')+' sm:hidden flex bg-slate-300 z-50 overflow-hidden flex-none transition-[width]'}>
        <div className='flex flex-col items-center gap-3 bg-slate-300 px-3 py-5'>
            <LinkCont/>
        </div>
        <Nav/>


        
    </div>

    <div className={(open?'visible opacity-50':'invisible opacity-0')+' sm:hidden z-40 absolute top-0 left-0 bg-slate-900 h-full w-screen'}
        style={{transition:'visibility 0.1s linear, opacity 0.1s linear'}}
        onClick={()=>setOpen(false)}></div>
    </> 


  )
}



function Link(){

    return(
        <div className='bg-zinc-400 w-24 p-3 '>
            hat
        </div>
    )
}

function Nav(){
    
    return(
        <div className='bg-slate-500 flex flex-col gap-3 py-6 px-4 flex-wrap content-center flex-none w-auto min-[450px]:flex-auto md:hidden'>
            <div className='flex justify-center items-center py-5 text-white text-2xl'>
                <img src={logo} className="w-10" />
                <span className='ml-4 min-[450px]:w-auto w-24'>Synoptic Suite</span>
            </div>
            <ResIcon image={calendar} text={"Calendar"} link={"/"} />
            <ResIcon image={resources} text={"Resources"} link={"resources"} />
            <ResIcon image={clock} text={"Schedule"} link={"schedule"} />
            <ResIcon image={planner} text={"Planner"} link={"planner"} />
            <ResIcon image={notes} text={"Notes"} link={"notes"} />
            <ResIcon image={analytics} text={"Analytics"} link={"analytics"} />
        </div>
    )
}

function ResIcon({ image, text, link }){
    const navigate = useNavigate();
    return(
        <div className='flex items-center gap-3 bg-gray-700 p-2 min-[450px]:p-3 text-white text-xl rounded-2xl'
        onClick={() => {navigate(link);}}>
            <img src={image} alt="calendar" className="w-10" /> <span>{text}</span>
        </div>
    )
}

export default MobileSidebar
