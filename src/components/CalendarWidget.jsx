import "../App.css";
import format from "date-fns/format";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isToday,
  parse,
  startOfMonth,
  startOfToday,
  startOfWeek,
  isSameDay,
  isWithinInterval,
  set,
} from "date-fns";
import { useState, useEffect } from "react";
import { firestore } from "../config/firebase";
import {
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  onSnapshot,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

function CalendarWidget() {
  let today = startOfToday();
  let [currMonth, setCurrMonth] = useState(format(today, "MMM-yyyy"));
  let fDayCurr = parse(currMonth, "MMM-yyyy", new Date());

  const [plans, setPlans] = useState([]);
  const [plansId, setPlansId] = useState([]); //This is the id of the plan
  const [itemList, setItemList] = useState([]);
  const [events, setEvents] = useState([]);

  let days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(fDayCurr)),
    end: endOfWeek(endOfMonth(fDayCurr)),
  });

  let days2 = eachDayOfInterval({
    start: startOfWeek(startOfMonth(fDayCurr)),
    end: endOfWeek(add(endOfMonth(fDayCurr), { weeks: 1 })),
  });

  let week = eachDayOfInterval({
    start: startOfWeek(today),
    end: endOfWeek(today),
  });

  console.log(today);

  /******************************************/
  /*          Start of Use Effects          */
  /******************************************/

  useEffect(() => {
    const dataSnap = query(
      collection(firestore, "Plans"),
      orderBy("dateEdited", "desc")
    );

    const plans = [];
    const planId = [];
    const unsubscribe = onSnapshot(dataSnap, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        plans.push(doc.data());
        planId.push(doc.data().planId);
      });
      setPlans(plans);
      setPlansId(planId);

      const items = [];
      const snapshotPromises = planId.map((id) => {
        const itemList = query(
          collection(doc(collection(firestore, "Plans"), id), "itemList"),
          orderBy("dateEdited", "desc")
        );

        const itemListOnSnapshot = onSnapshot(itemList, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            items.push(doc.data());
          });
          setItemList(items);
          let eventStructure = [];
          items.forEach((item) => {
            eventStructure.push({
              startDate: new Date(item.startDate.seconds * 1000),
              endDate: new Date(item.endDate.seconds * 1000),
              title: item.itemName,
            });
          });

          setEvents(eventStructure);
        });

        return Promise.all([itemListOnSnapshot]);
      });

      Promise.all(snapshotPromises).catch((error) => {
        // Handle any errors that occurred
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  console.log(itemList);

  /******************************************/
  /*          End of Use Effects            */
  /******************************************/

  let [window, setWindow] = useState("Month");

  return (
    <div
      className="m-auto flex flex-col rounded-lg shadow-2xl md:w-5/6 lg:w-3/4"
      style={{ height: "40rem" }}
    >
      <Navigation
        fDayCurr={fDayCurr}
        setCurrMonth={setCurrMonth}
        setWindow={setWindow}
      />
      {window == "Month" && (
        <Months day={days} day2={days2} today={fDayCurr} events={events} />
      )}
      {window == "Week" && <Weeks />}
    </div>
  );
}

function Navigation({ fDayCurr, setCurrMonth, setWindow }) {
  function nextMonth() {
    let fDayNext = add(fDayCurr, { months: 1 });
    setCurrMonth(format(fDayNext, "MMM-yyyy"));
  }

  function prevMonth() {
    let fDayPrev = add(fDayCurr, { months: -1 });
    setCurrMonth(format(fDayPrev, "MMM-yyyy"));
  }

  return (
    <div className="flex justify-center gap-5 px-4 pb-4 pt-2 ">
      {/* <div className='flex items-center'>
        <button className='h-11 w-11 bg-green-500 rounded-full'></button>
        <div className='h-7 w-7 bg-green-700 absolute -z-10 translate-x-4'></div>
        <button className='h-7 w-9 bg-green-700'></button>
        <button className='h-7 w-10 bg-green-800 rounded-r-lg'></button>
      </div> */}
      <div className="flex gap-5">
        <button
          className="flex h-7 w-7 justify-center rounded-full hover:bg-zinc-200"
          onClick={prevMonth}
        >
          {"<"}
        </button>
        <div className="text-xl font-semibold">
          {format(fDayCurr, "MMM yyyy")}
        </div>
        <button
          className="flex h-7 w-7 justify-center rounded-full hover:bg-zinc-200"
          onClick={nextMonth}
        >
          {">"}
        </button>
      </div>
      <div className="flex gap-4 [&>button]:h-fit [&>button]:w-20 [&>button]:rounded-md [&>button]:bg-zinc-100 [&>button]:p-2">
        {/* <button className='' onClick={()=>{setWindow('Month')}}>Month</button>
        <button onClick={()=>{setWindow('Week')}}>Week</button> */}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="mb-3 grid w-full grid-cols-7 justify-items-center gap-1 border-b-2 pb-2">
      <div>Sun</div>
      <div>Mon</div>
      <div>Tue</div>
      <div>Wed</div>
      <div>Thu</div>
      <div>Fri</div>
      <div>Sat</div>
    </div>
  );
}

function Months({ day, day2, today, events }) {
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [focusEvent, setFocusEvent] = useState(null);

  return (
    <>
      <Header />
      <div
        className="grid flex-1 auto-rows-fr grid-cols-7 grid-rows-6 "
        // style={{maxHeight:'calc(6*(100px)', gridTemplateRows:'repeat(6,1fr)'}}
      >
        {day.length > 35
          ? day.map((day, dayIx) => {
              return (
                <DateCont
                  day={day}
                  today={today}
                  events={events}
                  hover={hoveredEvent}
                  setHover={setHoveredEvent}
                  focus={focusEvent}
                  setFocus={setFocusEvent}
                  key={day.toString()}
                />
              );
            })
          : day2.map((day, dayIx) => {
              return (
                <>
                  <DateCont
                    dayIx={dayIx}
                    day={day}
                    today={today}
                    events={events}
                    hover={hoveredEvent}
                    setHover={setHoveredEvent}
                    focus={focusEvent}
                    setFocus={setFocusEvent}
                    key={day.toString()}
                  />
                </>
              );
            })}
      </div>
    </>
  );
}

function DateCont({
  dayIx,
  day,
  today,
  events,
  hover,
  setHover,
  focus,
  setFocus,
}) {
  //const [eventCount, setEventCount] = useState(0);
  //const [eventList, setEventList] = useState([]);

  let eventCount = 0;
  let eventList = [];

  return (
    <div className="flex flex-col py-1">
      <button type="button" className="flex justify-center">
        <time dateTime={format(day, "yyyy-MM-dd")}>
          <p
            className={
              "flex h-6 w-6 items-center justify-center rounded-full " +
              (isToday(day)
                ? "bg-red-600 text-white"
                : !isSameMonth(day, today)
                ? "text-slate-300"
                : "text-gray-900")
            }
          >
            {format(day, "d")}
          </p>
        </time>
      </button>
      <div className="flex flex-1 relative flex-col justify-between">
        <div className="grid grid-rows-2 gap-[3px] truncate">
          {events.map((e, i) => {
            if (isWithinInterval(day, { start: e.startDate, end: e.endDate })) {
              if (i < 2) {
                //console.log(e.startDate==e.endDate)
                return (
                  <Event
                    pos={
                      format(e.startDate, "MMM d") == format(e.endDate, "MMM d")
                        ? "same"
                        : isSameDay(day, e.startDate)
                        ? "start"
                        : isSameDay(day, e.endDate)
                        ? "end"
                        : "mid"
                    }
                    key={i}
                    index={i}
                    events={e}
                    hover={hover}
                    setHover={setHover}
                    focus={focus}
                    setFocus={setFocus}
                  />
                );
              } else {
                eventCount = eventCount + 1;
                eventList = [...eventList, e];
              }
            }
          })}
        </div>
        {eventCount > 0 ? (
          <button className="group cursor-default">
            <span className="cursor-pointer text-xs opacity-50">
              {eventCount} more
            </span>
            <MoreEvent day={day} eventList={eventList} />
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

function Sider() {
  return (
    <div className="w-10">
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
  );
}

function Weeks() {
  return (
    <div className="flex flex-col overflow-scroll">
      <div className="flex">
        <div className="w-10"></div>
        <Header />
      </div>
      <div className="flex flex-1 overflow-scroll">
        <Sider />
        <TimeCont />
      </div>
    </div>
  );
}

function TimeCont() {
  return <div className="flex-1">awf</div>;
}

function Event({ index, events, pos, hover, setHover, focus, setFocus }) {
  return (
    <button
      className={
        (pos == "same"
          ? "rounded-lg"
          : pos == "start"
          ? "rounded-l-lg"
          : pos == "end"
          ? "rounded-r-lg"
          : "") +
        " group bg-green-400 px-3 text-left text-xs text-white " +
        (hover == events.title ? "bg-green-600 " : "") +
        (focus == events.title ? "shadow-lg" : "shadow-none")
      }
      style={{ gridRow: (index + 1).toString() + "/2" }}
      onMouseEnter={() => {
        setHover(events.title);
      }}
      onMouseLeave={() => {
        setHover(null);
      }}
      onFocus={() => {
        setFocus(events.title);
      }}
      onBlur={() => {
        setFocus(null);
      }}
    >
      {pos == "start" || pos == "same" ? events.title : "ㅤ"}
      <EventPopup events={events} />
    </button>
  );
}

function EventPopup({ events }) {
  return (
    <div
      className="invisible absolute top-10 z-20 w-56 translate-y-5 rounded border-l-8 border-green-300 bg-white p-6
        text-start 
        text-black opacity-0 shadow-[0_24px_38px_3px_rgba(0,0,0,0.14),0_9px_46px_8px_rgba(0,0,0,0.12),0_11px_15px_-7px_rgba(0,0,0,0.2)] group-focus:visible group-focus:transform-none  group-focus:opacity-100"
      style={{
        transition:
          "visibility 0.1s linear, opacity 0.2s ease-in, transform 0.2s ease-in-out",
      }}
    >
      <p className="text-lg">{events.title}</p>
      <p className=" text-sm opacity-60">
        {format(events.startDate, "MMM d")} - {format(events.endDate, "MMM d")}
      </p>
    </div>
  );
}

function MoreEvent({ day, eventList }) {
  return (
    <div
      className="invisible absolute z-20 w-96 translate-y-5 bg-white 
        p-4
        text-start opacity-0 shadow-[0_24px_38px_3px_rgba(0,0,0,0.14),0_9px_46px_8px_rgba(0,0,0,0.12),0_11px_15px_-7px_rgba(0,0,0,0.2)] group-focus:visible group-focus:transform-none  group-focus:opacity-100"
      style={{
        transition:
          "visibility 0.1s linear, opacity 0.2s ease-in, transform 0.2s ease-in-out",
      }}
    >
      <div className="text-sm opacity-60">
        <span className="text-green-600">{format(day, "iiii")}</span>{" "}
        {format(day, "MMM d")}
      </div>
      <div className="flex flex-col gap-3 p-4">
        {eventList.map((e) => {
          //console.log(e)
          return (
            <div className="flex flex-col">
              <p className="text-lg">{e.title}</p>
              <p className=" text-sm opacity-60">
                {format(e.startDate, "MMM d")} - {format(e.endDate, "MMM d")}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarWidget;
