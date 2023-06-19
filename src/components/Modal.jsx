import { useState, useEffect } from "react";
import closeButton from "../assets/close-button.svg";
import "../index.css";
import useWindowDimensions from "./useWindowDimensions";

export default function Modal({
  handleOutsideClick,
  handleFormSubmit,
  handleClose,
  setSubject,
  subject,
  setDescription,
  description,
  header,
  firstInput,
  secondInput,
}) {
  const [isFocusedSubject, setIsFocusedSubject] = useState(false);
  const [isFocusedDescription, setIsFocusedDescription] = useState(false);
  const { height, width } = useWindowDimensions();

  /* 
  Performs cleanup of state variables
  when modal is closed asdasdd
  */

  useEffect(() => {
    return () => {
      setIsFocusedDescription(false);
      setIsFocusedSubject(false);
      setDescription("");
      setSubject("");
    };
  }, []);

  return (
    <div
      className="absolute right-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div
        className={
          "z-30 flex flex-col rounded-xl bg-white md:w-5/12 lg:w-4/12 2xl:w-3/12 " +
          (width > 385 ? "p-10" : "p-7")
        }
      >
        <div className="relative py-2 font-medium text-gray-700 text-2xl">
          {header}
          <div
            className="absolute right-0 top-[0.7rem] cursor-pointer"
            onClick={handleClose}
          >
            <img src={closeButton} alt="" className="w-6" />
          </div>
        </div>
        <div className="flex flex-col items-center py-2">
          <form
            className="flex w-full flex-col gap-3"
            id="createPlan"
            onSubmit={(event) => handleFormSubmit(event)}
          >
            <div className="relative flex flex-col">
              <label
                htmlFor="firstInput"
                className={
                  "absolute left-4 top-8 z-10 font-semibold transition-all " +
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
                className="my-2 mt-6 rounded-[4px] border-2 border-solid border-gray-500 px-3 py-2 focus:outline-none"
                required
                onFocus={() => setIsFocusedSubject(!isFocusedSubject)}
                onBlur={() => setIsFocusedSubject(!isFocusedSubject)}
              />
            </div>
            <div className="relative flex flex-col">
              <label
                htmlFor="secondInput"
                className={
                  "absolute left-4 top-4 z-10 font-semibold text-gray-400 transition-all " +
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
                className="my-2 rounded-[4px] border-2 border-solid border-gray-500 px-3 py-2 focus:outline-none"
                required
                onFocus={() => setIsFocusedDescription(!isFocusedDescription)}
                onBlur={() => setIsFocusedDescription(!isFocusedDescription)}
              />
            </div>
          </form>
          <button
            type="submit"
            form="createPlan"
            disabled={
              !(subject && description) || (subject && description) === ""
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
