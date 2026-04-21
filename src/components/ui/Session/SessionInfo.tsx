import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarDays,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import StatCard from "./StatCard";
import { Exercise } from "@/models/SessionData";

interface SessionInfoProps {
  data: {
    id: number;
    sessionStart: string;
    exercises?: Exercise[];
  };
}

const SessionInfo: React.FC<SessionInfoProps> = ({ data }) => {
  const navigate = useNavigate();

  const formattedDate = data.sessionStart
    ? new Date(data.sessionStart).toLocaleDateString("nl-NL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const formattedTime = data.sessionStart
    ? new Date(data.sessionStart).toLocaleTimeString("nl-NL", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  // Extract hits and misses from metrics
  const getTableBallStats = () => {
    const exercise = data.exercises?.[0];
    if (!exercise?.metrics) return { hits: null, misses: null };

    let hits: string | null = null;
    let misses: string | null = null;

    exercise.metrics.forEach((metricObj) => {
      const metricName = metricObj.metric?.name;
      if (metricName === "Table Ball Total Hits") {
        hits = metricObj.value;
      } else if (metricName === "Table Ball Total Misses") {
        misses = metricObj.value;
      }
    });

    return { hits, misses };
  };

  const { hits, misses } = getTableBallStats();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
          </button>
          Session {data.id || "N/A"}
        </h2>
        <div className="flex items-center text-gray-500">
          <FontAwesomeIcon icon={faCalendarDays} className="w-5 h-5 mr-1" />
          <span>
            {formattedDate} | {formattedTime}
          </span>
        </div>
      </div>

      {(hits !== null || misses !== null) && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Table Ball Stats</h2>
          <div className="grid grid-cols-2 mb-2 gap-2">
            <StatCard
              icon={
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-green-500"
                />
              }
              label="Hits"
              value={hits || "0"}
            />
            <StatCard
              icon={
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  className="text-red-500"
                />
              }
              label="Misses"
              value={misses || "0"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionInfo;
