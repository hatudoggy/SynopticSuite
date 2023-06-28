import { useEffect, useState } from "react";
import returnButton from "../assets/returnButton.svg";
import { useNavigate } from "react-router-dom";
import {
  query,
  doc,
  collection,
  updateDoc,
  deleteDoc,
  orderBy,
  onSnapshot,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "../config/firebase";
import pin from "../assets/pinned.svg";
import unpin from "../assets/unpin.svg";
import PlannerCard from "./PlannerCard";
import settings from "../assets/dots-settings.svg";
import addButton from "../assets/add-button-no-circle.svg";
import TodoModal from "./TodoModal";

export default function ClickedPlan() {
  /******************************************/
  /* Start of Instantiating State Variables */
  /******************************************/

  //Navigation/Routing
  const navigate = useNavigate();

  //Collection of Data
  const [plan, setPlan] = useState();

  //Checks
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Form data
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [planId, setPlanId] = useState(0);
  const [color, setColor] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  /******************************************/
  /* End of Instantiating State Variables   */
  /******************************************/

  /******************************************/
  /*           Start of UseEffects          */
  /******************************************/

  useEffect(() => {
    // Get the id of the plan via the URL
    const url = window.location.href;
    const parts = url.split("/");
    const id = parts[parts.length - 1];

    // Get the plan from the database
    const dataSnap = query(
      collection(firestore, "Plans"),
      where("planId", "==", id)
    );

    const unsubscribe = onSnapshot(dataSnap, (querySnapshot) => {
      let plan;
      querySnapshot.forEach((doc) => {
        plan = doc.data();
      });
      setPlan(plan);
      console.log(plan);
    });
  }, []);

  /******************************************/
  /*            End of UseEffects           */
  /******************************************/

  /******************************************/
  /*           Start of Functions           */
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
    setPlanId(planId + 1);
    setIsModalOpen(!isModalOpen);

    //Create document in the database with the generated ID
    await setDoc(docRef, compiledData);
  };

  const handlePin = async (id) => {
    //To avoid unnecessary reads
    if (plan?.isPinned === false) {
      await updateDoc(doc(firestore, "Plans", id), {
        dateEdited: serverTimestamp(),
        isPinned: true,
      });
    }
  };

  const handleUnpin = async (id) => {
    //To avoid unnecessary reads
    if (plan?.isPinned === true) {
      await updateDoc(doc(firestore, "Plans", id), {
        dateEdited: serverTimestamp(),
        isPinned: false,
      });
    }
  };

  const handleDelete = async (id) => {
    navigate(-1);
    await deleteDoc(doc(firestore, "Plans", id));
  };

  return (
    <div className="flex h-full w-full flex-col bg-slate-300 px-10 py-10 sm:px-14 sm:py-14">
      {isModalOpen ? (
        <TodoModal
          handleOutsideClick={handleOutsideClick}
          handleFormSubmit={handleFormSubmit}
          handleClose={() => setIsModalOpen(!isModalOpen)}
          setSubject={setSubject}
          subject={subject}
          setDescription={setDescription}
          description={description}
          header={plan?.subject}
          dateEdited={plan?.dateEdited?.toDate()?.toLocaleString()} //Passes the date
          firstInput={"Item Name"}
          secondInput={"Note"}
          color={color}
          setColor={setColor}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      ) : null}
      <img
        src={returnButton}
        alt=""
        className="invert-to-white w-8 hover:cursor-pointer"
        onClick={() => navigate(-1)}
      />
      <div className="mx-2 flex h-full flex-col gap-7 py-6">
        <PlannerCard
          subject={plan?.subject}
          description={plan?.description}
          color={plan?.color}
          textColor={plan?.textColor}
          pin={pin}
          unpin={unpin}
          isPinned={plan?.isPinned}
          handlePin={handlePin}
          handleUnpin={handleUnpin}
          handleDelete={handleDelete}
          settings={settings}
          id={plan?.planId}
        />
        <div className="flex flex-row sm:min-w-[375px]">
          <div className="text-xl font-semibold">To Do</div>
          <img src={settings} className="ml-auto w-6 hover:cursor-pointer" />
        </div>
        <div className="flex flex-col gap-3 sm:min-w-[375px]">
          <div
            className="flex items-center gap-1 rounded-md bg-white px-7 py-2 font-semibold hover:-translate-y-1 hover:cursor-pointer hover:bg-gray-400 hover:transition-all sm:min-w-[375px] lg:max-w-[375px]"
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            <img src={addButton} className="invert-to-white w-5" />
            <div>Add Task</div>
          </div>
        </div>
      </div>
    </div>
  );
}
