import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ClickedPlan() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState();

  useEffect(() => {
    setPlans(JSON.parse(localStorage.getItem("plans")));
  }, []);

  useEffect(() => {
    if (plans) {
      localStorage.setItem("plans", JSON.stringify(plans));
      setTimeout(() => {
        console.log(JSON.stringify(plans));
      }, 100);
    }
  }, [plans]);

  return (
    <div className="flex h-full w-full flex-col bg-slate-300 px-10 py-10">
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
      </div>
    </div>
  );
}
