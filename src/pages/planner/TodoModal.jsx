import { useState, useEffect } from "react";
import closeButton from "../../assets/close-button.svg";
import "../../css/index.css";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { TwitterPicker } from "react-color";
import { Timestamp } from "firebase/firestore";
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

export default function TodoModal({
  handleOutsideClick,
  handleFormSubmit,
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
  const { height, width } = useWindowDimensions();
  const [lastChanged, setLastChanged] = useState();
  const [showWarningForDate, setShowWarningForDate] = useState(false);
  const [animate, enableAnimations] = useAutoAnimate();

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
        minutesDifference > 1
          ? setLastChanged(minutesDifference + " mins ago")
          : setLastChanged(minutesDifference + " min ago");
      } else {
        hoursDifference > 1
          ? setLastChanged(hoursDifference + " hours ago")
          : setLastChanged(hoursDifference + " hour ago");
      }
    }

    return () => {
      setIsFocusedDescription(false);
      setIsFocusedSubject(false);
      setNote("");
      setItem("");
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

  return (
    <div
      className="absolute right-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div
        className={
          "z-30 flex w-[95%] flex-col gap-2 rounded-xl bg-white " +
          (width > 385 ? "p-10" : "p-7")
        }
      >
        <div className="text-md relative font-medium text-blue-500">
          <span className="line-clamp-2 whitespace-pre-wrap max-w-[87%]">
            <span className="text-black">New &#x2022; </span>
            {header}
          </span>
          <div
            className="absolute right-0 top-[0.7rem] cursor-pointer"
            onClick={handleClose}
          >
            <img src={closeButton} alt="close button" className="w-6" />
          </div>
          <div className="text-sm font-semibold text-gray-600">
            Last edited {lastChanged} by you
          </div>
        </div>
        {/* <div className="flex items-center">
          <img src={checkmark} className="h-6 w-6" />
          <input
            type="text"
            className="mx-1 w-6/12 px-2 font-semibold focus:outline-gray-700 sm:w-8/12"
            placeholder="New Item"
            required
          />
        </div> */}
        <div className="flex flex-col items-center">
          <form
            className="flex w-full flex-col gap-3"
            id="createPlan"
            onSubmit={(event) => handleFormSubmit(event)}
          >
            <div className="relative flex flex-col">
              <label
                htmlFor="firstInput"
                className={
                  "absolute left-4 top-2 z-10 font-semibold transition-all hover:cursor-text " +
                  (isFocusedSubject || item
                    ? "-translate-x-2 -translate-y-[1.2rem] bg-white text-sm text-gray-900"
                    : "text-gray-400")
                }
              >
                {firstInput}
              </label>
              <input
                type="text"
                id="firstInput"
                onChange={(e) => setItem(e.target.value)}
                // my-2 mt-6
                className="rounded-[4px] border-2 border-solid border-gray-500 px-3 py-2 font-medium text-gray-800 hover:border-gray-500 hover:border-opacity-50 focus:outline-none"
                required
                onFocus={() => setIsFocusedSubject(!isFocusedSubject)}
                onBlur={() => setIsFocusedSubject(!isFocusedSubject)}
              />
            </div>
            <div className="relative flex flex-col">
              {/* mb-4 */}
              <label
                htmlFor="secondInput"
                className={
                  "absolute left-4 top-2 z-10 font-semibold text-gray-400 transition-all hover:cursor-text " +
                  (isFocusedDescription || note
                    ? "-translate-x-2 -translate-y-[1.2rem] bg-white text-sm text-gray-900"
                    : "text-gray-400")
                }
              >
                {secondInput}
              </label>
              <input
                type="text"
                id="secondInput"
                onChange={(e) => setNote(e.target.value)}
                //my-2
                className="rounded-[4px] border-2 border-solid border-gray-500 px-3 py-2 font-medium text-gray-800 hover:border-gray-500 hover:border-opacity-50 focus:outline-none"
                required
                onFocus={() => setIsFocusedDescription(!isFocusedDescription)}
                onBlur={() => setIsFocusedDescription(!isFocusedDescription)}
              />
            </div>
            <CreatableSelect
              options={PriorityOptions}
              styles={creatableSelectStyle}
              placeholder="Priority"
              className="font-medium text-gray-700"
              noOptionsMessage={() => null}
              isSearchable={false}
              isValidNewOption={() => false}
              onChange={(e) => setPriority(e.value)}
            />
            <CreatableSelect
              options={ProgressOptions}
              styles={creatableSelectStyle}
              placeholder="Progress"
              className="font-medium text-gray-700"
              noOptionsMessage={() => null}
              //components={{ Option: IconOption, SingleValue: IconSelected}}
              isSearchable={false}
              isValidNewOption={() => false}
              onChange={(e) => setProgress(e.value)}
            />
            <div className="flex gap-2">
              <div className="flex">
                <DatePicker
                  onFocus={(e) => e.target.blur()}
                  placeholderText="Start Date"
                  selected={startDate}
                  dateFormat={width < 350 ? "MM/dd/yy" : "MMM d, yyyy"}
                  onChange={(date) => setStartDate(date)}
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
                  onChange={(date) => setEndDate(date)}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                />
                <span className="select-none">Reminder</span>
              </label>
            </div>
          </form>
          <button
            type="submit"
            form="createPlan"
            disabled={
              !(
                item &&
                note &&
                priority &&
                progress &&
                itemType &&
                startDate &&
                endDate
              ) ||
              (item &&
                note &&
                priority &&
                progress &&
                itemType &&
                startDate &&
                endDate) === ""
            }
            className="mt-5 w-fit rounded-xl border-solid border-gray-900 bg-blue-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
