import '../App.css'
import format from 'date-fns/format';
import {add, eachDayOfInterval, endOfMonth, endOfWeek, isSameMonth, isToday, parse, startOfMonth, startOfToday, startOfWeek, isSameDay, isWithinInterval} from 'date-fns'
import { useState } from 'react';

function CalendarWidget() {
  let today = startOfToday();
  let [currMonth, setCurrMonth] = useState(format(today, 'MMM-yyyy'))
  let fDayCurr = parse(currMonth, 'MMM-yyyy', new Date())


  let days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(fDayCurr)) ,
    end: endOfWeek(endOfMonth(fDayCurr)),
  })

  let events = [
    { startDate: new Date(2023, 5, 12), endDate: new Date(2023, 5, 15), title: "hatdog"},
    { startDate: new Date(2023, 5, 13), endDate: new Date(2023, 5, 14), title: "hatdog"},
    
  ]


  return (
    <div className='flex flex-col w-3/4 m-auto shadow-xl rounded-lg' style={{height: '35rem'}}>
      <Navigation fDayCurr={fDayCurr} setCurrMonth={setCurrMonth}/>
      <Header/>
      <Months day={days} today={fDayCurr} events={events}/>
    </div>
  )
}

function Navigation({fDayCurr, setCurrMonth}){
  function nextMonth(){
    let fDayNext = add(fDayCurr, {months: 1})
    setCurrMonth(format(fDayNext, 'MMM-yyyy'))
  }

  function prevMonth(){
    let fDayPrev = add(fDayCurr, {months: -1})
    setCurrMonth(format(fDayPrev, 'MMM-yyyy'))
  }

  return(
    <div className='flex gap-5 justify-between pb-4'>
      <div className='ml-5 flex items-center'>
        <button className='h-11 w-11 bg-green-500 rounded-full'></button>
        <div className='h-7 w-7 bg-green-700 absolute -z-10 translate-x-4'></div>
        <button className='h-7 w-9 bg-green-700'></button>
        <button className='h-7 w-10 bg-green-800 rounded-r-lg'></button>
      </div>
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
      <div>
        Month
      </div>
    </div>
  )
}

function Header(){

  return(
    <div className='grid grid-cols-7 gap-1 justify-items-center pb-2 mb-3 border-b-2'>
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

function Months({day, today, events}){

  return(
    <div className='grid grid-cols-7 auto-rows-fr flex-auto'>
      {day.map((day, dayIx) => {
        return(
        <div
          key={day.toString()}
          className='flex flex-col gap-1 py-1'
        >
          <button
            type='button'
            className={
              isToday(day)
              ? 'text-red-600'
              : !isSameMonth(day, today)
              ? 'text-slate-300'
              : 'text-gray-900'
            }
          >
            <time dateTime={format(day, 'yyyy-MM-dd')}>
              {format(day, 'd')}
            </time>
          </button>
          {events.map((e, i)=>{
            
            return(isWithinInterval(day, {start: e.startDate, end: e.endDate})? <Event key={i} events={e} pos={isSameDay(day, e.startDate)?'start': isSameDay(day, e.endDate)? 'end':'mid'}/> : '')
          })}
        </div>)
      })}
    </div>
    
  )
}

function Event({events, pos}){

  return(
    <div className={(pos=='start'?'rounded-l-lg': pos=='end'? 'rounded-r-lg':'') + ' bg-green-400 px-3 text-white'}>
      {pos=='start'? events.title: 'ㅤ'}
    </div>
  )
}

export default CalendarWidget
