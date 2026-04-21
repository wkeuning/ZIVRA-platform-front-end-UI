import React from "react";

interface SessionHeaderProps {
  patient: {
    firstName: string;
    lastName: string;
  };
}

const SessionHeader: React.FC<SessionHeaderProps> = ({ patient }) => (
  <div className="flex items-center mb-4">
    <div className="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
    <h1 className="text-2xl font-bold">
      {patient.firstName} {patient.lastName}
    </h1>
  </div>
);

export default SessionHeader;
