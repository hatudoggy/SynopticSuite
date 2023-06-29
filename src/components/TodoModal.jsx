import { useState, useEffect } from "react";
import closeButton from "../assets/close-button.svg";
import "../index.css";
import useWindowDimensions from "./useWindowDimensions";
import { TwitterPicker } from "react-color";
import { Timestamp } from "firebase/firestore";
import checkmark from "../assets/checkmark.svg";
import CreatableSelect from "react-select";

export default function TodoModal({
  handleOutsideClick,
  handleFormSubmit,
  handleClose,
  setSubject,
  subject,
  setDescription,
  description,
  header,
  dateEdited,
  firstInput,
  secondInput,
  color,
  setColor,
}) {
  const [isFocusedSubject, setIsFocusedSubject] = useState(false);
  const [isFocusedDescription, setIsFocusedDescription] = useState(false);
  const { height, width } = useWindowDimensions();
  const [lastChanged, setLastChanged] = useState();
  const [selectedEntry, setSelectedEntry] = useState();

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
      setDescription("");
      setSubject("");
      setColor("");
    };
  }, []);

  const handleInputChange = (event) => {
    if (
      event.target.value === "task" ||
      event.target.value === "event" ||
      event.target.value === "reminder"
    ) {
      setSelectedEntry(event.target.value);
    }
  };

  console.log(selectedEntry);

  //CreatableSelect Configs
  const creatableSelectStyle = {
    placeholder: (base) => ({
      ...base,
      color: "rgb(156 163 175 / 1)",
    }),
    control: (base) => ({
      ...base,
      paddingLeft: "0.25rem",
      border: "2px solid rgb(107 114 128 / 1)",
    }),
    option: (base, selectProps) => ({
      ...base,
      backgroundColor:
        selectProps.isFocused && !selectProps.isSelected
          ? "transparent"
          : base.backgroundColor,
    }),
  };

  const creatableSelectOptions = [
    { value: "urgent", label: "Urgent" },
    { value: "important", label: "Important" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  return (
    <div
      className="absolute right-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div
        className={
          "z-30 flex w-11/12 flex-col gap-2 rounded-xl bg-white sm:w-7/12 md:w-5/12 lg:w-4/12 2xl:w-3/12 " +
          (width > 385 ? "p-10" : "p-7")
        }
      >
        <div className="text-md relative font-medium text-blue-500">
          {header} <span className="text-black">&#x2022; New</span>
          <div
            className="absolute right-0 top-[0.7rem] cursor-pointer"
            onClick={handleClose}
          >
            <img src={closeButton} alt="close button" className="w-6" />
          </div>
        </div>
        <div className="flex items-center">
          <img src={checkmark} className="h-6 w-6" />
          <input
            type="text"
            className="mx-1 w-6/12 px-2 font-semibold focus:outline-gray-700 sm:w-8/12"
            placeholder="New Item"
            required
          />
        </div>
        <div className="text-sm font-semibold text-gray-600">
          Last edited {lastChanged} by you
        </div>
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
                  (isFocusedSubject || subject
                    ? "-translate-x-2 -translate-y-[1.2rem] bg-white text-sm text-gray-900"
                    : "text-gray-400")
                }
              >
                {firstInput}
              </label>
              <input
                type="text"
                id="firstInput"
                onChange={(e) => setSubject(e.target.value)}
                // my-2 mt-6
                className="rounded-[4px] border-2 border-solid border-gray-500 px-3 py-2 focus:outline-none"
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
                  (isFocusedDescription || description
                    ? "-translate-x-2 -translate-y-[1.2rem] bg-white text-sm text-gray-900"
                    : "text-gray-400")
                }
              >
                {secondInput}
              </label>
              <input
                type="text"
                id="secondInput"
                onChange={(e) => setDescription(e.target.value)}
                //my-2
                className="rounded-[4px] border-2 border-solid border-gray-500 px-3 py-2 focus:outline-none"
                required
                onFocus={() => setIsFocusedDescription(!isFocusedDescription)}
                onBlur={() => setIsFocusedDescription(!isFocusedDescription)}
              />
            </div>
            <CreatableSelect
              options={creatableSelectOptions}
              styles={creatableSelectStyle}
              placeholder="Priority"
              className="font-medium text-gray-700"
              noOptionsMessage={() => null}
              isSearchable={false}
              isValidNewOption={() => false}
            />
            <div
              className="flex flex-row items-center justify-center gap-1"
              id="removedRadio"
            >
              <label
                className={
                  "flex-1 grow rounded-md border-2 border-gray-600 py-1 text-center font-semibold text-gray-400 " +
                  (width > 340 ? " " : "text-sm ") +
                  (selectedEntry === "task" //To make it easy to change background color on select
                    ? "border-blue-500 bg-blue-500 text-white"
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
                  "flex-1 grow rounded-md border-2 border-gray-600 py-1 text-center font-semibold text-gray-400 " +
                  (width > 340 ? "" : "text-sm ") +
                  (selectedEntry === "event" //To make it easy to change background color on select
                    ? "border-blue-500 bg-blue-500 text-white"
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
                  "flex-1 grow rounded-md border-2 border-gray-600 py-1 text-center font-semibold text-gray-400 " +
                  (width > 340 ? "" : "text-sm ") +
                  (selectedEntry === "reminder" //To make it easy to change background color on select
                    ? "border-blue-500 bg-blue-500 text-white"
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
            <div className="remove-scrollbar">
              <TwitterPicker
                color={color}
                onChange={(e) => setColor(e)}
                width={"100%"}
                triangle="hide"
              />
            </div>
          </form>
          <button
            type="submit"
            form="createPlan"
            disabled={
              !(subject && description) ||
              (subject && description) === "" ||
              !color
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
