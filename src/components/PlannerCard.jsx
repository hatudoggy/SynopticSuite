import { useNavigate } from "react-router-dom";

export default function PlannerCard({
  subject,
  description,
  color,
  textColor,
  pin,
  unpin,
  isPinned,
  handlePin,
  handleUnpin,
  settings,
  id,
  link,
}) {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex flex-row rounded-xl bg-slate-100 p-5 shadow-md hover:cursor-pointer sm:min-w-[375px]"
      onClick={(e) => (e.target.tagName === "IMG" ? null : navigate(link))}
    >
      <div
        className="flex items-center rounded-md p-5 font-bold"
        style={{
          backgroundColor: color ? color : "",
          color: textColor ? textColor : "",
        }}
      >
        MP
      </div>
      <div className="mx-5 truncate">
        <div className="truncate font-semibold sm:text-lg">{subject}</div>
        <div className="sm:text-md truncate text-xs font-medium">
          {description}
        </div>
      </div>
      <div className="lg:mx-10"></div>
      <div className="absolute right-4 top-2 flex flex-col-reverse gap-2 sm:flex-row">
        {isPinned ? (
          <img
            src={unpin}
            className="w-5 hover:cursor-pointer"
            onClick={() => handleUnpin(id)}
          />
        ) : (
          <img
            src={pin}
            className="w-5 hover:cursor-pointer"
            onClick={() => handlePin(id)}
          />
        )}
        <img src={settings} className="w-5 hover:cursor-pointer" />
      </div>
    </div>
  );
}
