import React, { useState } from "react";
import { GameReviewDialog } from "@/components/game/GameReviewDialog";
import { useGames } from "@/hooks/game/useGames";
import { Game, getStatusText, getStatusClass } from "@/models/Game";

export const Games: React.FC = () => {
  const {
    games,
    loading,
    error,
    showPending,
    setShowPending,
    isAdmin,
    handleApprove,
    handleReject,
  } = useGames();

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    sortBy: "name" as "name" | "status",
    sortOrder: "asc" as "asc" | "desc",
  });

  // Filter and sort games based on the current filters
  const filteredGames = games
    .filter(
      (game) =>
        game.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        game.publisher.toLowerCase().includes(filters.search.toLowerCase())
    )
    .sort((a, b) => {
      // Sort by name
      if (filters.sortBy === "name") {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return filters.sortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      // Sort by status
      else if (filters.sortBy === "status") {
        return filters.sortOrder === "asc"
          ? a.status - b.status
          : b.status - a.status;
      }
      return 0;
    });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleSort = (field: "name" | "status") => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="p-6">
      {/* Header and controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold">Games</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:space-x-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search games..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4C45FC] w-full sm:w-auto"
              value={filters.search}
              onChange={handleSearchChange}
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
          {isAdmin && (
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showPending}
                onChange={() => setShowPending(!showPending)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="break-words max-w-xs">
                Show Pending Approvals
              </span>
            </label>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-center text-red-600 bg-red-100 px-4 py-2 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          Loading games...
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table header */}
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
                    Publisher
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {filters.sortBy === "status" && (
                        <span className="ml-1">
                          {filters.sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              {/* Table body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGames.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center">
                      No games found
                    </td>
                  </tr>
                ) : (
                  filteredGames.map((game) => (
                    <tr key={game.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {game.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {game.publisher}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                            game.status
                          )}`}
                        >
                          {getStatusText(game.status)}
                        </span>
                      </td>
                      {isAdmin && game.status === 0 && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedGame(game)}
                            className="bg-[#4C45FC] text-white px-4 py-2 rounded-xl hover:bg-[#3a36d1] transition"
                          >
                            Review
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review dialog */}
      {selectedGame && (
        <GameReviewDialog
          open={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          game={selectedGame}
          onApprove={() => handleApprove(selectedGame.id)}
          onReject={() => handleReject(selectedGame.id)}
        />
      )}
    </div>
  );
};
