import calendar from "../assets/calendar.svg";
import resources from "../assets/resources.svg";
import clock from "../assets/clock.svg";
import planner from "../assets/planner.svg";
import analytics from "../assets/analytics.svg";
import addButton from '../assets/add-button.svg';

function Sidebar() {
  return (
    <div className="flex flex-col w-16 sm:w-72 min-h-full">
      <div className="flex sm:pb-1.5 bg-primary-logo text-white h-24 justify-center items-center font-semibold text-xs text-center sm:text-3xl rounded-tr-2xl">
        Synoptic Suite
      </div>
      <div className="flex flex-col bg-primary flex-auto items-center py-7 gap-10 px-12 rounded-br-2xl">
        <div className="mr-6 flex flex-col items-center gap-10">
          <div className="flex flex-row items-center text-lg font-sans text-white sm:gap-8">
            <img src={calendar} alt="calendar" className="sm:w-9 logo-img" />
            <p className="invisible sm:visible">Calender</p>
          </div>
          <div className="flex flex-row items-center text-lg font-sans text-white sm:gap-8">
            <img
              src={resources}
              alt="calendar"
              className="sm:w-9 sm:ml-2 invert-to-white"
            />
            <p className="invisible sm:visible">Resources</p>
          </div>
          <div className="flex flex-row items-center text-lg font-sans text-white sm:gap-8">
            <img
              src={clock}
              alt="calendar"
              className="sm:w-9 invert-to-white"
            />
            <p className="sm:mr-6 invisible sm:visible">Clock</p>
          </div>
          <div className="flex flex-row items-center text-lg font-sans text-white sm:gap-8">
            <img
              src={planner}
              alt="calendar"
              className="sm:w-9 invert-to-white"
            />
            <p className="sm:mr-2 invisible sm:visible">Planner</p>
          </div>
          <div className="flex flex-row items-center text-lg font-sans text-white sm:gap-8">
            <img
              src={analytics}
              alt="calendar"
              className="sm:w-9 invert-to-white"
            />
            <p className="invisible sm:visible">Analytics</p>
          </div>
        </div>
        <div className="mr-4 flex flex-col flex-auto items-center gap-4">
          <div className="flex flex-row items-center text-lg font-sans text-white sm:gap-8 opacity-70 border-t-2 sm:w-40">

          </div>
          <div className="flex flex-row items-center text-lg font-sans text-white sm:gap-3 mr-1">
            <img
              src={addButton}
              alt="calendar"
              className="sm:w-9 invert-to-white"
            />
            <p className="invisible sm:visible text-base font-medium">Add new link</p>
          </div>
            <div className="flex flex-row items-center text-lg font-sans text-white sm:gap-6">
            <ul className="list-disc pl-10 underline underline-offset-4 font-semibold flex flex-col gap-3">
                <li className="marker:text-green-500">
                    STI Education Services Group
                </li>
                <li className="marker:text-blue-500">
                    One STI Student Portal
                </li>
            </ul>
          </div>
          <div className="flex flex-row items-center text-lg font-sans text-white sm:gap-8 sm:w-40 opacity-70 border-b-2">
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
