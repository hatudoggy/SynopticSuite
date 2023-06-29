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
import { firestore } from "../config/firebase";
import {
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  onSnapshot,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

function Planner() {
  /******************************************/
  /* Start of Instantiating State Variables */
  /******************************************/

  //Navigation/Routing
  const navigate = useNavigate();

  //Detects window dimension
  const { height, width } = useWindowDimensions();

  //Collection of data
  const [plans, setPlans] = useState([]);

  //Checks for conditional items
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecent, setIsRecent] = useState(true);
  const [isAll, setIsAll] = useState(false);

  //Form data
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [planId, setPlanId] = useState(0);
  const [color, setColor] = useState();

  /******************************************/
  /* End of Instantiating State Variables   */
  /******************************************/

  /******************************************/
  /*          Start of Use Effects          */
  /******************************************/

  //This useEffect fetches the data from the database and stores it in the state variable "plans"
  useEffect(() => {
    const dataSnap = query(
      collection(firestore, "Plans"),
      orderBy("dateEdited", "desc")
    );

    //This function sets all the necessary data from the database to all the state variables
    const unsubscribe = onSnapshot(dataSnap, (querySnapshot) => {
      const plans = [];
      querySnapshot.forEach((doc) => {
        plans.push(doc.data());
      });
      setPlans(plans);
      setPlanId(plans.length);
    });
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

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    //Generate and attach the document ID to a variable for later use
    const docRef = doc(collection(firestore, "Plans"));

    //Document structure
    const compiledData = {
      subject: subject,
      description: description,
      dateCreated: serverTimestamp(), //new Date(Date.now()).toString()
      dateEdited: serverTimestamp(),
      color: color.hex,
      textColor: adaptingText(color.hex, "#F9F9F3", "#28282B"),
      isPinned: false,
      planId: docRef.id,
    };

    //Set data to state. This makes it easier to update data in the future
    //Put this here to make modal close faster
    setPlans([...plans, compiledData]);
    setPlanId(planId + 1);
    setIsModalOpen(!isModalOpen);

    //Create document in the database with the generated ID
    await setDoc(docRef, compiledData);
  };

  async function handlePin(id) {
    //Search for the plan with the same ID as the one clicked
    const filteredPin = plans.filter((plan) => plan.planId === id);

    //To avoid unnecessary reads
    if (filteredPin[0].isPinned === false) {
      await updateDoc(doc(firestore, "Plans", id), {
        dateEdited: serverTimestamp(), //Update time to modify the order of the plans when pinned
        isPinned: true,
      });
    }
  }

  async function handleUnpin(id) {
    //Search for the plan with the same ID as the one clicked
    const filteredPin = plans.filter((plan) => plan.planId === id);

    //To avoid unnecessary reads
    if (filteredPin[0].isPinned === true) {
      await updateDoc(doc(firestore, "Plans", id), {
        dateEdited: serverTimestamp(), //Update time to modify the order of the plans when pinned
        isPinned: false,
      });
    }
  }

  async function handleDelete(id) {
    //Search for the plan with the same ID as the one clicked
    const filteredPin = plans.filter((plan) => plan.planId === id);

    //Delete the document
    await deleteDoc(doc(firestore, "Plans", id));
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
        {/* <div className="flex flex-row items-center gap-5 ">
          <div
            className="shadow-black-500/40 rounded-3xl bg-gray-700 px-4 py-2 text-lg font-semibold text-white shadow-lg shadow-slate-400/100 hover:cursor-pointer"
            onClick={() => navigate("/planner/plans")}
          >
            Plans
          </div>
          <div className="rounded-3xl bg-slate-200 px-4 py-2 text-lg font-semibold text-gray-600 hover:cursor-pointer hover:bg-gray-700 hover:text-white hover:shadow-xl hover:shadow-slate-400/100">
            Notes
          </div>
        </div> */}
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex-row pr-2">
            <div className="px-2 text-lg font-semibold">Pinned</div>
            <img
              src={returnButton}
              alt=""
              className="invert-to-white ml-auto w-8 rotate-180 hover:cursor-pointer"
              onClick={() => navigate("/")}
            />
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
                .sort((a, b) => new Date(b.dateEdited) - new Date(a.dateEdited))
                .filter((plan) => plan.isPinned === true)
                .map((item, index) => (
                  <PlannerCard
                    key={index}
                    subject={item.subject}
                    description={item.description}
                    color={item.color}
                    textColor={item.textColor}
                    pin={pin}
                    unpin={unpin}
                    isPinned={item.isPinned}
                    handlePin={handlePin}
                    handleUnpin={handleUnpin}
                    handleDelete={handleDelete}
                    settings={settings}
                    id={item.planId}
                    link={`/planner/pinned/${item.planId}`}
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
                      (a, b) => new Date(b.dateEdited) - new Date(a.dateEdited)
                    )
                    .slice(
                      0,
                      3
                    ) /* Part that determines the number of cards present */
                    .filter(
                      (item) => item.isPinned !== true
                    ) /* Removed pinned items in the list */
                    .map((plan, index) => (
                      <PlannerCard
                        key={index}
                        subject={plan.subject}
                        description={plan.description}
                        color={plan.color}
                        textColor={plan.textColor}
                        pin={pin}
                        unpin={unpin}
                        isPinned={plan.isPinned}
                        handlePin={handlePin}
                        handleUnpin={handleUnpin}
                        handleDelete={handleDelete}
                        settings={settings}
                        id={plan.planId}
                        link={`/planner/${plan.planId}`}
                      />
                    ))
                : plans /* Checks if all is active or clicked */
                    .sort(
                      (a, b) => new Date(b.dateEdited) - new Date(a.dateEdited)
                    )
                    .filter(
                      (item) => item.isPinned !== true
                    ) /* Removes pinned items in the list */
                    .map((plan, index) => (
                      <PlannerCard
                        key={index}
                        subject={plan.subject}
                        description={plan.description}
                        color={plan.color}
                        textColor={plan.textColor}
                        pin={pin}
                        unpin={unpin}
                        isPinned={plan.isPinned}
                        handlePin={handlePin}
                        handleUnpin={handleUnpin}
                        handleDelete={handleDelete}
                        settings={settings}
                        id={plan.planId}
                        link={`/planner/${plan.planId}`}
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
