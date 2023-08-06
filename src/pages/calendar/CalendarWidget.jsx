import "../../css/App.css";
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
  intervalToDuration,
  addDays,
  isAfter,
  isBefore,
  sub,
  subDays,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import { useState, useEffect, useContext, useRef } from "react";
import { firestore } from "../../config/firebase";
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
import { useNavigate } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import { useAuth } from "../../hooks/AuthContext";
import { WindowContext } from ".";
import {usePosRelativeScreen} from '../../hooks/usePosRelativeScreen'

function CalendarWidget() {
  let today = startOfToday();
  let [currMonth, setCurrMonth] = useState(format(today, "MMM-yyyy"));
  let [currWeek, setCurrWeek] = useState(format(today, "dd-MMM-yyyy"));
  let fDayCurr = parse(currMonth, "MMM-yyyy", new Date());
  let fWeekCurr = parse(currWeek, "dd-MMM-yyyy", new Date());
  

  //Collection of data
  const [plans, setPlans] = useState([]);
  const [plansId, setPlansId] = useState([]); //This is the id of the plan
  const [itemList, setItemList] = useState([]);
  const [events, setEvents] = useState([]);

  const { authUser } = useAuth();

  let days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(fDayCurr)),
    end: endOfWeek(endOfMonth(fDayCurr)),
  });

  let days2 = eachDayOfInterval({
    start: startOfWeek(startOfMonth(fDayCurr)),
    end: endOfWeek(add(endOfMonth(fDayCurr), { weeks: 1 })),
  });

  let week = eachDayOfInterval({
    start: startOfWeek(fWeekCurr),
    end: endOfWeek(fWeekCurr),
  });


  const convertDurationToDays = (duration) => {
    const { years = 0, months = 0, days = 0 } = duration;
    const totalDays = years * 365 + months * 30 + days;
    return totalDays;
  };

  //console.log(today);

  /******************************************/
  /*          Start of Use Effects          */
  /******************************************/

  useEffect(() => {
    const dataSnap = query(
      collection(firestore, "Plans"),
      orderBy("dateEdited", "desc"),
      where("uid", "==", authUser.uid)
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
            let interval = intervalToDuration({
              start: item.startDate.toDate(),
              end: item.endDate.toDate(),
            });
            eventStructure.push({
              startDate: new Date(item.startDate.seconds * 1000),
              endDate: new Date(item.endDate.seconds * 1000),
              title: item.itemName,
              progress: item.progress,
              interval: convertDurationToDays(interval),
              id: item.planId,
            });
          });
          let sortedEvent = eventStructure.slice(0);

          setEvents(
            sortedEvent.sort((a, b) => {
              return b.interval - a.interval;
            })
          );
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

  //console.log(events);

  /******************************************/
  /*          End of Use Effects            */
  /******************************************/

  let [window, setWindow] = useState("Month");

  return (
    <div
      className="m-auto flex flex-col rounded-lg shadow-2xl py-1 h-full md:h-[96%] w-full md:w-5/6 lg:w-4/4"
      //style={{ height: "41rem" }}
    >
      <Navigation
        fDayCurr={fDayCurr}
        setCurrMonth={setCurrMonth}
        fWeekCurr={fWeekCurr}
        setCurrWeek={setCurrWeek}
        window={window}
        setWindow={setWindow}
      />
      {window == "Month" && (
        <Months day={days} day2={days2}  today={fDayCurr} events={events} />
      )}
      {window == "Week" && <Weeks week={week} />}
    </div>
  );
}

function Navigation({ fDayCurr, setCurrMonth, fWeekCurr, setCurrWeek, window, setWindow }) {
  function nextMonth() {
    if(window == "Month"){
      let fDayNext = add(fDayCurr, { months: 1 });
      setCurrMonth(format(fDayNext, "MMM-yyyy"));
    } else if(window == "Week"){
      let fWeekNext = add(fWeekCurr, { weeks: 1 });
      setCurrWeek(format(fWeekNext, "dd-MMM-yyyy"));
    }

  }

  function prevMonth() {
    if(window == "Month"){
    let fDayPrev = add(fDayCurr, { months: -1 });
      setCurrMonth(format(fDayPrev, "MMM-yyyy"));
    } else if(window == "Week"){
      let fWeekPrev = add(fWeekCurr, { weeks: -1 });
      setCurrWeek(format(fWeekPrev, "dd-MMM-yyyy"));
    }
  }

  return (
    <div className="flex justify-between gap-5 px-8 pb-4 pt-4 ">
      <AddBtnCont/>
      <div className="flex gap-5">
        <button
          className="flex h-7 w-7 justify-center rounded-full hover:bg-zinc-200"
          onClick={prevMonth}
        >
          {"<"}
        </button>
        <div className="text-xl font-semibold flex flex-col text-center">
          {window=="Month"?
            <p>{format(fDayCurr, "MMM")}</p>:
            window=="Week"?
              <p>{format(fWeekCurr, "MMM")}</p>:
              null
          }
          <p className="text-xs opacity-60">{format(fDayCurr, "yyyy")}</p>
        </div>
        <button
          className="flex h-7 w-7 justify-center rounded-full hover:bg-zinc-200"
          onClick={nextMonth}
        >
          {">"}
        </button>
      </div>
      <ViewsBtnCont setWindow={setWindow}/>
    </div>
  );
}

