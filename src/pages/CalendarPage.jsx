import '../App.css'
import {Calendar, dayjsLocalizer} from 'react-big-calendar'
import dayjs from 'dayjs'

import "react-big-calendar/lib/css/react-big-calendar.css"
import "./Calendar.css"


const localizer = dayjsLocalizer(dayjs)

function CalendarPage() {
  
  const state = {
    events: [
      {
        start: dayjs().toDate(),
        end: dayjs()
        .add(2, 'hour')
        .toDate(),
        title:"Hatdog"
      }
    ]
  }

  return (
    <div className='w-full h-auto min-h-full  overflow-y-auto'>
      {/* <h1 className='flex h-12 items-center justify-center text-3xl'>Calendar</h1> */}
      <button>hatdog</button>
      <div className='py-2 px-6'>
        <Calendar
          defaultDate={new Date()}
          localizer={localizer}
          defaultView='month'
          events={state.events}
          style={{height: "80vh"}}
        />
      </div>

    </div>

  )
}

export default CalendarPage
