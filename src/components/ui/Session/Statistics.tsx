import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faStethoscope,
  faCheckCircle,
  faGamepad,
} from "@fortawesome/free-solid-svg-icons";
import StatCard from "./StatCard";

type StatsData = {
  time: string;
  category: string;
  level: string;
  game: string;
};

type StatisticsProps = {
  data: StatsData;
};

const Statistics: React.FC<StatisticsProps> = ({ data }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
    <StatCard
      icon={<FontAwesomeIcon icon={faClock} className="text-red-500" />}
      label="Time"
      value={data.time}
    />
    <StatCard
      icon={
        <FontAwesomeIcon icon={faStethoscope} className="text-yellow-500" />
      }
      label="Category"
      value={data.category}
    />
    <StatCard
      icon={<FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />}
      label="Level"
      value={data.level}
    />
    <StatCard
      icon={<FontAwesomeIcon icon={faGamepad} className="text-pink-500" />}
      label="Game"
      value={data.game}
    />
  </div>
);

export default Statistics;
