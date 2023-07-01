import React from "react";
import { Skeleton } from "@mui/material";

export default function PlannerCardLoad() {
  return (
    <div className="relative flex flex-row rounded-xl bg-slate-100 p-5 shadow-md sm:min-w-[375px] lg:max-w-[375px] ">
      <div className="flex items-center rounded-md p-1 font-bold">
        <Skeleton variant="rounded" animation="wave" className="p-4 sm:p-8" />
      </div>
      <div className="mx-5 w-full truncate">
        <div className="truncate font-semibold sm:text-lg">
          <Skeleton
            variant="text"
            animation="wave"
            className="w-8/12 md:w-6/12 xl:w-10/12"
          />
        </div>
        <div className="sm:text-md truncate text-xs font-medium">
          <Skeleton
            variant="text"
            animation="wave"
            className="w-6/12 md:w-4/12 xl:w-8/12"
          />
        </div>
      </div>
      <div className="lg:mx-10"></div>
      <div className="absolute right-4 top-2 flex flex-col-reverse gap-2 sm:flex-row"></div>
    </div>
  );
}
