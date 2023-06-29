import '../App.css'
import format from 'date-fns/format';
import {add, eachDayOfInterval, endOfMonth, endOfWeek, isSameMonth, isToday, parse, startOfMonth, startOfToday, startOfWeek, isSameDay, isWithinInterval} from 'date-fns'
import { useState, useEffect } from 'react';

function CalendarWidget() {
  let today = startOfToday();
  let [currMonth, setCurrMonth] = useState(format(today, 'MMM-yyyy'))
  let fDayCurr = parse(currMonth, 'MMM-yyyy', new Date())

  
  let days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(fDayCurr)),
    end: endOfWeek(endOfMonth(fDayCurr)),
  })

  let days2 = eachDayOfInterval({
    start: startOfWeek(startOfMonth(fDayCurr)),
    end: endOfWeek(add(endOfMonth(fDayCurr), {weeks: 1})),
  })
  
  let week = eachDayOfInterval({
    start: startOfWeek(today),
    end: endOfWeek(today)
  })

  console.log(today);

  let events = [
    { startDate: new Date(2023, 5, 13), endDate: new Date(2023, 5, 13), title: "hatdog"},
    { startDate: new Date(2023, 5, 12), endDate: new Date(2023, 5, 16), title: "hatdog2"},
    { startDate: new Date(2023, 5, 12), endDate: new Date(2023, 5, 16), title: "hatdog3"},
    { startDate: new Date(2023, 5, 14), endDate: new Date(2023, 5, 15), title: "hatdog3"},
    
    
  ]

  let [window, setWindow] = useState('Month');


  return (
    <div className='flex flex-col md:w-5/6 lg:w-3/4 m-auto shadow-2xl rounded-lg' 
        style={{height: '40rem'}}
    >
      <Navigation fDayCurr={fDayCurr} setCurrMonth={setCurrMonth} setWindow={setWindow}/>
      {window=='Month'&&<Months day={days} day2={days2} today={fDayCurr} events={events}/>}
      {window=='Week'&&<Weeks/>}
    </div>
  )
}

function Navigation({fDayCurr, setCurrMonth, setWindow}){
  function nextMonth(){
    let fDayNext = add(fDayCurr, {months: 1})
    setCurrMonth(format(fDayNext, 'MMM-yyyy'))
  }

  function prevMonth(){
    let fDayPrev = add(fDayCurr, {months: -1})
    setCurrMonth(format(fDayPrev, 'MMM-yyyy'))
  }
  

  return(
    <div className='flex gap-5 justify-center px-4 pt-2 pb-4 '>
      {/* <div className='flex items-center'>
        <button className='h-11 w-11 bg-green-500 rounded-full'></button>
        <div className='h-7 w-7 bg-green-700 absolute -z-10 translate-x-4'></div>
        <button className='h-7 w-9 bg-green-700'></button>
        <button className='h-7 w-10 bg-green-800 rounded-r-lg'></button>
      </div> */}
      <div className='flex gap-5'>
        <button
          className='hover:bg-zinc-200 rounded-full w-7 h-7 flex justify-center'
          onClick={prevMonth}
        >{"<"}</button>
        <div className='text-xl font-semibold'>{format(fDayCurr, 'MMM yyyy')}</div>
        <button
          className='hover:bg-zinc-200 rounded-full w-7 h-7 flex justify-center'
          onClick={nextMonth}
        >{">"}</button>
      </div>
      <div className='flex gap-4 [&>button]:bg-zinc-100 [&>button]:h-fit [&>button]:w-20 [&>button]:p-2 [&>button]:rounded-md'>
        {/* <button className='' onClick={()=>{setWindow('Month')}}>Month</button>
        <button onClick={()=>{setWindow('Week')}}>Week</button> */}
      </div>
    </div>
  )
}

function Header(){

  return(
    <div className='w-full grid grid-cols-7 gap-1 justify-items-center pb-2 mb-3 border-b-2'>
      <div>Sun</div>
      <div>Mon</div>
      <div>Tue</div>
      <div>Wed</div>
      <div>Thu</div>
      <div>Fri</div>
      <div>Sat</div>
    </div>
  )
}

function Months({day, day2, today, events}){
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [focusEvent, setFocusEvent] = useState(null);

  return(
    <>
    <Header/>
      <div className='grid grid-cols-7 grid-rows-6 flex-1 auto-rows-fr '
          // style={{maxHeight:'calc(6*(100px)', gridTemplateRows:'repeat(6,1fr)'}}
      >
        {day.length > 35 ?
        day.map((day, dayIx) => {
          return(
            <DateCont day={day} today={today} events={events} hover={hoveredEvent} setHover={setHoveredEvent} focus={focusEvent} setFocus={setFocusEvent} key={day.toString()}/>
          )
        }):day2.map((day, dayIx) => {
            return(
              <>
              <DateCont dayIx={dayIx} day={day} today={today} events={events} hover={hoveredEvent} setHover={setHoveredEvent} focus={focusEvent} setFocus={setFocusEvent} key={day.toString()}/>
              </>
            )
          })

        }
      </div>
    </>
  )
}

