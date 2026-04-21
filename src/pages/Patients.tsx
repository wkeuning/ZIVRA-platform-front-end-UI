import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PatientService, Patient } from "@/services/patient/PatientService";

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    sortBy: "name" as "name" | "lastActivity",
    sortOrder: "asc" as "asc" | "desc",
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await PatientService.fetchPatients(filters);
        setPatients(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load patients"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleAssignPatient = async (email: string) => {
    console.log(email);
    try {
      const result = await PatientService.assignPatientToTherapist(email);
      console.log("Assigned successfully:", result);
      // TODO notification
    } catch (error) {
      console.error("Error assigning patient:", error);
    }
  };

  const handleSort = (field: "name" | "lastActivity") => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading patients...
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

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold">Patients</h1>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search patients..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4C45FC] w-full sm:w-auto"
            value={filters.search}
            onChange={handleSearchChange}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Name
                    {filters.sortBy === "name" && (
                      <span className="ml-1">
                        {filters.sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact information
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("lastActivity")}
                >
                  <div className="flex items-center">
                    Recent activity
                    {filters.sortBy === "lastActivity" && (
                      <span className="ml-1">
                        {filters.sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-[#4C45FC] font-medium">
                          {patient.firstName.charAt(0)}
                          {patient.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <a
                        href={`mailto:${patient.email}`}
                        className="text-[#4C45FC] hover:text-[#4C45FC]/90"
                      >
                        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                        {patient.email}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {patient.lastActivity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/patients/${patient.id}`}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      <Button className="w-full bg-[#4C45FC] text-white p-3 rounded-xl">
                        View profile
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAssignPatient(filters.search);
          }}
        >
          <input
            type="text"
            placeholder="Add patients by email"
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4C45FC] w-full sm:w-auto"
            value={filters.search}
            onChange={handleSearchChange}
          />
          <Button type="submit" variant="outline">
            Add
          </Button>
        </form>
      </div>
    </div>
  );
}
