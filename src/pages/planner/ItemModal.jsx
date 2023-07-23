import { useState, useEffect } from "react";
import closeButton from "../../assets/close-button.svg";
import "../../css/index.css";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { TwitterPicker } from "react-color";
import checkmark from "../../assets/checkmark.svg";
import CreatableSelect, { components } from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiAlertCircle } from "react-icons/fi";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { RxDoubleArrowUp, RxDoubleArrowDown } from "react-icons/rx";
import { BiLoader, BiSolidBellRing } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { PiEqualsBold } from "react-icons/pi";
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
import { firestore } from "../../config/firebase";

export default function ItemModal({
  itemData,
  handleOutsideClick,
  handleClose,
  setItem,
  item,
  setNote,
  note,
  header,
  dateEdited,
  firstInput,
  secondInput,
  priority,
  setPriority,
  progress,
  setProgress,
  itemType,
  setItemType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  const [isFocusedSubject, setIsFocusedSubject] = useState(false);
  const [isFocusedDescription, setIsFocusedDescription] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const { height, width } = useWindowDimensions();
  const [lastChanged, setLastChanged] = useState();
  const [showWarningForDate, setShowWarningForDate] = useState(false);
  const [animate, enableAnimations] = useAutoAnimate();
  const [somethingChanged, setSomethingChanged] = useState(false);

  /* 
  Performs cleanup of state variables
  when modal is closed 
  */
  useEffect(() => {
    //Calculate for the time difference between now and last time edited
    const now = new Date().getTime();
    const past = new Date(dateEdited).getTime();
    if (dateEdited) {
      const timeDifference = now - past;
      const minutesDifference = Math.floor(timeDifference / (1000 * 60));
      const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

      if (minutesDifference < 60) {
        setIsNew(true);
        minutesDifference > 1
          ? setLastChanged(minutesDifference + " mins ago")
          : setLastChanged(minutesDifference + " min ago");
      } else {
        hoursDifference > 1
          ? setLastChanged(hoursDifference + " hours ago")
          : setLastChanged(hoursDifference + " hour ago");
      }
    }

    //Set default values for inputs
    setItemType(itemData.itemType);
    setStartDate(
      startDate ? startDate : new Date(itemData.startDate.seconds * 1000)
    );
    setEndDate(endDate ? endDate : new Date(itemData.endDate.seconds * 1000));
    setPriority(itemData.priority);
    setProgress(itemData.progress);

    return () => {
      setIsFocusedDescription(false);
      setIsFocusedSubject(false);
      setNote("");
      setItem("");
      setStartDate("");
      setEndDate("");
      setPriority("");
      setProgress("");
      setItemType("");
    };
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      startDate.getTime() > endDate.getTime()
        ? setShowWarningForDate(true)
        : setShowWarningForDate(false);
    }
  }, [startDate, endDate]);

  const handleInputChange = (event) => {
    if (
      event.target.value === "task" ||
      event.target.value === "event" ||
      event.target.value === "reminder"
    ) {
      setItemType(event.target.value);
    }
  };

  //CreatableSelect Configs
  const creatableSelectStyle = {
    placeholder: (base) => ({
      ...base,
      color: "rgb(156 163 175 / 1)",
    }),
    control: (base) => ({
      ...base,
      paddingLeft: "0.25rem",
      paddingTop: "0.123rem",
      paddingBottom: "0.123rem",
      border: "2px solid rgb(107 114 128 / 1)",
      "&:hover": {
        border: "2px solid rgb(107 114 128 / 0.5)",
      },
    }),
    option: (base, selectProps) => ({
      ...base,
      backgroundColor:
        selectProps.isFocused && !selectProps.isSelected
          ? "transparent"
          : base.backgroundColor,
      color: selectProps.isSelected ? "white" : base.color,
    }),
    singleValue: (base) => ({
      ...base,
      display: "flex",
      alignItems: "center",
      gap: "0.3rem",
    }),
  };

  const PriorityOptions = [
    {
      value: "urgent",
      label: (
        <div className="flex items-center gap-2">
          <BiSolidBellRing className="text-red-800" />
          Urgent
        </div>
      ),
    },
    {
      value: "important",
      label: (
        <div className="flex items-center gap-2">
          <RxDoubleArrowUp className="text-red-800" />
          Important
        </div>
      ),
    },
    {
      value: "medium",
      label: (
        <div className="flex items-center gap-2">
          <PiEqualsBold className="text-orange-400" />
          Medium
        </div>
      ),
    },
    {
      value: "low",
      label: (
        <div className="flex items-center gap-2">
          <RxDoubleArrowDown className="text-green-800" />
          Low
        </div>
      ),
    },
  ];

  const ProgressOptions = [
    {
      value: "not-started",
      label: (
        <div className="flex items-center gap-2">
          <BsThreeDots className="text-red-800" />
          Not Started
        </div>
      ),
    },
    {
      value: "in-progress",
      label: (
        <div className="flex items-center gap-2">
          <BiLoader className="text-blue-800" />
          In Progress
        </div>
      ),
    },
    {
      value: "completed",
      label: (
        <div className="flex items-center gap-2">
          <AiOutlineCheckCircle className="text-green-800" />
          Completed
        </div>
      ),
    },
  ];

  const handleFormUpdate = async (event) => {
    event.preventDefault();

    //Get the id of the plan via the URL
    const url = window.location.href;
    const parts = url.split("/");
    const id = parts[parts.length - 1];

    const docRef = doc(
      collection(doc(collection(firestore, "Plans"), id), "itemList"),
      itemData.itemId
    );

    console.log(priority);

    //Structure of data to be updated
    const data = {
      dateCreated: serverTimestamp(),
      dateEdited: serverTimestamp(),
      endDate: endDate,
      startDate: startDate,
      itemType: itemType,
      priority: priority,
      progress: progress,
      planId: id,
    };

    //Close modal
    handleClose();

    await updateDoc(docRef, data);
  };

  return (
    <div
      className="absolute right-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div
        className={
          "z-30 flex w-11/12 flex-col gap-2 rounded-xl bg-white " +
          (width > 385 ? "p-10" : "p-7")
        }
      >
        <div className="text-md relative font-medium text-blue-500">
          <span className="line-clamp-2 max-w-[87%] whitespace-pre-wrap">
            <span className="text-black">
              {itemData.itemType.charAt(0).toUpperCase() +
                itemData.itemType.slice(1)}{" "}
              &#x2022;{" "}
            </span>
            {header}{" "}
          </span>
          <div
            className="absolute right-0 top-[0.7rem] cursor-pointer"
            onClick={handleClose}
          >
            <img src={closeButton} alt="close button" className="w-6" />
          </div>
          <div className="flex gap-2 text-black">
            <AiOutlineCheckCircle className="shrink-0 mt-1" />
            <span className="line-clamp-2 whitespace-pre-wrap">{itemData.itemName}</span>
          </div>
          <div className="text-sm font-semibold text-gray-600">
            Last edited {lastChanged} by you
          </div>
        </div>
        <div className="flex flex-col items-center">
          <form
            className="flex w-full flex-col gap-3"
            id="updatePlan"
            onSubmit={(event) => handleFormUpdate(event)}
          >
            <CreatableSelect
              options={PriorityOptions}
              styles={creatableSelectStyle}
              placeholder={
                PriorityOptions.find(
                  (option) => option.value === itemData.priority
                )?.label || ""
              }
              className="font-medium text-gray-700"
              noOptionsMessage={() => null}
              isSearchable={false}
              isValidNewOption={() => false}
              onChange={(e) => {
                setPriority(e.value);
                setSomethingChanged(true);
              }}
            />
            <CreatableSelect
              options={ProgressOptions}
              styles={creatableSelectStyle}
              placeholder={
                ProgressOptions.find(
                  (option) => option.value === itemData.progress
                )?.label || ""
              }
              className="font-medium text-gray-700"
              noOptionsMessage={() => null}
              //components={{ Option: IconOption, SingleValue: IconSelected}}
              isSearchable={false}
              isValidNewOption={() => false}
              onChange={(e) => {
                setProgress(e.value);
                setSomethingChanged(true);
              }}
            />
            <div className="flex gap-2">
              <div className="flex">
                <DatePicker
                  onFocus={(e) => e.target.blur()}
                  placeholderText="Start Date"
                  selected={startDate}
                  dateFormat={width < 350 ? "MM/dd/yy" : "MMM d, yyyy"}
                  onChange={(date) => {
                    setStartDate(date);
                    setSomethingChanged(true);
                  }}
                  className="w-full rounded-[4px] border-2 border-solid border-gray-500 px-3 py-2 font-medium text-gray-800 hover:border-gray-500 hover:border-opacity-50 focus:outline-none"
                  popperPlacement="top-end"
                />
              </div>
              <div className="flex">
                <DatePicker
                  onFocus={(e) => e.target.blur()}
                  placeholderText="End Date"
                  selected={endDate}
                  dateFormat={width < 350 ? "MM/dd/yy" : "MMM d, yyyy"}
                  onChange={(date) => {
                    setEndDate(date);
                    setSomethingChanged(true);
                  }}
                  className="w-full rounded-[4px] border-2 border-solid border-gray-500 px-3 py-2 font-medium text-gray-800 hover:border-gray-500 hover:border-opacity-50 focus:outline-none"
                  popperPlacement="top-end"
                />
              </div>
            </div>
            {showWarningForDate ? (
              <div ref={animate} className="flex flex-col">
                <div
                  className={
                    "flex w-full flex-row items-center justify-center gap-1 rounded-md bg-red-300 px-2 py-2 text-center font-medium " +
                    (width < 400 ? "text-sm" : "")
                  }
                >
                  <FiAlertCircle className="h-[1.15rem] w-[1.15rem]" />
                  End Date must be after Start Date
                </div>
              </div>
            ) : null}
            <div
              className="flex flex-row items-center justify-center gap-1 border-y-2 border-dashed border-y-black border-opacity-50 py-1"
              id="removedRadio"
            >
              <label
                className={
                  "flex-1 grow rounded-md py-1 text-center font-semibold text-gray-400 hover:bg-blue-300 hover:text-white active:bg-blue-600 " +
                  (width > 340 ? " " : "text-sm ") +
                  (itemType === "task" //To make it easy to change background color on select
                    ? " bg-blue-500 text-white hover:bg-blue-500"
                    : "")
                }
              >
                <input
                  type="radio"
                  name="entry"
                  value="task"
                  onChange={(e) => {
                    handleInputChange(e);
                    setSomethingChanged(true);
                  }}
                />
                <span className="select-none">Task</span>
              </label>
              <label
                className={
                  "flex-1 grow rounded-md py-1 text-center font-semibold text-gray-400 hover:bg-blue-300 hover:text-white active:bg-blue-600 active:text-white " +
                  (width > 340 ? "" : "text-sm ") +
                  (itemType === "event" //To make it easy to change background color on select
                    ? "bg-blue-500 text-white hover:bg-blue-500"
                    : "")
                }
              >
                <input
                  type="radio"
                  name="entry"
                  value="event"
                  onChange={(e) => {
                    handleInputChange(e);
                    setSomethingChanged(true);
                  }}
                />
                <span className="select-none">Event</span>
              </label>
              <label
                className={
                  "flex-1 grow rounded-md py-1 text-center font-semibold text-gray-400 hover:bg-blue-300 hover:text-white active:bg-blue-600 " +
                  (width > 340 ? "" : "text-sm ") +
                  (itemType === "reminder" //To make it easy to change background color on select
                    ? "bg-blue-500 text-white hover:bg-blue-500"
                    : "")
                }
              >
                <input
                  type="radio"
                  name="entry"
                  value="reminder"
                  onChange={(e) => {
                    handleInputChange(e);
                    setSomethingChanged(true);
                  }}
                />
                <span className="select-none">Reminder</span>
              </label>
            </div>
          </form>
          <button
            disabled={!somethingChanged}
            type="submit"
            form="updatePlan"
            className="mt-5 w-fit rounded-xl border-solid border-gray-900 bg-blue-500 px-6 py-2 text-white disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
