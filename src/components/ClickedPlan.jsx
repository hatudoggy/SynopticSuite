import { useEffect, useState } from "react";
import returnButton from "../assets/returnButton.svg";
import { useNavigate } from "react-router-dom";
import {
  query,
  doc,
  addDoc,
  setDoc,
  collection,
  updateDoc,
  deleteDoc,
  orderBy,
  onSnapshot,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "../config/firebase";
import pin from "../assets/pinned.svg";
import unpin from "../assets/unpin.svg";
import PlannerCard from "./PlannerCard";
import settings from "../assets/dots-settings.svg";
import TodoModal from "./TodoModal";
import { set } from "date-fns";
import { BsCheckCircle } from "react-icons/bs";
import { BiLoader, BiSolidBellRing } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { PiEqualsBold } from "react-icons/pi";
import { RxDoubleArrowUp, RxDoubleArrowDown } from "react-icons/rx";
import { HiPlus } from "react-icons/hi";
import ItemModal from "./itemModal";
import useWindowDimensions from "./hooks/useWindowDimensions";
import { IoIosArrowDown } from "react-icons/io";

export default function ClickedPlan() {
  /******************************************/
  /* Start of Instantiating State Variables */
  /******************************************/

  //Navigation/Routing
  const navigate = useNavigate();
  const [clickedItem, setClickedItem] = useState();

  //Collection of Data
  const [plan, setPlan] = useState();
  const [scCombination, setScCombination] = useState([]); //Subcollection Combination
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [reminders, setReminders] = useState([]);

  //Checks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemOpen, setIsItemOpen] = useState(false);
  const [isReminder, setIsReminder] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [isTask, setIsTask] = useState(false);
  const [isAll, setIsAll] = useState(true);
  const { width, height} = useWindowDimensions();

  //Form data
  const [item, setItem] = useState("");
  const [note, setNote] = useState("");
  const [priority, setPriority] = useState();
  const [progress, setProgress] = useState();
  const [itemType, setItemType] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  /******************************************/
  /* End of Instantiating State Variables   */
  /******************************************/

  /******************************************/
  /*           Start of UseEffects          */
  /******************************************/

  useEffect(() => {
    // Get the id of the plan via the URL
    const url = window.location.href;
    const parts = url.split("/");
    const id = parts[parts.length - 1];

    // Get the plan from the database
    const dataSnap = query(
      collection(firestore, "Plans"),
      where("planId", "==", id)
    );

    const unsubscribe = onSnapshot(dataSnap, (querySnapshot) => {
      let plan;
      querySnapshot.forEach((doc) => {
        plan = doc.data();
      });
      setPlan(plan);
      console.log(plan);
    });

    // Get the subcollections
    const reminders = query(
      collection(doc(collection(firestore, "Plans"), id), "reminder"),
      orderBy("dateEdited", "desc")
    );

    const remindersOnSnapshot = onSnapshot(reminders, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setReminders(items);
    });

    const events = query(
      collection(doc(collection(firestore, "Plans"), id), "event"),
      orderBy("dateEdited", "desc")
    );

    const eventsOnSnapshot = onSnapshot(events, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setEvents(items);
    });

    const tasks = query(
      collection(doc(collection(firestore, "Plans"), id), "task"),
      orderBy("dateEdited", "desc")
    );

    const tasksOnSnapshot = onSnapshot(tasks, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setTasks(items);
    });

    //To avoid double ups, clean up listeners
    return () => {
      unsubscribe();
      remindersOnSnapshot();
      eventsOnSnapshot();
      tasksOnSnapshot();
    };
  }, []);

  //This is a better way to compiled data from subcollections
  useEffect(() => {
    setScCombination([...reminders, ...events, ...tasks]);
  }, [reminders, events, tasks]);

  /******************************************/
  /*            End of UseEffects           */
  /******************************************/

  /******************************************/
  /*           Start of Functions           */
  /******************************************/

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget && isModalOpen) {
      setIsModalOpen(!isModalOpen);
    }
    if (event.target === event.currentTarget && isItemOpen) {
      setIsItemOpen(!isItemOpen);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Get the id of the plan via the URL
    const url = window.location.href;
    const parts = url.split("/");
    const id = parts[parts.length - 1];

    //Generate and attach the document ID to a variable for later use
    const docRef = doc(
      collection(doc(collection(firestore, "Plans"), id), itemType)
    );

    //Document structure
    const compiledData = {
      itemName: item,
      note: note,
      dateCreated: serverTimestamp(), //new Date(Date.now()).toString()
      dateEdited: serverTimestamp(),
      priority: priority,
      progress: progress,
      startDate: startDate,
      endDate: endDate,
      itemId: docRef.id,
      itemType: itemType,
    };

    //Set data to state. This makes it easier to update data in the future
    //Put this here to make modal close faster
    setIsModalOpen(!isModalOpen);

    //Create document in the database with the generated ID
    await setDoc(docRef, compiledData);
  };

  const handlePin = async (id) => {
    //To avoid unnecessary reads
    if (plan?.isPinned === false) {
      await updateDoc(doc(firestore, "Plans", id), {
        dateEdited: serverTimestamp(),
        isPinned: true,
      });
    }
  };

  const handleUnpin = async (id) => {
    //To avoid unnecessary reads
    if (plan?.isPinned === true) {
      await updateDoc(doc(firestore, "Plans", id), {
        dateEdited: serverTimestamp(),
        isPinned: false,
      });
    }
  };

  const handleDelete = async (id) => {
    navigate(-1);
    await deleteDoc(doc(firestore, "Plans", id));
  };

  const handleSwitchItem = (item) => {
    if (item === "reminders") {
      setIsReminder(true);
      setIsEvent(false);
      setIsTask(false);
      setIsAll(false);
    }

    if (item === "events") {
      setIsReminder(false);
      setIsEvent(true);
      setIsTask(false);
      setIsAll(false);
    }

    if (item === "tasks") {
      setIsReminder(false);
      setIsEvent(false);
      setIsTask(true);
      setIsAll(false);
    }

    if (item === "all") {
      setIsReminder(false);
      setIsEvent(false);
      setIsTask(false);
      setIsAll(true);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-slate-300 px-10 py-10 sm:px-14 sm:py-14">
      {/* MODALS */}
      {isModalOpen ? (
        <TodoModal
          handleOutsideClick={handleOutsideClick}
          handleFormSubmit={handleFormSubmit}
          handleClose={() => setIsModalOpen(!isModalOpen)}
          setItem={setItem}
          item={item}
          setNote={setNote}
          note={note}
          header={plan?.subject}
          dateEdited={plan?.dateEdited?.toDate()?.toLocaleString()} //Passes the date
          firstInput={"Item Name"}
          secondInput={"Note"}
          priority={priority}
          setPriority={setPriority}
          progress={progress}
          setProgress={setProgress}
          itemType={itemType}
          setItemType={setItemType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      ) : null}
      {isItemOpen ? (
        <ItemModal
          itemData={clickedItem}
          handleOutsideClick={handleOutsideClick}
          handleFormSubmit={handleFormSubmit}
          handleClose={() => setIsItemOpen(!isItemOpen)}
          setItem={setItem}
          item={item}
          setNote={setNote}
          note={note}
          header={plan?.subject}
          dateEdited={clickedItem?.dateEdited?.toDate()?.toLocaleString()} //Passes the date
          firstInput={"Item Name"}
          secondInput={"Note"}
          priority={priority}
          setPriority={setPriority}
          progress={progress}
          setProgress={setProgress}
          itemType={itemType}
          setItemType={setItemType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      ) : null}
      <img
        src={returnButton}
        alt=""
        className="invert-to-white w-8 hover:cursor-pointer"
        onClick={() => navigate(-1)}
      />
      <div className="mx-2 flex h-full flex-col gap-7 py-6">
        <PlannerCard
          subject={plan?.subject}
          description={plan?.description}
          color={plan?.color}
          textColor={plan?.textColor}
          pin={pin}
          unpin={unpin}
          isPinned={plan?.isPinned}
          handlePin={handlePin}
          handleUnpin={handleUnpin}
          handleDelete={handleDelete}
          settings={settings}
          id={plan?.planId}
        />
        <div className="flex flex-row justify-between sm:min-w-[375px] lg:max-w-[375px] items-center">
          <div
            className={
              "sm:text-xl font-semibold hover:cursor-pointer " +
              (isAll ? "underline underline-offset-4" : "")
            }
            onClick={() => handleSwitchItem("all")}
          >
            All
          </div>
          {width > 319 ? (
            <>
              <div
                className={
                  "sm:text-xl font-semibold hover:cursor-pointer " +
                  (isTask ? "underline underline-offset-4" : "")
                }
                onClick={() => handleSwitchItem("tasks")}
              >
                Tasks
              </div>
              <div
                className={
                  "sm:text-xl font-semibold hover:cursor-pointer " +
                  (isEvent ? "underline underline-offset-4" : "")
                }
                onClick={() => handleSwitchItem("events")}
              >
                Events
              </div>
              <div
                className={
                  "sm:text-xl font-semibold hover:cursor-pointer " +
                  (isReminder ? "underline underline-offset-4" : "")
                }
                onClick={() => handleSwitchItem("reminders")}
              >
                Reminders
              </div>
            </>
          ) : (
            <div>
              <IoIosArrowDown/>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-3 sm:min-w-[375px]">
            <div
              className="flex items-center gap-1 rounded-md bg-blue-500 px-7 py-5 font-semibold text-white shadow hover:-translate-y-1 hover:cursor-pointer hover:bg-blue-300 hover:text-gray-800 hover:transition-all sm:min-w-[375px] lg:max-w-[375px]"
              onClick={() => setIsModalOpen(!isModalOpen)}
            >
              <HiPlus />
              <div>Add Task</div>
            </div>
          </div>

          {scCombination
            ? isAll
              ? scCombination.map((item, index) => (
                  <ItemCard
                    item={item}
                    index={index}
                    setIsItemOpen={setIsItemOpen}
                    setClickedItem={setClickedItem}
                    isItemOpen={isItemOpen}
                  />
                ))
              : isTask
              ? scCombination
                  .filter((item) => item.itemType === "task")
                  .map((item, index) => (
                    <ItemCard
                      item={item}
                      index={index}
                      setIsItemOpen={setIsItemOpen}
                      setClickedItem={setClickedItem}
                      isItemOpen={isItemOpen}
                    />
                  ))
              : isEvent
              ? scCombination
                  .filter((item) => item.itemType === "event")
                  .map((item, index) => (
                    <ItemCard
                      item={item}
                      index={index}
                      setIsItemOpen={setIsItemOpen}
                      setClickedItem={setClickedItem}
                      isItemOpen={isItemOpen}
                    />
                  ))
              : isReminder
              ? scCombination
                  .filter((item) => item.itemType === "reminder")
                  .map((item, index) => (
                    <ItemCard
                      item={item}
                      index={index}
                      setIsItemOpen={setIsItemOpen}
                      setClickedItem={setClickedItem}
                      isItemOpen={isItemOpen}
                    />
                  ))
              : null
            : null}
        </div>
      </div>
    </div>
  );
}

function ItemCard({ item, index, setIsItemOpen, setClickedItem, isItemOpen }) {
  return (
    <div
      key={index}
      className="relative flex flex-col hover:cursor-pointer"
      onClick={() => {
        setIsItemOpen(!isItemOpen);
        setClickedItem(item);
      }}
    >
      <div className="relative flex flex-row rounded-xl bg-slate-100 p-5 shadow-md sm:min-w-[375px] lg:max-w-[375px]">
        <div className="absolute right-3 top-2 z-10">
          <BsThreeDots className="text-black hover:cursor-pointer" />
        </div>
        <div className="flex flex-col truncate">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex gap-2">
              {/* Progress Icons */}
              {item.progress === "completed" && (
                <BsCheckCircle className="text-green-700" />
              )}
              {item.progress === "in-progress" && (
                <BiLoader className="text-blue-700" />
              )}
              {item.progress === "not-started" && (
                <BsThreeDots className="text-red-700" />
              )}

              {/* Priority Icons */}
              {item.priority === "urgent" && (
                <BiSolidBellRing className="text-red-700" />
              )}
              {item.priority === "important" && (
                <RxDoubleArrowUp className="text-red-700" />
              )}
              {item.priority === "medium" && (
                <PiEqualsBold className="text-orange-400" />
              )}
              {item.priority === "low" && (
                <RxDoubleArrowDown className="text-green-700" />
              )}
            </div>

            {/* Name */}
            <div className="truncate">{item.itemName}</div>
          </div>
          <div className="flex font-semibold">
            {item.endDate.toDate()?.toDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
