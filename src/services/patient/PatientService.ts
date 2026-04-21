import axios, { AxiosError } from "axios";
import { config } from "@/configs/AppConfig";

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  lastActivity?: string;
}

interface AssignPatientResponse {
  success: boolean;
  message: string | null;
  patients: Patient[] | null;
}

interface DeletePatientResponse {
  success: boolean;
  message: string | null;
  patients: Patient[] | null;
}

export const PatientService = {
  async fetchPatients(filters?: {
    search?: string;
    sortBy?: "name" | "lastActivity";
    sortOrder?: "asc" | "desc";
  }): Promise<Patient[]> {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const params = new URLSearchParams();
      if (filters?.search) params.append("search", filters.search);
      if (filters?.sortBy) params.append("sortBy", filters.sortBy);
      if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

      const response = await axios.get(
        `${config.apiUrl}${
          config.endpoints.patient.getPatients
        }?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.map((patient: Patient) => ({
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phoneNumber: patient.phoneNumber || "N/A",
        lastActivity: patient.lastActivity || "No recent activity",
      }));
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw error;
    }
  },

  async deletePatient(id: string): Promise<DeletePatientResponse> {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      console.log("Deleting patient:", id);
      const response = await axios.post(
        `${config.apiUrl}${config.endpoints.patient.deletePatient}`,
        { patientId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return {
        success: true,
        message: "Patient deleted successfully",
        patients: response.data,
      };
    } catch {
      return {
        success: false,
        message: "Failed to delete patient",
        patients: [],
      };
    }
  },

  async assignPatientToTherapist(
    patientMail: string
  ): Promise<AssignPatientResponse> {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const requestBody = { email: patientMail };

      const response = await axios.post<Patient[]>(
        `${config.apiUrl}${config.endpoints.patient.assignPatient}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return {
        success: true,
        message: "Patient assigned to therapist successfully",
        patients: response.data,
      };
    } catch (error: unknown) {
      console.error("Assign patient error:", error); // Debug log

      // Extract error message from response
      let errorMessage = "Failed to assign patient to therapist";

      if (error instanceof AxiosError && error.response?.data) {
        // If the response has a data field with the error message
        errorMessage = error.response.data as string;
      } else if (error instanceof AxiosError && error.response?.data?.message) {
        // If the response has a nested message field
        errorMessage = error.response.data.message as string;
      } else if (error instanceof Error && error.message) {
        // Fallback to the general error message
        errorMessage = error.message as string;
      }

      return {
        success: false,
        message: errorMessage,
        patients: null,
      };
    }
  },
};