function DateCont({dayIx, day, today, events, hover, setHover, focus, setFocus}){

  //const [eventCount, setEventCount] = useState(0);
  //const [eventList, setEventList] = useState([]);

  let eventCount = 0;
  let eventList = [];

  return(
    <div
          className='flex flex-col py-1'
        >
          <button
            type='button'
            className='flex justify-center'
          >
            <time dateTime={format(day, 'yyyy-MM-dd')}>
              <p
                className={'flex justify-center items-center w-6 h-6 rounded-full '+
                  (isToday(day)
                  ? 'bg-red-600 text-white'
                  : !isSameMonth(day, today)
                  ? 'text-slate-300'
                  : 'text-gray-900')
                }>
                  {format(day, 'd')}
                </p>
            </time>
          </button>
          <div className='flex flex-col flex-1 justify-between'>
            <div className='grid grid-rows-2 gap-[3px]'>
              {events.map((e, i)=>{
                if(isWithinInterval(day, {start: e.startDate, end: e.endDate})){
                  if (i < 2){
                  //console.log(e.startDate==e.endDate)
                  return(
                    <Event pos={(format(e.startDate, 'MMM d')==format(e.endDate, 'MMM d'))?'same':isSameDay(day, e.startDate)?'start': isSameDay(day, e.endDate)? 'end':'mid'}
                      key={i} index={i} events={e} hover={hover} setHover={setHover} focus={focus} setFocus={setFocus}
                      />
                  )
                  } else {
                    eventCount = eventCount + 1;
                    eventList = [...eventList, e];
                  }
                }

              })}
            </div>
            {eventCount > 0 ?

              <button className='group cursor-default'>
                <span className='text-xs opacity-50 cursor-pointer'>{eventCount} more</span>
                <MoreEvent day={day} eventList={eventList}/>
              </button>

            :''}
          </div>
          
          
    </div>
  )
}

function Sider(){

  return(
    <div className='w-10'>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>

    </div>
  )
}

function Weeks(){

  return(
    <div className='flex flex-col overflow-scroll'>
      <div className='flex'>
        <div className='w-10'></div>
        <Header/>
      </div>
      <div className='flex overflow-scroll flex-1'>
        <Sider/>
        <TimeCont/>
      </div>
    </div>
  )
}

function TimeCont(){

  return(
    <div className='flex-1'>
      awf
    </div>
  )
}

function Event({index, events, pos, hover, setHover, focus, setFocus}){

  return(
    <button className={(pos=='same'?'rounded-lg':pos=='start'?'rounded-l-lg': pos=='end'? 'rounded-r-lg':'') + 
      ' bg-green-400 px-3 text-white text-xs text-left relative group ' + (hover == events.title?'bg-green-600 ':'')+ (focus == events.title?'shadow-lg':'shadow-none')}
      style={{gridRow:((index+1).toString()+'/2')}}
      onMouseEnter={()=>{setHover(events.title)}}
      onMouseLeave={()=>{setHover(null)}}
      onFocus={()=>{setFocus(events.title)}}
      onBlur={()=>{setFocus(null)}}
    >
      {pos=='start'||pos=='same'? events.title: 'ㅤ'}
      <EventPopup events={events}/>
    </button>
  )
}

function EventPopup({events}){

  return(
    <div className='absolute top-7 bg-white text-black w-56 p-6 text-start z-20 rounded border-l-8 border-green-300
        shadow-[0_24px_38px_3px_rgba(0,0,0,0.14),0_9px_46px_8px_rgba(0,0,0,0.12),0_11px_15px_-7px_rgba(0,0,0,0.2)] 
        invisible opacity-0 translate-y-5 group-focus:visible group-focus:opacity-100  group-focus:transform-none'
        style={{transition:'visibility 0.1s linear, opacity 0.2s ease-in, transform 0.2s ease-in-out'}}
    >
      <p className='text-lg'>{events.title}</p>
      <p className=' text-sm opacity-60'>{format(events.startDate, 'MMM d')} - {format(events.endDate, 'MMM d')}</p>
    </div>
  )
}

function MoreEvent({day, eventList}){

  return(
    <div className='absolute bg-white w-96 p-4 text-start z-20 
        shadow-[0_24px_38px_3px_rgba(0,0,0,0.14),0_9px_46px_8px_rgba(0,0,0,0.12),0_11px_15px_-7px_rgba(0,0,0,0.2)]
        invisible opacity-0 translate-y-5 group-focus:visible group-focus:opacity-100  group-focus:transform-none'
        style={{transition:'visibility 0.1s linear, opacity 0.2s ease-in, transform 0.2s ease-in-out'}}
    >
      <div className='text-sm opacity-60'>
        <span className='text-green-600'>{format(day, 'iiii')}</span> {format(day, 'MMM d')}
      </div>
      <div className='flex flex-col gap-3 p-4'>
        {eventList.map((e)=>{
          //console.log(e)
          return(
            <div className='flex flex-col'>
              <p className='text-lg'>{e.title}</p>
              <p className=' text-sm opacity-60'>{format(e.startDate, 'MMM d')} - {format(e.endDate, 'MMM d')}</p>
              
            </div>
          )
        
        })}
      </div>
    </div>
  )
}

export default CalendarWidget
