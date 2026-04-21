interface MotionItem {
  label: string;
  value: number;
}

interface EventDetailProps {
  motionType: MotionItem[];
}

const colors = [
  "text-green-600",
  "text-fuchsia-600",
  "text-yellow-600",
  "text-purple-600",
  "text-orange-600",
  "text-emerald-600",
  "text-rose-600",
];

const RomDetail: React.FC<EventDetailProps> = ({ motionType }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="min-h-[8rem] p-3 bg-gray-200 rounded">
      <div className="flex flex-wrap justify-center md:justify-start gap-2 w-full max-w-full">
        {motionType.map((motionItem, index) => {
          const color = colors[index % colors.length];
          return (
            <div
              key={index}
              className="w-24 h-24 border-2 border-blue-700 rounded flex flex-col items-center justify-center"
            >
              <span className="font-semibold text-base text-center">
                {motionItem.label}
              </span>
              <span className={`${color} text-5xl font-bold mt-1`}>
                {motionItem.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default RomDetail;
