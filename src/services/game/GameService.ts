import axios from "axios";
import { config } from "@/configs/AppConfig";
import { Game } from "@/models/Game";

export const GameService = {
    async fetchGames(includePending: boolean = false): Promise<Game[]> {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");

            const response = await axios.get(`${config.apiUrl}${config.endpoints.game.getAllGames}`, {
                params: { includePending },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching games:", error);
            throw error;
        }
    },

    async approveGame(gameId: number): Promise<void> {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");

            await axios.post(`${config.apiUrl}${config.endpoints.game.approveGame}/${gameId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error("Error approving game:", error);
            throw error;
        }
    },

    async rejectGame(gameId: number): Promise<void> {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");

            await axios.post(`${config.apiUrl}${config.endpoints.game.rejectGame}/${gameId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error("Error rejecting game:", error);
            throw error;
        }
    },

    async createGame(gameData: any): Promise<number> {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");

            const response = await axios.post(`${config.apiUrl}${config.endpoints.game.createGame}`, gameData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data.gameId;
        } catch (error) {
            console.error("Error creating game:", error);
            throw error;
        }
    }
};