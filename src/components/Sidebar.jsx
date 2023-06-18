import calendar from "../assets/calendar.svg";
import resources from "../assets/resources.svg";
import clock from "../assets/clock.svg";
import planner from "../assets/planner.svg";
import analytics from "../assets/analytics.svg";
import addButton from "../assets/add-button.svg";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import logo from "../assets/SuiteLogo.png";
import { useState } from "react";

function Sidebar() {
  const linkList = ["www.google.com", "www.youtube.com", "www.github.com"];

  return (
    <div className="sticky left-0 top-0 hidden h-screen w-36 flex-row self-start sm:flex">
      <div className="flex h-full w-5/12 flex-col items-center gap-8 bg-slate-300 py-6">
        <NewLinks />
        <div className="noScroll my-2 flex h-auto flex-col gap-4 overflow-y-auto">
          {linkList.map((e, key) => {
            return <Link link={e} key={key} />;
          })}
        </div>
      </div>
      <div className="flex h-full w-7/12 flex-col  items-center gap-8 bg-slate-500 py-6">
        <div className="">
          <img src={logo} className="w-12" />
        </div>

        <div className="flex flex-col gap-4 ">
          <Icon image={calendar} text={"Calendar"} link={"/"} />
          <Icon image={resources} text={"Resources"} link={"resources"} />
          <Icon image={clock} text={"Schedule"} link={"schedule"} />
          <Icon image={planner} text={"Planner"} link={"planner/plans"} />
          <Icon image={analytics} text={"Analytics"} link={"analytics"} />
        </div>
      </div>
    </div>
  );
}

function Icon({ image, text, link }) {
  const navigate = useNavigate();
  return (
    <div
      className="group relative flex h-14 w-14 items-center
      justify-center rounded-3xl bg-gray-700 shadow-md
      transition-all hover:cursor-pointer hover:rounded-2xl hover:bg-gray-800"
      onClick={() => {
        navigate(link);
      }}
    >
      <img src={image} alt="calendar" className="w-10" />
      <ToolTip text={text} />
    </div>
  );
}

function ToolTip({ text }) {
  return (
    <span
      className="invisible absolute left-16 z-20 w-auto min-w-max origin-left scale-50 rounded bg-gray-800
    p-1 text-white opacity-0 shadow-md transition group-hover:visible group-hover:block group-hover:scale-100 group-hover:opacity-100"
    >
      {text}
    </span>
  );
}

function Link({ link }) {
  const linkRef =
    "https://s2.googleusercontent.com/s2/favicons?domain=" + link + "&sz=256";
  return (
    <a href={link}>
      <div
        className={
          "group relative flex flex-none items-center justify-center rounded-lg bg-cover bg-center bg-no-repeat transition-all " +
          "h-10 w-10 shadow-md hover:bg-slate-300 hover:opacity-80"
        }
        style={{ backgroundImage: "url(" + linkRef + ")" }}
      ></div>
    </a>
  );
}

function NewLinks() {
  const [modalState, setModalState] = useState(true);

  return (
    <div>
      <LinkModal state={modalState} />
      <div
        className="group relative flex h-12 w-12 flex-none items-center
      justify-center rounded-2xl bg-slate-500 shadow-md
      transition-all hover:cursor-pointer hover:rounded-xl hover:bg-gray-700"
        onClick={() => {
          setModalState(!modalState);
          console.log(modalState);
        }}
      >
        <img src={addButton} alt="calendar" className="w-10" />
        <ToolTip text={"Add New Link"} />
      </div>
    </div>
  );
}

function LinkModal({ state }) {
  return (
    <div
      className={
        state
          ? "hidden opacity-0"
          : "block opacity-100" +
            " absolute z-30 flex translate-x-16 flex-col gap-3 rounded-md bg-gray-300 p-4 shadow-lg transition-all"
      }
    >
      Enter website url:
      <input className="px-2 py-1" type="text" />
      <button
        className="m-auto w-1/2 rounded-md bg-slate-400"
        onClick={() => {}}
      >
        Submit
      </button>
    </div>
  );
}

export default Sidebar;
