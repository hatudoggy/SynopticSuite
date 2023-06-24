import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ClickedPlan() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState();

  useEffect(() => {
    setPlans(JSON.parse(localStorage.getItem("plans")));
  }, []);

  return (
    <div className="flex h-full w-full flex-col bg-slate-300 px-10 py-10">
      <div className="flex h-full w-full flex-col gap-5">
        <div className="flex flex-row items-center gap-5">
          
        </div>
      </div>
    </div>
  );
}
