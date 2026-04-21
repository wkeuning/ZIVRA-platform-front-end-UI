interface TrafficLightProps {
  active: "red" | "yellow" | "green";
}

export default function TrafficLight({ active }: TrafficLightProps) {
  return (
    <div className="w-20 h-20 my-auto bg-black opacity-60 p-4 rounded-xl flex flex-col gap-4 items-center shadow-xl">

      {active === "red" && (
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 w-10 h-10 bg-red-600 rounded-full shadow-inner opacity-80 ring-4 ring-red-300 shadow-red-400/70 shadow-xl"></div>
          <span className="absolute inset-0 flex items-center justify-center text-2xl text-white font-bold">
            !!!
          </span>
        </div>
      )}
      {active === "yellow" && (
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 w-10 h-10 bg-yellow-400 rounded-full shadow-inner opacity-80 ring-4 ring-yellow-300 shadow-yellow-400/70 shadow-xl"></div>
          <span className="absolute inset-0 flex items-center justify-center text-2xl text-white font-bold">
            !
          </span>
        </div>

      )}

      {active === "green" && (
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 w-10 h-10 bg-green-400 rounded-full shadow-inner opacity-80 ring-4 ring-green-300 shadow-green-400/70 shadow-xl"></div>
          <span className="absolute inset-0 flex items-center justify-center text-2xl text-white font-bold">
            ✓
          </span>
        </div>
      )}
    </div>
  );
}
