import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import SessionHeader from "@/components/ui/Session/SessionHeader";
import SessionInfo from "@/components/ui/Session/SessionInfo";
import Statistics from "@/components/ui/Session/Statistics";
import TrafficLight from "@/components/ui/TrafficLight";
import EventCount from "@/components/ui/Session/EventCount";
import MotionCapture from "@/components/ui/Session/MotionCapture";
import FeedbackForm from "@/components/ui/Session/FeedbackForm";
import Spinner from "@/components/ui/spinner";
import { fetchSessionDetails } from "@/services/gamesession/SessionService";
import {
  calculateSessionDuration,
  calculateSessionDurationInSeconds,
} from "@/services/gamesession/sessionUtils";
import { extractMotionTypeData } from "@/services/gamesession/EventscountService";
import { SessionData } from "@/models/SessionData";

const Session: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const patientId = location.state?.patientId;

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [stats, setStats] = useState({
    time: "N/A",
    category: "N/A",
    level: "N/A",
    game: "N/A",
  });
  const [durationInSeconds, setDurationInSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [motionTypeData, setMotionTypeData] = useState<
    { label: string; value: number }[]
  >([]);
  const [bvhIdentifier, setBvhIdentifier] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!id || !patientId) {
      setError("Invalid session or missing patient data.");
      return;
    }

    const loadSession = async () => {
      setLoading(true);
      try {
        const data = await fetchSessionDetails(id, patientId);
        if (!data) return;
        setSessionData(data as SessionData);

        const formattedDuration = calculateSessionDuration(
          data.sessionStart,
          data.exercises || []
        );

        const seconds = calculateSessionDurationInSeconds(
          data.sessionStart,
          data.exercises || []
        );

        setDurationInSeconds(seconds);
        setStats({
          time: formattedDuration,
          category: data.category || "N/A",
          level: data.game?.level || "N/A",
          game: data.game?.name || "N/A",
        });

        if (data.exercises !== null) {
          const exercise = data.exercises;
          if (exercise) {
            setBvhIdentifier(exercise[0]?.bvhIdentifier ?? null);
          }
        }

        const exercise = data.exercises?.[0];
        if (exercise) {
          const motionItems = extractMotionTypeData(exercise);
          setMotionTypeData(motionItems);
        }
      } catch (error: unknown) {
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while retrieving session data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [id, patientId, navigate]);

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center z-10">
          <Spinner />
        </div>
      )}
      <div className="p-4 md:p-6 w-full max-w-screen-xl mx-auto">
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-2xl mb-4 text-center">
            {error}
          </div>
        )}

        {sessionData && <SessionHeader patient={sessionData.patient} />}

        <div className="flex flex-row gap-4">
          <div className="flex-1">
            {sessionData && <SessionInfo data={sessionData} />}
            <Statistics data={stats} />
          </div>
          <TrafficLight active="green" />
        </div>


        <EventCount motionType={motionTypeData} />
        {id && (
          <MotionCapture
            sessionDuration={durationInSeconds}
            bvhId={bvhIdentifier ?? undefined}
          />
        )}
        <FeedbackForm />
      </div>
    </div>
  );
};

export default Session;