function AddBtnCont (){

  return(
    <div className='flex items-center'>
      <button className='h-11 w-11 bg-green-500 rounded-full'></button>
      <div className='h-7 w-7 bg-green-700 absolute -z-10 translate-x-4'></div>
      <button className='h-7 w-9 bg-green-700'></button>
      <button className='h-7 w-10 bg-green-800 rounded-r-lg'></button>
    </div>
  )
}

function ViewsBtnCont({setWindow}){

  return(
    <div className="flex gap-4 [&>button]:h-fit [&>button]:w-20 [&>button]:rounded-md [&>button]:bg-zinc-100 [&>button]:p-2">
      <button className='' onClick={()=>{setWindow('Month')}}>Month</button>
      <button onClick={()=>{setWindow('Week')}}>Week</button>
    </div>
  )
}

function Header({week}) {
  const weekLabel = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  return (
    <div className="w-full grid grid-cols-7 gap-1 border-b-2 pb-2">
      {
        weekLabel.map((day, ix)=>{
          return(
            <div className="text-center w-full box-border " key={ix}>
              <p>{day}</p>
              <p>{week?format(week[ix],"dd"):null}</p>
            </div>
          )
        })
      }
    </div>
  );
}

function Months({ day, day2, today, events }) {
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [focusEvent, setFocusEvent] = useState(null);

  let pos = ["", "", []];

  return (
    <div className="flex flex-col flex-1 px-3 pb-3">
      <Header />
      <div
        className="grid flex-1 auto-rows-fr grid-cols-7 grid-rows-6"
        // style={{maxHeight:'calc(6*(100px)', gridTemplateRows:'repeat(6,1fr)'}}
      >

        {(day.length > 35 ? day:day2).map((day, dayIx) => {
          
          return (
            <DateCont
              dayIx={dayIx}
              day={day}
              today={today}
              events={events.filter((e) =>
                isWithinInterval(day, {
                  start: e.startDate,
                  end: e.endDate,
                })
              )}
              hover={hoveredEvent}
              setHover={setHoveredEvent}
              focus={focusEvent}
              setFocus={setFocusEvent}
              posAll={pos}
              key={(day.toString()+dayIx)}
            />
          );
        })}
      </div>
    </div>
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
  posAll,
}) {
  //const [eventCount, setEventCount] = useState(0);
  //const [eventList, setEventList] = useState([]);

  let eventCount = 0;
  let eventList = [];

  function checkPos(events, pos) {

    let stack = events.slice(0);
    if(dayIx===0 && stack.length !== 0){
      //If there are events that has no start date
      pos[0] = stack[0];
      pos[1] = stack[1];
      stack.forEach((e) => {
        if(!isSameDay(day, e.startDate) && e!==pos[0] && e!==pos[1] ){
          pos[2].push(e);
        }
      });
    }

    if (isBefore(pos[0].endDate, day)) {
      pos[0] = "";
    }
    if (pos[0] !== "") {
      stack = stack.filter((i) => i != pos[0]);
    } else if (
      stack.length !== 0 &&
      stack.some((e) => isSameDay(day, e.startDate))
    ) {
      pos[0] = stack.find((e) => isSameDay(day, e.startDate));
      stack = stack.filter((i) => i != pos[0]);
    } else {
      stack = stack.filter((i) => i != pos[0]);
    }

    if (isBefore(pos[1].endDate, day)) {
      pos[1] = "";
    }
    if (pos[1] !== "") {
      stack = stack.filter((i) => i != pos[1]);
    } else if (
      stack.length !== 0 &&
      stack.some((e) => isSameDay(day, e.startDate))
    ) {
      pos[1] = stack.find((e) => isSameDay(day, e.startDate));
      stack = stack.filter((i) => i != pos[1]);
    } else {
      stack = stack.filter((i) => i != pos[1]);
    }

    //console.log(stack);
    pos[2].forEach((e) => {
      if (isBefore(e.endDate, day)) {
        pos[2] = pos[2].filter((i) => i != e);
      }
    });
    stack.forEach((e) => {
      if (isSameDay(day, e.startDate)  || (pos[0] !== "" && pos[1] !== "")) {
        pos[2].push(e);
      }
      stack = stack.filter((i) => i != e);
    });

  }
  const btnRef = useRef();
  //console.log('Day'+format(day, 'd'));
  checkPos(events, posAll);
  //console.log('pos1: '+(posAll[0].title?posAll[0].title:' '), 'pos2: '+(posAll[1].title?posAll[1].title:' '));
  //console.log((posAll[2]));
  return (
    <div className="flex flex-col py-1 relative ">
      <button type="button" className="flex justify-center">
        <time dateTime={format(day, "yyyy-MM-dd")}>
          <p
            className={
              "flex h-6 w-6 items-center justify-center rounded-full " +
              (!isSameMonth(day, today)
                ? "text-slate-300"
                : "text-gray-900")
            }
          >
            {format(day, "d")}
          </p>
        </time>
      </button>
      <div className="relative flex flex-1 flex-col justify-between">
        <div className="grid grid-rows-2 gap-[1px] truncate">
          {events.map((e, i) => {
            //console.log(e);
            if (!posAll[2].includes(e)) {
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
                  index={
                    posAll[0].title == e.title
                      ? 1
                      : posAll[1].title == e.title
                      ? 2
                      : ""
                  }
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
          })}
        </div>
        {eventCount > 0 ? (
          <button ref={btnRef} className="group cursor-default">
            <span className="cursor-pointer rounded-2xl bg-slate-200 p-[3px] text-xs opacity-50">
              +{eventCount}
            </span>
            <MoreEvent btnRef={btnRef} day={day} eventList={eventList} />
          </button>
        ) : (
          ""
        )}
      </div>
      <div className={"w-full h-full absolute border-[1px] opacity-50 -z-10 "+
          (isToday(day)
          ? "bg-slate-300"
          : "")
          }></div>
    </div>
  );
}

function Sider() {
  const time = eachHourOfInterval({
    start: startOfDay(new Date()),
    end: endOfDay(new Date())
  }).map((d)=>{
    return d.getHours().toString().padStart(2, '0') + ':00';
  })
  //console.log(time);
  return (
    <div className="w-14 text-center">
      {
        time.map((t, ix)=>{
          return(
            <div className="h-12" key={ix}>
              {t}
            </div>
          )
        })
      }
    </div>
  );
}

function Weeks({week}) {
  return (
    <div className="flex flex-col px-3 pb-3">
      <div className="flex overflow-scroll">
        <div className="w-14"></div>
        <Header week={week}/>
      </div>
      <div className="max-h-[35rem] overflow-scroll">
        <div className="flex">
          <Sider />
          <TimeCont />
        </div>
      </div>
    </div>
  );
}


function TimeCont() {
  const eventTest = [
    {date: {start:"Mon", end:"Mon"}, time: {start:"6", end:"7"}, title:"Test1"}
  ];
  
  const week = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  return (
    <div className=" flex-1 grid grid-cols-7 justify-center ">
      {
        week.map((day, index)=>{
          return(
            <div className=" relative text-center w-full box-border border-l-2
              bg-[linear-gradient(to_bottom,#E5E7EB,#E5E7EB_2px,#ffffff_2px,#ffffff)] bg-[center_top_0.7rem] bg-[length:100%_3rem]">
                {eventTest.map((e)=>{
                  if(e.date.start == day){
                    return <EventTest date={e.date} time={e.time} title={e.title}/>
                  }
                })}
            </div>
          )
        })
      }
    </div>
  );
}

function EventTest({date, time, title}){

  return(
    <div className="absolute w-full bg-red-300 min-h-[1.5rem]" 
      style={{top:((time.start*3)+0.7)+"rem",
      height:((time.end - time.start)*3)+"rem"}}>
      {title}
    </div>
  )
}


function Event({ index, events, pos, hover, setHover, focus, setFocus }) {
  const btnRef = useRef();

  

  const color = {
    "not-started": { bg: ["bg-red-500", "bg-red-600"], bd: "border-red-500" },
    "in-progress": {
      bg: ["bg-blue-500", "bg-blue-600"],
      bd: "border-blue-500",
    },
    completed: { bg: ["bg-green-500", "bg-green-600"], bd: "border-green-500" },
  };
  return (
    <button 
      ref={btnRef}
      className={
        (pos == "same"
          ? "rounded-md"
          : pos == "start"
          ? " rounded-l-md"
          : pos == "end"
          ? "w-[97%] rounded-r-md"
          : "") +
        " group px-3 text-left text-xs text-white w-full " +
        (hover == events.title
          ? color[events.progress].bg[1]
          : color[events.progress].bg[0]) +
        (focus == events.title ? " shadow-lg" : " shadow-none")
      }
      style={{ gridRow: index.toString() + "/2" }}
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
      <EventPopup events={events} color={color} refs={btnRef}/>
    </button>
  );
}

function EventPopup({ events, color, refs}) {
  //Navigation
  const winRef = useContext(WindowContext);
  const popRef = useRef();
  const navigate = useNavigate();
  const [x, y] = usePosRelativeScreen(popRef, refs, winRef);
  return (
    <div
      ref={popRef}
      className={
        "group/card truncate invisible absolute z-20 w-80 translate-y-5 m-5 rounded border-l-8 hover:bg-gray-200 " +
        color[events.progress].bd +
        " bg-white p-6 " +
        "text-start text-black opacity-0 " +
        "shadow-[0_24px_38px_3px_rgba(0,0,0,0.14),0_9px_46px_8px_rgba(0,0,0,0.12),0_11px_15px_-7px_rgba(0,0,0,0.2)] group-focus:visible group-focus:transform-none group-focus:opacity-100"
      }
      style={{
        transition:
          "visibility 0.1s linear, opacity 0.2s ease-in, transform 0.2s ease-in-out",
        transform: 
          `translateX(${x}%) translateY(-${y}px)`
      }}
      onClick={() => navigate(`/planner/${events.id}`)}
    >
      <div className="relative">
        <p className="text-lg truncate">{events.title}</p>
        <p className=" text-sm opacity-60">
          {format(events.startDate, "MMM d")} -{" "}
          {format(events.endDate, "MMM d")}
        </p>
        <p className="absolute -bottom-3 -right-3 flex translate-x-5 items-center gap-1 font-semibold text-transparent transition-all group-hover/card:translate-x-0 group-hover/card:text-black">
          Open <BsArrowRightShort className="mt-1 h-4 w-4" />
        </p>
      </div>
    </div>
  );
}

function MoreEvent({ day, eventList, btnRef }) {
  //Navigation
  const navigate = useNavigate();
  const winRef = useContext(WindowContext);
  const popRef = useRef();
  const [x, y] = usePosRelativeScreen(popRef, btnRef, winRef);
  return (
    <div
      ref={popRef}
      className="invisible absolute z-20 w-96 overflow-clip translate-y-5 m-5 rounded-md bg-white p-4
        text-start opacity-0 shadow-[0_24px_38px_3px_rgba(0,0,0,0.14),0_9px_46px_8px_rgba(0,0,0,0.12),0_11px_15px_-7px_rgba(0,0,0,0.2)] group-focus:visible group-focus:transform-none  group-focus:opacity-100"
      style={{
        transition:
          "visibility 0.1s linear, opacity 0.2s ease-in, transform 0.2s ease-in-out",
          transform: 
          `translateX(${x}%) translateY(-${y}px)`
      }}
    >
      <div className="text-sm opacity-60">
        <span className="text-green-600">{format(day, "iiii")}</span>{" "}
        {format(day, "MMM d")}
      </div>
      <div className="flex flex-col gap-1 p-2 w-full max-h-[20rem]overflow-auto">
        {eventList.map((e, i) => {
          //console.log(e)
          return (
            <div
              className="hover:cursor-pointer group/more relative flex flex-col rounded-md p-2 hover:bg-gray-300"
              key={i}
              onClick={() => navigate(`/planner/${e.id}`)}
            >
              <p className="text-lg">{e.title}</p>
              <p className=" text-sm opacity-60">
                {format(e.startDate, "MMM d")} - {format(e.endDate, "MMM d")}
              </p>
              <p className="absolute bottom-1 right-1 flex translate-x-2 items-center gap-1 font-semibold text-transparent transition-all group-hover/more:translate-x-0 group-hover/more:text-black">
                Open <BsArrowRightShort className="mt-1 h-5 w-5" />
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarWidget;
