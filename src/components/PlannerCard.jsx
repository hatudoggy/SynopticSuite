import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import useClickClose from "./hooks/useClickClose";

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
}) {
  const navigate = useNavigate();
  const [isSettingsActive, setIsSettingsActive] = useState(false);
  const parentRef = useRef(null);
  const childRef = useRef(null);
  useClickClose(childRef, parentRef, () => setIsSettingsActive(false));

  return (
    <div
      className={
        "relative flex flex-row rounded-xl bg-slate-100 p-5 shadow-md sm:min-w-[375px] lg:max-w-[375px] " +
        (link ? "hover:cursor-pointer" : "")
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
        <div className="truncate font-semibold sm:text-lg">{subject}</div>
        <div className="sm:text-md truncate text-xs font-medium">
          {description}
        </div>
      </div>
      <div className="lg:mx-10"></div>
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
    </div>
  );
}
