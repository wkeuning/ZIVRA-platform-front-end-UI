export interface EventscountService {
  label: string;
  value: number;
}

/**
 * Extracts motion type data from the first exercise's metrics.
 */
export const extractMotionTypeData = (
  exercise: any
): EventscountService[] => {
  const dynamicMotionItems: EventscountService[] = [];

  if (exercise && exercise.metrics) {
    exercise.metrics.forEach((metricObj: any) => {
      const { metric, value } = metricObj;
      console.log("Metric found:", metric?.name, "Type:", metric?.type, "Value:", value);

      if (metric?.type === 4 && value) {
        try {
          const parsed = value.startsWith("[")
            ? JSON.parse(value)
            : value.split(",").map((v: string) => Number(v.trim()));

          console.log("Parsed value:", parsed);

          if (Array.isArray(parsed)) {
            dynamicMotionItems.push({
              label: metric.name,
              value: parsed.length,
            });
          }
        } catch (err) {
          console.warn("Parsing error:", err);
        }
      }
    });
  }

  return dynamicMotionItems;
};
