import React from "react";
import { Skeleton } from "@mui/material";

export default function PlannerCardLoad() {
  return (
    <div className="relative flex h-min flex-none flex-row truncate rounded-xl bg-slate-100 p-5 shadow-md hover:cursor-pointer lg:flex-[0_1_48%] 2xl:flex-[0_1_32%] lg:min-w-0 sm:min-w-[16rem] ">
      <div className="flex items-center rounded-md p-1 font-bold">
        <Skeleton variant="rounded" animation="wave" className="p-8" />
      </div>
      <div className="mx-5 w-full truncate">
        <div className="truncate font-semibold sm:text-lg">
          <Skeleton
            variant="text"
            animation="wave"
            className="w-full"
            // className="w-8/12 md:w-6/12 xl:w-10/12"
          />
        </div>
        <div className="sm:text-md truncate text-xs font-medium mr-10">
          <Skeleton
            variant="text"
            animation="wave"
            className="w-full"
          />
        </div>
      </div>
      <div className="absolute right-4 top-2 flex flex-col-reverse gap-2 sm:flex-row"></div>
    </div>
  );
}
