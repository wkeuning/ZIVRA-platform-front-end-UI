import { config } from "@/configs/AppConfig";
import { SessionData } from "@/models/SessionData";
import { calculateSessionDuration } from "@/services/gamesession/sessionUtils";

export interface GameSession {
  id: number;
  patient: { id: string; firstName: string; lastName: string };
  game: { name: string };
  sessionStart: string;
  duration: string;
  category: string;
  device: string;
  exercises: [];
}

export const fetchGameSessions = async (
  page = 1,
  limit = 5
): Promise<{ data: GameSession[]; total: number }> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Log in to continue.");

  const url = `${config.apiUrl}${config.endpoints.session.getAllSessions}?page=${page}&limit=${limit}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`Page ${page} (limit ${limit}) - received:`, data.data.length);
  return { data: data.data, total: data.total };
};

export const fetchPatientSessions = async (
  patientId: string
): Promise<{ data: GameSession[]; total: number }> => {
  //if (!patientId) throw new Error("Patient ID is required");

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Log in to continue.");

  const url = `${config.apiUrl}${config.endpoints.session.getAllSessionsFromPatient}?patientId=${patientId}`;
  console.log(url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`Fetched ${data.length} sessions for patient ${patientId}`);

  return { data, total: data.length };
};

export const fetchSessionDetails = async (
  sessionId: string,
  patientId: string
): Promise<SessionData | null> => {
  if (!patientId) throw new Error("Patient ID is required");

  const token = localStorage.getItem("token");
  if (!token) throw new Error("No access");

  const url = `${config.apiUrl}${config.endpoints.session.getSessionDetails}?patientId=${patientId}&sessionId=${sessionId}`;

  console.log(token);
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error retrieving session details");
  }

  return await response.json();
};

export const fetchAndFormatSessions = async (
  pageNumber: number,
  pageSize: number
): Promise<GameSession[]> => {
  const { data } = await fetchGameSessions(pageNumber, pageSize);
  return data.map((session) => ({
    ...session,
    duration: calculateSessionDuration(session.sessionStart, session.exercises),
  }));
};
