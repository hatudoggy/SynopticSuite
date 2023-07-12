import { useRef, createContext, useState} from 'react'
import '../../css/App.css'
import CalendarWidget from './CalendarWidget'
import {usePosRelativeScreen} from '../../hooks/usePosRelativeScreen'

export const WindowContext = createContext()

function Calendar() {

  const windowRef = useRef();
  const [winRef, setWinRef] = useState(windowRef);
  return (
    <div ref={windowRef} className='w-full h-full flex justify-start items-center overflow-hidden'>
      <WindowContext.Provider value={winRef}>
        <CalendarWidget/>
      </WindowContext.Provider>

      {/* <Card winRef={winRef}/> */}

      
    </div>
  )
}


function Card({winRef}){

  const popupRef = useRef();
  const buttonRef = useRef();

  const [coordX, coordY] = usePosRelativeScreen(popupRef, buttonRef, winRef)

  return(
    <div className=''>
      <button ref={buttonRef} className='bg-zinc-300 p-2 rounded-lg peer'>
        Button Tag
      </button>
      <Pop popupRef={popupRef} coordX={coordX} coordY={coordY}/>
    </div>
  )
}

function Pop({popupRef, coordX, coordY}){

  //console.log("X: "+ coordX);
  //console.log("Y: "+ coordY);
  return(
    <div ref={popupRef} className='absolute w-72 h-56 m-5 translate-x-0 translate-y-0 bg-slate-300 rounded-lg invisible peer-focus:visible'
      //style={{transform:`translateY(${-100+"%"})`}}
      style={{transform:`translateX(${coordX}%) translateY(-${coordY}px)`}}
    >

    </div>
  )
}




export default Calendar;