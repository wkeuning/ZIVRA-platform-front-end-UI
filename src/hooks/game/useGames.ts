import { useState, useEffect } from 'react';
import { GameService } from '@/services/game/GameService';
import { Game } from '@/models/Game';
import { getUserRole } from '@/services/auth/UserService';

export const useGames = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userRole = getUserRole();
    const isAdmin = userRole === 'Administrator';
    const [showPending, setShowPending] = useState(isAdmin);

    const fetchGames = async () => {
        try {
            setLoading(true);
            const data = await GameService.fetchGames(isAdmin && showPending);
            setGames(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load games');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames();
    }, [showPending, isAdmin]);

    const handleApprove = async (gameId: number) => {
        try {
            await GameService.approveGame(gameId);
            await fetchGames();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to approve game');
        }
    };

    const handleReject = async (gameId: number) => {
        try {
            await GameService.rejectGame(gameId);
            await fetchGames();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reject game');
        }
    };

    return {
        games,
        loading,
        error,
        showPending,
        setShowPending,
        isAdmin,
        handleApprove,
        handleReject,
        refreshGames: fetchGames
    };
};