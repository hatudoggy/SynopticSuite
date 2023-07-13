import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import useClickClose from "../../hooks/useClickClose";
import { BsArrowRightShort } from "react-icons/bs";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { RiArrowDropDownLine } from "react-icons/ri";
import ItemCards from "./ItemCards";

export default function PlannerCard({
  subject,
  description,
  color,
  textColor,
  pin,
  unpin,
  isPinned,
  handlePin,
  handleUnpin,
  handleDelete,
  settings,
  id,
  link,
  hasOpenPrompt,
}) {
  //Navigation
  const navigate = useNavigate();

  //Checks
  const [isSettingsActive, setIsSettingsActive] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  //Responsiveness
  const { width } = useWindowDimensions();

  //Dropdowns
  const parentRef = useRef(null);
  const childRef = useRef(null);

  //Click outside to close dropdown
  useClickClose(childRef, parentRef, () => setIsSettingsActive(false));
  useClickClose(childRef, parentRef, () => setIsDropdownOpen(false));

  return (
    <div className="flex flex-col rounded-xl bg-white h-fit shadow">
      <div
        className={
          "group/pc relative flex w-full flex-row truncate rounded-xl bg-white p-5 shadow-md " +
          (link ? "hover:cursor-pointer " : "")
        }
        onClick={link ? () => navigate(link) : null}
      >
        <div
          className="flex items-center rounded-md p-5 font-bold"
          style={{
            backgroundColor: color ? color : "",
            color: textColor ? textColor : "",
          }}
        >
          MP
        </div>
        <div className="mx-5 truncate">
          <div className="max-w-[10ch] truncate font-semibold sm:text-lg min-[720px]:max-w-[30ch]">
            {subject}
          </div>
          <div className="sm:text-md truncate text-xs font-medium">
            {description}
          </div>
        </div>
        <div className="absolute right-4 top-2 flex flex-col-reverse gap-2 sm:flex-row">
          {isPinned ? (
            <img
              src={unpin}
              className="w-5 hover:cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleUnpin(id);
              }}
            />
          ) : (
            <img
              src={pin}
              className="w-5 hover:cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handlePin(id);
              }}
            />
          )}
          {handleDelete ? (
            <img
              ref={parentRef}
              src={settings}
              className="relative w-5 hover:cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsSettingsActive(!isSettingsActive);
              }}
            />
          ) : null}
        </div>
        {isSettingsActive ? (
          <Settings childRef={childRef} handleDelete={handleDelete} id={id} />
        ) : null}
        {hasOpenPrompt ? (
          <div className="text absolute bottom-2 right-5 flex translate-x-6 items-center gap-1 text-transparent transition-all group-hover/pc:translate-x-0 group-hover/pc:text-gray-600">
            <p className="font-semibold">Open</p>
            <BsArrowRightShort className="mt-1 h-5 w-5" />
          </div>
        ) : null}
      </div>
      <div className="relative flex w-full items-center text-center font-semibold text-black">
        <div className="ml-5 px-2 py-3 underline underline-offset-4">All</div>
        <div
          className="cursor-pointer"
          ref={parentRef}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <RiArrowDropDownLine className="h-6 w-6" />
        </div>
        {isDropdownOpen ? <DropDownSelection childRef={childRef} /> : null}
        <div className="text-sm items-center ml-auto mr-5 my-2 justify-center rounded-lg bg-blue-500 px-3 py-1 font-semibold text-white transition-all hover:-translate-y-1 hover:cursor-pointer hover:bg-blue-300 hover:text-black">
          + Add Items
        </div>
      </div>
      <ItemCards id={id} />
    </div>
  );
}

function DropDownSelection({ childRef }) {
  return (
    <div
      ref={childRef}
      className="absolute left-14 top-10 z-10 flex flex-col rounded-xl bg-slate-300 text-black"
    >
      <div className="cursor-pointer border-b border-gray-400 p-2 hover:rounded-t-xl hover:bg-slate-600 hover:text-white">
        Tasks
      </div>
      <div className="cursor-pointer border-b border-gray-400 p-2 hover:bg-slate-600 hover:text-white">
        Events
      </div>
      <div className="flex cursor-pointer items-center justify-center p-2 hover:rounded-b-xl hover:bg-slate-600 hover:text-white">
        Reminders
      </div>
    </div>
  );
}

function Settings({ childRef, handleDelete, id }) {
  return (
    <div
      ref={childRef}
      className="absolute right-4 top-10 z-10 flex flex-col rounded-md bg-slate-300 text-center text-sm font-medium"
      id="settings"
    >
      <div
        className="border-b border-black border-opacity-30 px-5 py-[0.35rem] hover:cursor-pointer hover:rounded-t-md hover:bg-slate-500 hover:text-white"
        onClick={(e) => {
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
        }}
      >
        Edit
      </div>
    </div>
  );
}
