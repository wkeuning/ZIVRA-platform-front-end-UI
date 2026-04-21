export const config = {
  apiUrl: "https://zivra-platform-backend-ik5k.onrender.com/",
  endpoints: {
    auth: {
      login: "api/Auth/login",
      register: "api/Auth/register",
    },
    user: {
      getProfile: "api/User/GetProfile",
    },
    patient: {
      getPatients: "api/Patient/GetPatients",
      assignPatient: "api/Patient/AssignPatient",
      deletePatient: "api/Patient/RemovePatient",
    },
    game: {
      getAllGames: "api/Game/GetAllGames",
      approveGame: "api/Game/ApproveGame",
      rejectGame: "api/Game/RejectGame",
      createGame: "api/Game/CreateGame",
    },
    session: {
      getAllSessions:
        "api/TherapistSession/GetAllSessionsFromTherapistsPatients",
      getAllSessionsFromPatient:
        "api/TherapistSession/GetAllSessionsFromPatient",
      getSessionDetails: "api/TherapistSession/GetSessionFromPatient",
      getExercisesBySession: "api/TherapistSession/GetExercisesBySession",
    },
  },
};
