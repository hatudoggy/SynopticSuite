import { useEffect, isValidElement} from "react";

const useClickClose = (domRef, btnRef, handler) =>{
    //let domRef = useRef();
    //let btnRef = useRef();

    useEffect(() => {
    
        let outHandler = (event) => {
            if(btnRef != ''){
                if(!btnRef.current.contains(event.target)){
                    if( !domRef.current.contains(event.target)){
                        handler();
                    }
                }
            }else{
                if(!domRef.current.contains(event.target)){
                    handler();
                }
            }
        }

        document.addEventListener("mousedown", outHandler);
        return () => {
          document.removeEventListener("mousedown", outHandler)
        }
    });
};

export default useClickClose;