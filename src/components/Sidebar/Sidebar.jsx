import calendar from "../../assets/calendar.svg";
import resources from "../../assets/resources.svg";
import clock from "../../assets/clock.svg";
import planner from "../../assets/planner.svg";
import analytics from "../../assets/analytics.svg";
import addButton from "../../assets/add-button.svg";
import Navigation from "./Navigation";

function Sidebar() {
  return (
    <div className="flex min-h-full w-16 flex-col sm:w-72">
      <div className="flex h-24 items-center justify-center rounded-tr-2xl bg-primary-logo text-center text-xs font-semibold text-white sm:pb-1.5 sm:text-3xl">
        Synoptic Suite
      </div>
      <div className="flex flex-auto flex-col items-center gap-10 rounded-br-2xl bg-primary px-12 py-7">
        <div className="flex flex-col gap-6">
          <Navigation
            // Don't modify this unless you want to adjust
            // the margin, padding, or the gap between the flex items
            classOfWrapper={"sm:gap-7"}
            image={calendar}
            classOfImage={"sm:w-9 invert-to-white"}
            nameOfNav={"Calendar"}
            classOfNav={"invisible sm:visible"}
          />
          <Navigation
            classOfWrapper={"sm:gap-6"}
            image={resources}
            classOfImage={"sm:w-9 invert-to-white-second"}
            nameOfNav={"Resources"}
            classOfNav={"invisible sm:visible"}
          />
          <Navigation
            classOfWrapper={"sm:gap-7"}
            image={clock}
            classOfImage={"sm:w-9 invert-to-white-second"}
            nameOfNav={"Clock"}
            classOfNav={"invisible sm:visible"}
          />
          <Navigation
            classOfWrapper={"sm:gap-7"}
            image={planner}
            classOfImage={"sm:w-9 invert-to-white-second"}
            nameOfNav={"Planner"}
            classOfNav={"invisible sm:visible"}
          />
          <Navigation
            classOfWrapper={"sm:gap-7"}
            image={analytics}
            classOfImage={"sm:w-9 invert-to-white-second"}
            nameOfNav={"Analytics"}
            classOfNav={"invisible sm:visible"}
          />
        </div>
        <div className="flex flex-auto flex-col gap-4">
          <div className="ml-2 flex flex-row items-center border-t-2 font-sans text-lg text-white opacity-70 sm:w-40 sm:gap-8"></div>
          <Navigation
            classOfWrapper={"sm:gap-3 px-3"}
            image={addButton}
            classOfImage={"sm:w-9 invert-to-white-second"}
            nameOfNav={"Add new link"}
            classOfNav={"invisible sm:visible text-base font-medium"}
          />
          <div className="flex flex-row items-center font-sans text-lg text-white sm:gap-6">
            <ul className="flex list-disc flex-col gap-3 pl-10 font-semibold underline underline-offset-4">
              <li className="marker:text-green-500 hover:cursor-pointer">
                STI Education Services Group
              </li>
              <li className="marker:text-blue-500 hover:cursor-pointer">
                One STI Student Portal
              </li>
            </ul>
          </div>
          <div className="ml-2 flex flex-row items-center border-b-2 font-sans text-lg text-white opacity-70 sm:w-40 sm:gap-8"></div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
