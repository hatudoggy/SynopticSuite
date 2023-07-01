import React, { useState, useRef, useEffect } from "react";
import calendar from "../../assets/calendar.svg";
import resources from "../../assets/resources.svg";
import clock from "../../assets/clock.svg";
import planner from "../../assets/planner.svg";
import notes from "../../assets/notes.svg";
import analytics from "../../assets/analytics.svg";
import addButton from "../../assets/add-button.svg";
import logo from "../../assets/SuiteLogo.png";
import { useNavigate } from "react-router-dom";
import "../../css/Sidebar.css";
import useClickClose from "../../hooks/useClickClose";

function Sidebar() {
  return (
    <div className="sticky left-0 top-0 hidden z-10 h-screen w-36 flex-row self-start sm:flex">
      
      <div className="flex h-full w-5/12 flex-col items-center gap-8 bg-slate-300 py-6">
        <LinkCont />
      </div>

      <div className="flex h-full w-7/12 flex-col  items-center gap-8 bg-slate-500 py-6">
        <a href="/">
          <div className="">
            <img src={logo} className="w-12" alt="Logo" />
          </div>
        </a>

        <div className="flex flex-col gap-4 ">
          <Icon image={calendar} text={"Calendar"} link={"/"} />
          <Icon image={resources} text={"Resources"} link={"resources"} />
          <Icon image={clock} text={"Schedule"} link={"schedule"} />
          <Icon image={planner} text={"Planner"} link={"planner"} />
          <Icon image={notes} text={"Notes"} link={"notes"} />
          <Icon image={analytics} text={"Analytics"} link={"analytics"} />
        </div>
      </div>
    </div>
  );
}

function LinkCont() {
  const [linkList, setLinkList] = useState([
    "https://www.google.com",
    "https://www.instagram.com",
    "https://www.github.com",
    "https://elms.sti.edu"
  ]);

  const [activeLink, setActiveLink] = useState(null); // Track the active link

  const addLink = (link) => {
    if (!link.startsWith("https://") && !link.startsWith("http://")) {
      if (link.startsWith("www.")) {
        link = "https://" + link;
      } else {
        link = "https://www." + link;
      }
    }
    setLinkList([...linkList, link]);
  };
  

  const deleteLink = (link) => {
    setLinkList(linkList.filter((l) => l !== link));
    if (activeLink === link) {
      setActiveLink(null);
    }
  };

  return (
    <>
      <NewLinks addLink={addLink} />
      <div className="noScroll my-2 flex h-auto flex-col gap-4 overflow-y-auto">
        {linkList.map((e, key) => {
          return (
            <Link
              link={e}
              key={key}
              onDelete={() => deleteLink(e)}
              setActiveLink={setActiveLink}
              activeLink={activeLink}
            />
          );
        })}
      </div>
    </>
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
      <img src={image} alt={text} className="w-10" />
      <ToolTip text={text} />
    </div>
  );
}

function ToolTip({ text }) {
  return (
    <span
      className="invisible absolute px-2 left-16 z-20 w-auto min-w-max origin-left scale-50 rounded bg-gray-800
    p-1 text-white opacity-0 shadow-md transition group-hover:visible group-hover:block group-hover:scale-100 group-hover:opacity-100"
    >
      {text}
    </span>
  );
}

function Link({ link, onDelete, setActiveLink, activeLink }) {
  const isValidLink = link.startsWith("http://") || link.startsWith("https://");
  const linkRef = isValidLink
    ? `https://s2.googleusercontent.com/s2/favicons?domain=${link}&sz=64`
    : null;

  const handleContextMenu = (event) => {
    event.preventDefault();
    if (activeLink !== link) {
      setActiveLink(link);
    }
    setModalVisible(true);
    setModalPosition({ x: event.clientX, y: event.clientY });
  };

  const handleEdit = () => {
    // Implement the edit functionality here
    // You can open another modal or use an inline editing approach
  };

  const handleDelete = () => {
    if (activeLink === link) {
      setActiveLink(null);
      setModalVisible(false); // Close the context menu after deleting the link
    }
    onDelete();
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutsideModal);

    return () => {
      document.removeEventListener("click", handleClickOutsideModal);
    };
  }, []);

  return (
    <>
      <a href={link} target="_blank" rel="noopener noreferrer">
        <div
          className={
            "group relative flex flex-none items-center justify-center rounded-lg bg-cover bg-center bg-no-repeat transition-all " +
            "h-10 w-10 shadow-md hover:bg-slate-300 hover:opacity-80"
          }
          style={{ backgroundImage: linkRef ? `url(${linkRef})` : "" }}
          onContextMenu={(event) => handleContextMenu(event)} // Pass the event to handleContextMenu
        ></div>
      </a>

      {modalVisible && activeLink === link && (
        <div
          ref={modalRef}
          className="absolute z-30 flex translate-x-14 flex-row rounded-md bg-gray-300 p-2 shadow-lg transition-all"
          style={{
            top: modalPosition.y,
          }}
        >
          <button
            onClick={handleEdit}
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 m-1 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 m-1 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Delete
          </button>
        </div>
      )}
    </>
  );
}

function NewLinks({ addLink }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [linkInput, setLinkInput] = useState("");

  const handleInputChange = (event) => {
    setLinkInput(event.target.value);
  };

  const handleSubmit = () => {
    addLink(linkInput);
    setLinkInput("");
    setModalVisible(false);
  };

  const modalRef = useRef();
  const buttonRef = useRef();

  useClickClose(modalRef, buttonRef, () => {
    setModalVisible(false);
  });

  return (
    <div>
      <div
        ref={buttonRef}
        className="group relative flex h-12 w-12 flex-none items-center
      justify-center rounded-2xl bg-slate-500 shadow-md
      transition-all hover:cursor-pointer hover:rounded-xl hover:bg-gray-700"
        onClick={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <img src={addButton} alt="Add" className="w-10" />
        <ToolTip text={"Add New Link"} />
      </div>

      {modalVisible && (
        <div
          ref={modalRef}
          className="absolute z-30 flex translate-x-16 flex-col gap-3 rounded-md bg-gray-300 p-4 shadow-lg transition-all"
        >
          <input
            className="px-2 py-1"
            type="text"
            value={linkInput}
            onChange={handleInputChange}
            placeholder="Enter URL"
          />
          <button className="m-auto w-1/2 rounded-md bg-slate-400" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}
      
    </div>
  );
}

export { Icon, LinkCont };
export default Sidebar;
