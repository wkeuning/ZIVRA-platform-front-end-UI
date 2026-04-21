export default function Spinner() {
    return (
        <div className="flex flex-col items-center">
            <svg
                className="animate-spin h-10 w-10"
                style={{ color: 'var(--primary)' }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zM2 12a10 10 0 0110-10V0C4.477 0 0 4.477 0 10h2zm2 0a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
            </svg>
            <p className="text-white pt-2">Loading...</p>
        </div>
    );
}