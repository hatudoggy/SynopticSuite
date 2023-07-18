import "../../css/App.css";
import returnButton from "../../assets/returnButton.svg";
import { useEffect, useState } from "react";
import pin from "../../assets/pinned.svg";
import unpin from "../../assets/unpin.svg";
import settings from "../../assets/dots-settings.svg";
import addButton from "../../assets/add-button-no-circle.svg";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import PlannerCard from "./PlannerCard";
import PlanModal from "./PlanModal";
import { ButtonGroup, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Routes, Route, useNavigate, useResolvedPath, Outlet } from "react-router-dom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { firestore } from "../../config/firebase";
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
import { Skeleton } from "@mui/material";
import PlannerCardLoad from "../../loaders/Planner/PlannerCardLoad";
import ClickedPlan from "./ClickedPlan";

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
  const [isPinned, setIsPinned] = useState(false);
  const [isAll, setIsAll] = useState(true);
  const [isChosen, setIsChosen] = useState(false);

  //Form data
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState();
  const [loading, setLoading] = useState(true);

  const [animate, enableAnimations] = useAutoAnimate(true);

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
      // To give time for data to be processed
      setLoading(false);
    });

    //To avoid double ups, clean up listeners
    return () => unsubscribe();
  }, []);

  //console.log(plans);

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

  const theme = createTheme({
    palette: {
      primary: {
        main: "#64748B",
      },
    },
  });

  return (
    <div className="relative flex justify-center h-full w-full flex-row bg-slate-300 px-10 py-10 overflow-hidden">
      {/* <div className="invert-to-white mb-4 w-fit hover:cursor-pointer hover:fill-black hover:shadow-lg hover:invert-0">
        <img src={returnButton} alt="" className="w-8" />
      </div> */}
      {isModalOpen ? (
        <PlanModal
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
      <div className={"flex flex-1 h-full flex-col gap-5 "+
          "relative sm:static translate-x-[auto] sm:translate-x-[auto] transition-transform "+
          (
            isChosen?"translate-x-[-100vw]":"translate-x-[auto]"
          )}
      
      >
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
          <div className="flex flex-col gap-3 py-4">
            <div className="px-2 text-2xl font-semibold sm:text-4xl">Plans</div>
            <div className="flex flex-row items-center">
              <ThemeProvider theme={theme}>
                <ButtonGroup
                  aria-label="outlined primary button group"
                  className="px-2"
                  fullWidth={width > 1024 ? false : true}
                  disableElevation
                >
                  <Button
                    variant={isAll ? "contained" : "outlined"}
                    onClick={() => {
                      setIsPinned(false);
                      setIsAll(true);
                    }}
                  >
                    All
                  </Button>
                  <Button
                    variant={isPinned ? "contained" : "outlined"}
                    onClick={() => {
                      setIsPinned(true);
                      setIsAll(false);
                    }}
                  >
                    Pinned
                  </Button>
                </ButtonGroup>
              </ThemeProvider>
            </div>
          </div>
          <div
            ref={animate}
            className={"mx-2 flex gap-3 lg:flex-wrap flex-col lg:flex-row"}
          >
            {/* Card */}
            {!loading ? (
              plans /* Checks if plans exists */ ? (
                isPinned /* Checks if pinned is active or clicked */ ? (
                  plans
                    .sort(
                      (a, b) => new Date(b.dateEdited) - new Date(a.dateEdited)
                    )
                    .filter(
                      (item) => item.isPinned === true
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
                        hasOpenPrompt={true}
                        setIsChosen={setIsChosen}
                      />
                    ))
                ) : (
                  plans /* Checks if all is active or clicked */
                    .sort(
                      (a, b) => new Date(b.dateEdited) - new Date(a.dateEdited)
                    )
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
                        hasOpenPrompt={true}
                        setIsChosen={setIsChosen}
                      />
                    ))
                )
              ) : null
            ) : (
              <>
                <PlannerCardLoad />
                <PlannerCardLoad />
                <PlannerCardLoad />
              </>
            )}
            {/* Returns if plan is empty */}
          </div>
        </div>
      </div>
      <SideContent isChosen={isChosen} setIsChosen={setIsChosen}/>

    </div>
  );
}

function SideContent({isChosen, setIsChosen}){

  //<ClickedPlan/>
  return(
    <div className={" h-[80vh] w-3/4 sm:w-[400px] flex-auto flex sm:flex-[0_1_450px] rounded-3xl bg-slate-100 shadow-lg p-5 mx-2 "+ 
        "absolute sm:relative sm:translate-x-[auto] sm:visible "+
        "transition-transform " + (
          isChosen?"translate-x-[auto] visible":"translate-x-[100vw] invisible"
        )}
    >

      <Outlet context={{setIsChosen}}/>

    </div>
  )
}

export default Planner;
