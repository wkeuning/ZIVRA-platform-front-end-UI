import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock,  faGamepad,  } from '@fortawesome/free-solid-svg-icons';
import { Button } from "@/components/ui/button";
import TrafficLight from "@/components/ui/TrafficLight";

type UserSessionCardProps = {
  id: number;
  name: string;
  time: number;
  category: string;
  level: number;
  game: string;
  date: string;
  feedback: string;
  patientId: string;
  status: "red" | "yellow" | "green";
};

const UserSessionCard: React.FC<UserSessionCardProps> = ({
  id,
  time,
  game,
  date,
  feedback,
  patientId,
  status
}) => {
  const [formattedDate,] = date.split(" | ");

  return (
    <div className="flex items-center">
      <div className="bg-white rounded-xl shadow-md p-4 grid grid-cols-[13fr_7fr] gap-4 my-4 player-card">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-3 text-black">
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
            <h2 className="font-semibold text-lg">{formattedDate}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-black">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm">
                <FontAwesomeIcon icon={faClock} className="text-red-500" />
                <span>
                  <strong>Duration:</strong> {Math.floor(time / 60) + " m " + (time % 60 < 10 ? "0" : "") + time % 60 + " s"}
                </span>
              </div>


              <div className="flex items-center space-x-2 text-sm">
                <FontAwesomeIcon icon={faGamepad} className="text-pink-500" />
                <span>
                  <strong>Game:</strong> {game}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm mb-1">
                <strong className="text-black">Feedback:</strong>
                <br />
                <span className="text-neutral-400">
                  {feedback.length > 60
                    ? `${feedback.slice(0, 50)}...`
                    : feedback}
                </span>
              </p>
            </div>
          </div>


        </div>

        <div className="flex flex-col justify-between items-end pb-1">
          <Link to={`/session/${id}`} state={{ patientId }}>
            <Button className="bg-[#5e3bee] text-white px-4 py-2 rounded-md hover:bg-[#4c32cb] transition mt-auto self-start md:self-end">
              View more
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative w-4 h-10">
        <div className="absolute top-0 w-4 h-3 bg-black opacity-60"></div>
        <div className="absolute top-7 w-4 h-3 bg-black opacity-60"></div>
      </div>
      <TrafficLight active={status}></TrafficLight>
    </div>
  );
};

export default UserSessionCard;
