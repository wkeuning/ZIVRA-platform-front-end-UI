export interface Game {
    id: number;
    name: string;
    publisher: string;
    status: number;
    lowReferenceValue: string;
    lowReferenceValueUnit: string;
    highReferenceValue: string;
    highReferenceValueUnit: string;
    metricDefinitions?: Array<{
        name: string;
        type: string;
    }>;
}

export const getStatusText = (status: number): string => {
    switch(status) {
        case 0: return 'Pending';
        case 1: return 'Approved';
        case 2: return 'Rejected';
        default: return 'Unknown';
    }
};

export const getStatusClass = (status: number): string => {
    switch(status) {
        case 0: return 'bg-yellow-100 text-yellow-800';
        case 1: return 'bg-green-100 text-green-800';
        case 2: return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};