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
import { useNavigate } from "react-router-dom";

function Planner() {
  /******************************************/
  /* Start of Instantiating State Variables */
  /******************************************/

  //Navigation/Routing
  const navigate = useNavigate();

  //Detects window dimension
  const { height, width } = useWindowDimensions();

  //Collection of data
  const [pinned, setPinned] = useState([]);
  const [plans, setPlans] = useState(() => {
    const storedPlans = JSON.parse(localStorage.getItem("plans"));
    return storedPlans ? [...storedPlans] : [];
  });

  //Checks for conditional items
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecent, setIsRecent] = useState(true);
  const [isAll, setIsAll] = useState(false);

  //Form data
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [planId, setPlanId] = useState(plans.length);
  const [color, setColor] = useState();

  //Local Storage
  const [items, setItems] = useState();

  /******************************************/
  /* End of Instantiating State Variables   */
  /******************************************/

  /******************************************/
  /*          Start of Use Effects          */
  /******************************************/

  useEffect(() => {
    localStorage.setItem("plans", JSON.stringify(plans));
    console.log(plans);
  }, [plans, pinned]);

  useEffect(() => {
    const storedPlans = JSON.parse(localStorage.getItem("plans"));
    setPlans(storedPlans);
    console.log(storedPlans);
  }, []);

  /******************************************/
  /*          End of Use Effects            */
  /******************************************/

  const adaptingText = (bgColor, lightColor, darkColor) => {
    var color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? darkColor : lightColor;
  };

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
      dateCreated: new Date(Date.now()).toString(),
      color: color.hex,
      textColor: adaptingText(color.hex, "#F9F9F3", "#28282B"),
      isPinned: false,
      id: planId,
    };

    setPlans([...plans, compiledData]);
    setPlanId(planId + 1);
    setIsModalOpen(!isModalOpen);
  };

  function handlePin(id) {
    const filteredPin = plans.filter((plan) => plan.id === id);
    filteredPin[0].isPinned = true;
    console.log(plans);
    if (pinned.find((item) => item.id === id)) return;
    //To avoid the Array(n) in the console
    setPinned([...pinned, ...filteredPin]);
  }

  function handleUnpin(id) {
    //Convert back isPinned to false
    const filteredPin = plans.filter((plan) => plan.id === id);
    filteredPin[0].isPinned = false;

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
          color={color}
          setColor={setColor}
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
          <div
            className="shadow-black-500/40 rounded-3xl bg-gray-700 px-4 py-2 text-lg font-semibold text-white shadow-lg shadow-slate-400/100 hover:cursor-pointer"
            onClick={() => navigate("/planner/plans")}
          >
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
              (plans.find((plan) => plan.isPinned === true) ? "mx-2" : "")
            }
          >
            {/* Checks for pinned items */}
            {plans.find((plan) => plan.isPinned === true) ? (
              plans
                .filter((plan) => plan.isPinned === true)
                .map((item, index) => (
                  <PlannerCard
                    key={item.id}
                    subject={item.subject}
                    description={item.description}
                    color={item.color}
                    textColor={item.textColor}
                    pin={pin}
                    unpin={unpin}
                    isPinned={item.isPinned}
                    handlePin={handlePin}
                    handleUnpin={handleUnpin}
                    settings={settings}
                    id={item.id}
                    link={`/planner/plans/pinned/${item.id}`}
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
            <div
              className={
                "px-2 text-lg font-semibold hover:cursor-pointer hover:underline hover:underline-offset-4 " +
                (isRecent ? "underline decoration-2 underline-offset-4" : "")
              }
              onClick={() => {
                setIsRecent(true);
                setIsAll(false);
              }}
            >
              Recent
            </div>
            <div
              className={
                "text-lg font-semibold hover:cursor-pointer hover:underline hover:underline-offset-4 " +
                (isAll ? "underline decoration-2 underline-offset-4" : "")
              }
              onClick={() => {
                setIsRecent(false);
                setIsAll(true);
              }}
            >
              All
            </div>
          </div>
          <div className="mx-2 flex flex-col gap-3 sm:flex-wrap lg:flex-row">
            {/* Card */}
            {plans /* Checks if plans exists */
              ? isRecent /* Checks if recent is active or clicked */
                ? plans
                    .sort(
                      (a, b) =>
                        new Date(b.dateCreated) - new Date(a.dateCreated)
                    )
                    .slice(
                      0,
                      3
                    ) /* Part that determines the number of cards present */
                    .map((plan, index) => (
                      <PlannerCard
                        key={plan.id}
                        subject={plan.subject}
                        description={plan.description}
                        color={plan.color}
                        textColor={plan.textColor}
                        pin={pin}
                        unpin={unpin}
                        isPinned={plan.isPinned}
                        handlePin={handlePin}
                        handleUnpin={handleUnpin}
                        settings={settings}
                        id={plan.id}
                        link={`/planner/plans/${plan.id}`}
                      />
                    ))
                : plans /* Checks if all is active or clicked */
                    .sort(
                      (a, b) =>
                        new Date(b.dateCreated) - new Date(a.dateCreated)
                    )
                    .map((plan, index) => (
                      <PlannerCard
                        key={plan.id}
                        subject={plan.subject}
                        description={plan.description}
                        color={plan.color}
                        textColor={plan.textColor}
                        pin={pin}
                        unpin={unpin}
                        isPinned={plan.isPinned}
                        handlePin={handlePin}
                        handleUnpin={handleUnpin}
                        settings={settings}
                        id={plan.id}
                        link={`/planner/plans/${plan.id}`}
                      />
                    ))
              : null}{" "}
            {/* Returns if plan is empty */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Planner;
