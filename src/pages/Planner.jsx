import "../App.css";
import returnButton from "../assets/returnButton.svg";
import { useEffect, useState } from "react";
import pin from "../assets/pinned.svg";
import unpin from "../assets/unpin.svg";
import settings from "../assets/dots-settings.svg";
import addButton from "../assets/add-button-no-circle.svg";
import useWindowDimensions from "../components/useWindowDimensions";
import PlannerCard from "../components/PlannerCard";
import Modal from "../components/Modal";

function Planner() {
  const { height, width } = useWindowDimensions();
  const [pinned, setPinned] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [plans, setPlans] = useState([]);
  const [planId, setPlanId] = useState(0);

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      setIsModalOpen(!isModalOpen);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const compiledData = {
      subject: subject,
      description: description,
      isPinned: false,
      id: planId,
    };

    setPlans([...plans, compiledData]);
    setPlanId(planId + 1);
    setIsModalOpen(!isModalOpen);
  };

  function handlePin(id) {
    const filteredPin = plans.filter((plan) => plan.id === id);

    if (pinned.find((item) => item.id === id)) return;

    //To avoid the Array(n) in the console
    setPinned([...pinned, ...filteredPin]);
  }

  function handleUnpin(id) {
    setPinned([...pinned.filter((plan) => plan.id !== id)]);
  }

  return (
    <div className="flex h-full w-full flex-col bg-slate-300 px-10 py-10">
      {/* <div className="invert-to-white mb-4 w-fit hover:cursor-pointer hover:fill-black hover:shadow-lg hover:invert-0">
        <img src={returnButton} alt="" className="w-8" />
      </div> */}
      {isModalOpen ? (
        <Modal
          handleOutsideClick={handleOutsideClick}
          handleFormSubmit={handleFormSubmit}
          handleClose={() => setIsModalOpen(!isModalOpen)}
          setSubject={setSubject}
          subject={subject}
          setDescription={setDescription}
          description={description}
          header={"Create Plan"}
          firstInput={"Title"}
          secondInput={"Description"}
        />
      ) : null}
      <div
        className="text-md absolute bottom-10 right-10 z-10 flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 py-5 font-semibold text-white shadow-lg shadow-slate-400/100 hover:cursor-pointer"
        onClick={() => setIsModalOpen(!isModalOpen)}
      >
        <img src={addButton} alt="add" className="w-6 sm:w-8" />
        <div
          className={
            "pr-2 sm:pr-4 sm:text-lg " + (width < 300 ? "hidden" : "inherit")
          }
        >
          Compose
        </div>
      </div>
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
          <div
            className={
              "flex flex-col gap-3 sm:flex-wrap lg:flex-row " +
              (pinned.length > 0 ? "mx-2" : "")
            }
          >
            {/* Checks for pinned items */}
            {pinned.length > 0 ? (
              pinned.map((item, index) => (
                <PlannerCard
                  key={item.id}
                  subject={item.subject}
                  description={item.description}
                  pin={unpin}
                  handlePin={handleUnpin}
                  settings={settings}
                  id={item.id}
                />
              ))
            ) : (
              <div className="mx-2 flex justify-center rounded-xl bg-slate-100">
                <div className="py-10 font-semibold sm:px-32 sm:py-10">
                  No Pinned Items
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-row gap-12">
            <div className="px-2 text-lg font-semibold underline underline-offset-4">
              Recent
            </div>
            <div className="text-lg font-semibold">All</div>
          </div>
          <div className="mx-2 flex flex-col gap-3 sm:flex-wrap lg:flex-row">
            {/* Card */}
            {plans
              ? plans.map((plan, index) => (
                  <PlannerCard
                    key={plan.id}
                    subject={plan.subject}
                    description={plan.description}
                    pin={pin}
                    handlePin={handlePin}
                    settings={settings}
                    id={plan.id}
                  />
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Planner;
