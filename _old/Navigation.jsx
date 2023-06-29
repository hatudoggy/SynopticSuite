import { useNavigate } from "react-router-dom";

function Navigation({ image, nameOfNav, classOfNav, classOfWrapper, link }) {
  const navigate = useNavigate()
  
  return (
    
    
      <div
        className={
          "sm:flex flex-row items-center rounded-lg sm:px-5 w-full py-2 font-sans text-lg text-white hover:cursor-pointer hover:bg-hover-color " +
          (classOfWrapper ? classOfWrapper : "sm:gap-8")
        } onClick={()=>{navigate(link)}}
      >
        
        <img src={image} alt="calendar" className="sm:w-9 w-10 m-auto sm:m-0" />
        <p className={classOfNav}>{nameOfNav}</p>
        
      </div>
   

    
  );
}

export default Navigation;
