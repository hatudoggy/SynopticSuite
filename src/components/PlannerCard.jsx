export default function PlannerCard({
  index,
  subject,
  description,
  pin,
  handlePin,
  settings,
  id,
}) {
  return (
    <div
      key={index}
      className="relative flex flex-row rounded-xl bg-slate-100 p-5 shadow-md sm:min-w-[375px]"
    >
      <div className="flex items-center rounded-md bg-violet-400 p-5 font-bold text-white">
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
        <img
          src={pin}
          className="w-5 hover:cursor-pointer"
          onClick={() => handlePin(id)}
        />
        <img src={settings} className="w-5 hover:cursor-pointer" />
      </div>
    </div>
  );
}
