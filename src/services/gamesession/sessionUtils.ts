/**
 * Calculates session duration in formatted string (e.g. "2m 15s")
 */
export const calculateSessionDuration = (sessionStart: string, exercises: any[]): string => {
  const start = new Date(sessionStart);
  let end = start;

  if (exercises && exercises.length > 0) {
    const endTimes = exercises
      .map((ex: any) => new Date(ex.endDateTime))
      .filter((date: Date) => !isNaN(date.getTime()));

    if (endTimes.length > 0) {
      end = new Date(Math.max(...endTimes.map((d: Date) => d.getTime())));
    }
  }

  const durationMs = end.getTime() - start.getTime();
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);

  return `${minutes}m ${seconds}s`;
};

/**
 * Calculates session duration in seconds
 */
export const calculateSessionDurationInSeconds = (sessionStart: string, exercises: any[]): number => {
  const start = new Date(sessionStart);
  let end = start;

  if (exercises?.length > 0) {
    const endTimes = exercises
      .map(ex => new Date(ex.endDateTime))
      .filter(date => !isNaN(date.getTime()));

    if (endTimes.length > 0) {
      end = new Date(Math.max(...endTimes.map(d => d.getTime())));
    }
  }

  return Math.floor((end.getTime() - start.getTime()) / 1000);
};
