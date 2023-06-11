import calendar from "../assets/calendar.svg";
import resources from "../assets/resources.svg";
import clock from "../assets/clock.svg";
import planner from "../assets/planner.svg";
import analytics from "../assets/analytics.svg";
import addButton from "../assets/add-button.svg";
import Navigation from "./Navigation";

function Sidebar() {
  return (
    <div className="flex h-full max-h-full w-16 flex-col sm:w-72">
      <div className="flex h-12 items-center justify-center bg-primary-logo text-center text-xs font-semibold text-white sm:pb-1.5 sm:text-3xl">
        Synoptic Suite
      </div>
      <div className="flex flex-1 flex-col items-center gap-5 bg-primary sm:px-12 py-7 md:gap-7 lg:gap-10">
        <div className="flex flex-col items-center sm:items-start gap-7 sm:gap-3 md:gap-4 lg:gap-6 sm:w-full w-5/6">
            <Navigation
              // Don't modify this unless you want to adjust
              // the margin, padding, or the gap between the flex items
              classOfWrapper={"sm:gap-7"}
              image={calendar}
              nameOfNav={"Calendar"}
              classOfNav={"hidden sm:block"}
              link={"/"}
            />
            <Navigation
              classOfWrapper={"sm:gap-6"}
              image={resources}
              nameOfNav={"Resources"}
              classOfNav={"hidden sm:block"}
              link={"resources"}
            />
            <Navigation
              classOfWrapper={"sm:gap-7"}
              image={clock}
              nameOfNav={"Schedule"}
              classOfNav={"hidden sm:block"}
              link={"schedule"}
            />
            <Navigation
              classOfWrapper={"sm:gap-7"}
              image={planner}
              nameOfNav={"Planner"}
              classOfNav={"hidden sm:block"}
              link={"planner"}
            />
            <Navigation
              classOfWrapper={"sm:gap-7"}
              image={analytics}
              nameOfNav={"Analytics"}
              classOfNav={"hidden sm:block"}
              link={"analytics"}
            />
        </div>
        <div className="flex flex-auto flex-col gap-2 md:gap-4 lg:gap-6">
          <div className="ml-2 hidden flex-row items-center border-t-2 font-sans text-lg text-white opacity-70 sm:flex sm:w-40 sm:gap-8"></div>
          <Navigation
            classOfWrapper={"sm:gap-3 px-3 hidden"}
            image={addButton}
            nameOfNav={"Add new link"}
            classOfNav={"hidden sm:block text-base font-medium"}
          />
          <div className="flex flex-row items-center font-sans text-lg text-white sm:gap-6">
            <ul className="flex list-disc flex-col gap-3 pl-10 font-semibold underline underline-offset-4">
              <NewLinks
                bulletColor={"marker:text-green-500"}
                linkName={"STI Education Services Group"}
              />
              <NewLinks
                bulletColor={"marker:text-blue-500"}
                linkName={"One STI Student Portal"}
              />
            </ul>
          </div>
          <div className="ml-2 hidden flex-row items-center border-b-2 font-sans text-lg text-white opacity-70 sm:flex sm:w-40 sm:gap-8"></div>
        </div>
      </div>
    </div>
  );
}

function NewLinks({ linkName, bulletColor }) {
  return (
    <li
      className={
        "sm:list-item hidden hover:cursor-pointer " +
        (bulletColor ? bulletColor : "")
      }
    >
      {linkName}
    </li>
  );
}

export default Sidebar;
