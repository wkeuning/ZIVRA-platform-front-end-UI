import React from "react";

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center space-y-2 text-black w-full">
    <div className="text-3xl">{icon}</div> 
    <span className="font-semibold">{label}</span> 
    <span>{value}</span> 
  </div>
);

export default StatCard;
