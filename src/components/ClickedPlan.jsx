import { useEffect, useState, useRef } from "react";
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
  limit,
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
import { AiOutlineReload } from "react-icons/ai";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import useClickClose from "./hooks/useClickClose";
import PlannerCardLoad from "./loaders/PlannerCardLoad";

export default function ClickedPlan() {
  /******************************************/
  /* Start of Instantiating State Variables */
  /******************************************/

  //useRef
  const scrollTo = useRef(null);

  //Navigation/Routing
  const navigate = useNavigate();
  const [clickedItem, setClickedItem] = useState();

  //Collection of Data
  const [plan, setPlan] = useState();
  const [itemList, setItemList] = useState([]); //Subcollection Combination
  const [loadMore, setLoadMore] = useState(5);

  //Checks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemOpen, setIsItemOpen] = useState(false);
  const [isReminder, setIsReminder] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [isTask, setIsTask] = useState(false);
  const [isAll, setIsAll] = useState(true);
  const { width, height } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(false);

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

    // Get the subcollection
    const itemList = query(
      collection(doc(collection(firestore, "Plans"), id), "itemList"),
      orderBy("dateEdited", "desc"),
      limit(loadMore)
    );

    const itemListOnSnapshot = onSnapshot(itemList, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setItemList(items);
    });

    return () => {
      unsubscribe();
      itemListOnSnapshot();
    };
  }, [loadMore]);

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
      collection(doc(collection(firestore, "Plans"), id), "itemList")
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
    setItem("");
    setNote("");
    setPriority("");
    setProgress("");
    setStartDate("");
    setEndDate("");
    setItemType("");
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

  const handleLoadMore = () => {
    setLoadMore(loadMore + 5);
    setIsLoading(true);
    setTimeout(() => {
      scrollTo?.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
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
    <div className="flex h-full w-full flex-row gap-10 bg-slate-300 px-10 py-10 sm:px-14 sm:py-14">
      <div
        className={
          "flex h-full flex-col bg-slate-300 w-full" 
        }
      >
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
          {plan ? (
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
          ) : (
            <PlannerCardLoad/>
          )}
          
          <div className="flex flex-row items-center justify-between sm:min-w-[375px] lg:max-w-[375px]">
            <div
              className={
                "font-semibold hover:cursor-pointer hover:underline hover:underline-offset-4 sm:text-xl " +
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
                    "font-semibold hover:cursor-pointer hover:underline hover:underline-offset-4 sm:text-xl " +
                    (isTask ? "underline underline-offset-4" : "")
                  }
                  onClick={() => handleSwitchItem("tasks")}
                >
                  Tasks
                </div>
                <div
                  className={
                    "font-semibold hover:cursor-pointer hover:underline hover:underline-offset-4 sm:text-xl " +
                    (isEvent ? "underline underline-offset-4" : "")
                  }
                  onClick={() => handleSwitchItem("events")}
                >
                  Events
                </div>
                <div
                  className={
                    "font-semibold hover:cursor-pointer hover:underline hover:underline-offset-4 sm:text-xl " +
                    (isReminder ? "underline underline-offset-4" : "")
                  }
                  onClick={() => handleSwitchItem("reminders")}
                >
                  Reminders
                </div>
              </>
            ) : (
              <div>
                <IoIosArrowDown />
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
                <div>Add Item</div>
              </div>
            </div>

            {/* Checks if Tasks, Events, or Reminders is clicked 
              then displays corresponding data */}
            {itemList
              ? isAll
                ? itemList.map((item, index) => (
                    <ItemCard
                      key={index}
                      item={item}
                      index={index}
                      setIsItemOpen={setIsItemOpen}
                      setClickedItem={setClickedItem}
                      isItemOpen={isItemOpen}
                    />
                  ))
                : isTask
                ? itemList
                    .filter((item) => item.itemType === "task")
                    .map((item, index) => (
                      <ItemCard
                        key={index}
                        item={item}
                        index={index}
                        setIsItemOpen={setIsItemOpen}
                        setClickedItem={setClickedItem}
                        isItemOpen={isItemOpen}
                      />
                    ))
                : isEvent
                ? itemList
                    .filter((item) => item.itemType === "event")
                    .map((item, index) => (
                      <ItemCard
                        key={index}
                        item={item}
                        index={index}
                        setIsItemOpen={setIsItemOpen}
                        setClickedItem={setClickedItem}
                        isItemOpen={isItemOpen}
                      />
                    ))
                : isReminder
                ? itemList
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
          <div
            className="flex items-center justify-center gap-3 pr-3 font-semibold hover:cursor-pointer lg:max-w-[375px]"
            onClick={() => handleLoadMore()}
            ref={scrollTo}
          >
            {isLoading ? (
              <Stack sx={{ color: "grey.900" }} spacing={2} direction="row">
                <CircularProgress color="inherit" size={15} />
              </Stack>
            ) : (
              <AiOutlineReload />
            )}

            <span>Load More</span>
          </div>
        </div>
      </div>
      {/* <CardContent itemData={clickedItem} width={width} /> */}
    </div>
  );
}

function CardContent({ itemData, width }) {
  return (
    <>
      {width > 1026 ? (
        <div className="h-full w-full rounded-2xl bg-slate-100 p-5 shadow">
          <div className="flex flex-col gap-5 text-xl font-semibold">
            <div className="flex gap-3 items-center">
              <ProgressIcons progress={itemData?.progress} />
              {itemData?.itemName}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function ItemCard({ item, index, setIsItemOpen, setClickedItem, isItemOpen }) {
  //State for settings
  const [isSettingsActive, setIsSettingsActive] = useState(false);
  const parentRef = useRef(null);
  const childRef = useRef(null);
  useClickClose(childRef, parentRef, () => {
    setIsSettingsActive(false);
  });

  return (
    <div key={index} className="relative flex flex-col">
      <div
        className="relative flex flex-row rounded-xl bg-slate-100 p-5 shadow-md hover:cursor-pointer sm:min-w-[375px] lg:max-w-[375px]"
        onClick={() => {
          setIsItemOpen(!isItemOpen);
          setClickedItem(item);
        }}
      >
        <div
          className="absolute right-3 top-2 z-10"
          ref={parentRef}
          onClick={(e) => {
            e.stopPropagation();
            setIsSettingsActive(!isSettingsActive);
          }}
        >
          <BsThreeDots className="relative text-black hover:cursor-pointer" />
          {isSettingsActive ? (
            <div
              ref={childRef}
              className="absolute right-1 top-4 z-10 flex flex-col rounded-md bg-slate-300 text-center text-sm font-medium"
              id="settings"
            >
              <div
                className="border-b border-black border-opacity-30 px-5 py-[0.35rem] hover:cursor-pointer hover:rounded-t-md hover:bg-slate-500 hover:text-white"
                onClick={(e) => {
                  if (e.target !== e.currentTarget) {
                    setIsSettingsActive(!isSettingsActive);
                  }
                  e.stopPropagation();
                  handleDelete(id);
                }}
              >
                Delete
              </div>
              <div
                className="py-[0.35rem] pr-[0.1rem] hover:cursor-pointer hover:rounded-b-md hover:bg-slate-500 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsItemOpen(!isItemOpen);
                }}
              >
                Edit
              </div>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col truncate">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex gap-2">
              <ProgressIcons progress={item.progress} />
              <PriorityIcons priority={item.priority} />
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

function ProgressIcons({ progress }) {
  return (
    <>
      {/* Progress Icons */}
      {progress === "completed" && <BsCheckCircle className="text-green-700" />}
      {progress === "in-progress" && <BiLoader className="text-blue-700" />}
      {progress === "not-started" && <BsThreeDots className="text-red-700" />}
    </>
  );
}

function PriorityIcons({ priority }) {
  return (
    <>
      {/* Priority Icons */}
      {priority === "urgent" && <BiSolidBellRing className="text-red-700" />}
      {priority === "important" && <RxDoubleArrowUp className="text-red-700" />}
      {priority === "medium" && <PiEqualsBold className="text-orange-400" />}
      {priority === "low" && <RxDoubleArrowDown className="text-green-700" />}
    </>
  );
}
