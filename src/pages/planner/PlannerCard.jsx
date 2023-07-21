import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import useClickClose from "../../hooks/useClickClose";
import { BsArrowRightShort } from "react-icons/bs";
import useWindowDimensions from "../../hooks/useWindowDimensions";

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
  setLink,
  hasOpenPrompt,
  setIsChosen,
}) {
  const navigate = useNavigate();
  const [isSettingsActive, setIsSettingsActive] = useState(false);
  const { width } = useWindowDimensions();
  const parentRef = useRef(null);
  const childRef = useRef(null);
  useClickClose(childRef, parentRef, () => setIsSettingsActive(false));

  return (
    <div
      className={
        "group/pc relative flex h-min flex-none flex-row truncate rounded-xl bg-slate-100 p-5 shadow-md hover:cursor-pointer lg:flex-[0_1_48%] 2xl:flex-[0_1_32%] "
      }
      onClick={() => {
        setLink(link);
        setIsChosen(true);
      }}
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
      ) : null}
      {hasOpenPrompt ? (
        <div className="text absolute bottom-2 right-5 flex translate-x-6 items-center gap-1 text-transparent transition-all group-hover/pc:translate-x-0 group-hover/pc:text-gray-600">
          <p className="font-semibold">Open</p>
          <BsArrowRightShort className="mt-1 h-5 w-5" />
        </div>
      ) : null}
    </div>
  );
}
