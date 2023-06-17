import "../App.css";
import returnButton from "../assets/returnButton.svg";
import { useState } from "react";
import pin from "../assets/pinned.svg";
import settings from "../assets/dots-settings.svg";

function Planner() {
  const [pinned, setPinned] = useState([]);

  return (
    <div className="flex h-full w-full flex-col bg-slate-300 px-10 py-10">
      {/* <div className="invert-to-white mb-4 w-fit hover:cursor-pointer hover:fill-black hover:shadow-lg hover:invert-0">
        <img src={returnButton} alt="" className="w-8" />
      </div> */}
      <div className="flex h-full w-full flex-col gap-5">
        <div className="flex flex-row items-center gap-5">
          <div className="shadow-black-500/40 rounded-3xl bg-gray-700 px-4 py-2 text-lg font-semibold text-white shadow-lg shadow-slate-400/100 hover:cursor-pointer">
            Plans
          </div>
          <div className="rounded-3xl bg-slate-200 px-4 py-2 text-lg font-semibold text-gray-600 hover:cursor-pointer hover:bg-gray-700 hover:text-white hover:shadow-xl hover:shadow-slate-400/100">
            Notes
          </div>
        </div>
        <div className="flex w-full flex-col gap-5">
          <div>
            <div className="px-2 text-lg font-semibold">Pinned</div>
          </div>

          {/* Checks for pinned items */}
          {pinned.length > 0 ? (
            <div className="mx-2 w-fit rounded-xl bg-gray-400">
              <div className="px-20 py-14 font-semibold">Pinned</div>
            </div>
          ) : (
            <div className="mx-2 flex justify-center rounded-xl bg-slate-100 sm:w-fit">
              <div className="py-10 font-semibold sm:px-32 sm:py-14">
                No Pinned Items
              </div>
            </div>
          )}

          <div className="flex flex-row gap-12">
            <div className="px-2 text-lg font-semibold underline underline-offset-4">
              Recent
            </div>
            <div className="text-lg font-semibold">All</div>
          </div>
          <div className="mx-2 flex flex-col gap-3 lg:flex-row">
            <div className="relative flex flex-row rounded-xl bg-slate-100 p-5 shadow-md">
              <div className="flex items-center rounded-md bg-violet-400 p-5 font-bold text-white">
                MP
              </div>
              <div className="mx-5 truncate">
                <div className="truncate font-semibold sm:text-lg">
                  My Plans for 2024
                </div>
                <div className="sm:text-md truncate text-xs font-medium">
                  My Plans for 2024
                </div>
              </div>
              <div className="lg:mx-10"></div>
              <div className="absolute right-4 top-2 flex flex-col-reverse gap-2 sm:flex-row">
                <img src={pin} alt="" className="w-5 hover:cursor-pointer" />
                <img
                  src={settings}
                  alt=""
                  className="w-5 hover:cursor-pointer"
                />
              </div>
            </div>
            <div className="relative flex flex-row rounded-xl bg-slate-100 p-5 shadow-md">
              <div className="flex items-center rounded-md bg-blue-400 p-5 font-bold text-white">
                MP
              </div>
              <div className="mx-5 truncate">
                <div className="truncate font-semibold sm:text-lg">
                  My Plans for 2023
                </div>
                <div className="sm:text-md truncate text-xs font-medium">
                  My Plans for 2023
                </div>
              </div>
              <div className="lg:mx-10"></div>
              <div className="absolute right-4 top-2 flex flex-col-reverse gap-2 sm:flex-row">
                <img src={pin} alt="" className="w-5 hover:cursor-pointer" />
                <img
                  src={settings}
                  alt=""
                  className="w-5 hover:cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Planner;
