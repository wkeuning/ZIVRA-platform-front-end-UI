import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { PatientService, Patient } from "@/services/patient/PatientService";
import {
  fetchPatientSessions,
  GameSession,
} from "@/services/gamesession/SessionService";
import { formatDateTimeNL } from "@/services/gamesession/dateUtils";
import PlayerCard from "@/components/ui/UserSessionCard";
import Diagram from "@/components/ui/diagram";
import {
  calculateSessionDurationInSeconds,
} from "@/services/gamesession/sessionUtils";

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        if (!id) return;
        const patients = await PatientService.fetchPatients();
        const selectedPatient = patients.find((p) => p.id === id);
        if (selectedPatient) {
          setPatient(selectedPatient);
        } else {
          setError("Patient not found");
        }
      } catch (error: unknown) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load patient details"
        );
        setError("Failed to load patient details");
      } finally {
        setLoading(false);
      }
    };

    const getPatientSessions = async () => {
      if (!id) return;
      const data = await fetchPatientSessions(id);

      setGameSessions(data.data);
    };

    fetchPatient();
    getPatientSessions();
  }, [id]);

  useEffect(() => {
    console.log("Game sessions updated:", gameSessions);
  }, [gameSessions]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading patient details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 bg-red-100 px-4 py-2 rounded-md mb-4">
        {error}
      </div>
    );
  }

  if (!patient) {
    return null;
  }

  const diagramSessions = gameSessions.map((s) => ({
    id: s.id,
    patientId: s.patient.id,
    sessionStart: s.sessionStart,
    exercises: s.exercises || [],
    game: {
      name: s.game.name,
    },
  }));

  return (
    <div className="p-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-800 mr-4"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold mb-4">Patient Details</h1>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {patient.firstName} {patient.lastName}
          </h2>
          <p className="text-gray-600">{patient.email}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p>
              <strong>Phone Number:</strong> {patient.phoneNumber || "N/A"}
            </p>
            <p>
              <strong>Last Activity:</strong>{" "}
              {patient.lastActivity || "No recent activity"}
            </p>
          </div>

          <Diagram sessions={
            diagramSessions
          } />
        </div>
      </div>


      <div className="p-6">
        <p>
          <strong>
            Recent activities of {patient.firstName} {patient.lastName}
          </strong>
        </p>
        <br></br>

        {gameSessions?.sort((a, b) =>
          new Date(a.sessionStart).getTime() - new Date(b.sessionStart).getTime()
        ).map((session) => (
          <PlayerCard
            key={session.id}
            id={session.id}
            name={`${session.patient.firstName} ${session.patient.lastName}`}
            time={calculateSessionDurationInSeconds(session.sessionStart, session.exercises || [])}
            category={session.category}
            level={3}
            game={session.game.name}
            date={formatDateTimeNL(session.sessionStart)}
            feedback="Lorem ipsum dolor sit amet..."
            patientId={session.patient.id}
            status="green"
          />
        )).reverse()}
      </div>
    </div>
  );
}
