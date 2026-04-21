import React, { useEffect, useState } from 'react';
import { Game, getStatusText, getStatusClass } from '@/models/Game';

interface GameReviewDialogProps {
    open: boolean;
    onClose: () => void;
    game: Game;
    onApprove: () => void;
    onReject: () => void;
}

export const GameReviewDialog: React.FC<GameReviewDialogProps> = ({
    open,
    onClose,
    game,
    onApprove,
    onReject,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (open) {
            setIsMounted(true);
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => setIsMounted(false), 500);
            return () => clearTimeout(timer);
        }
    }, [open]);

    // Handle approve/reject with closing
    const handleApprove = () => {
        onApprove();
        onClose();
    };

    const handleReject = () => {
        onReject();
        onClose();
    };

    if (!isMounted) return null;

    return (
        <div
            className={`
                fixed inset-0 z-50 
                transition-opacity duration-500 ease-in-out
                ${isVisible ? 'opacity-100' : 'opacity-0'}
            `}
        >
            {/* Backdrop with transition */}
            <div
                className="absolute inset-0 bg-black/50 transition-opacity duration-500 ease-in-out"
                onClick={onClose}
            />

            {/* Dialog with transition */}
            <div
                className={`
                    fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2
                    bg-white rounded-lg p-6 max-w-md md:w-full
                    transition-all duration-500 ease-in-out
                    ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                `}
                data-cy="reviewDialog"
            >
                <h2 className="text-xl font-bold mb-4">Review Game: {game.name}</h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium">Game Details</h3>
                        <div className="mt-2 space-y-2">
                            <p><span className="font-medium">Publisher:</span> {game.publisher}</p>
                            <p>
                                <span className="font-medium">Status:</span>
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusClass(game.status)}`}>
                                    {getStatusText(game.status)}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium">FHIR Observation Compliance</h3>
                        <div className="mt-2 space-y-2">
                            <p>
                                <span className="font-medium">Reference Range: </span>
                                {game.lowReferenceValue} - {game.highReferenceValue} {game.lowReferenceValueUnit}
                            </p>
                            <p> 
                                <span className='font-medium'>Metric Definitions: </span>
                                {game.metricDefinitions && game.metricDefinitions.length > 0 ? (
                                    <ul className="list-disc pl-5">
                                        {game.metricDefinitions.map((metric, index) => (
                                            <li key={index}>
                                                {metric.name}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span className="text-gray-500">No metrics defined</span>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md transition-colors hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleReject}
                            className="px-4 py-2 bg-red-500 text-white rounded-md transition-colors hover:bg-red-600"
                        >
                            Reject
                        </button>
                        <button
                            onClick={handleApprove}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md transition-colors hover:bg-blue-600"
                        >
                            Approve
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};