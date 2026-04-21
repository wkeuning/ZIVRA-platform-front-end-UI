import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import BVHComponent from "@/components/visualize/BVHComponent";

export default function Demo() {
  const [motionData, setMotionData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStaticBVH = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/bvh/test.bvh");
      if (!response.ok) {
        throw new Error(`Failed to load BVH (${response.status})`);
      }
      const text = await response.text();
      setMotionData(text);
    } catch (err) {
      setMotionData("");
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStaticBVH();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Static BVH Demo</h1>
          <p className="text-sm text-muted-foreground">
            Loads a bundled BVH file from <code>/public/bvh/sample.bvh</code>.
          </p>
        </div>
        <Button variant="outline" onClick={loadStaticBVH} disabled={isLoading}>
          {isLoading ? "Loading..." : "Reload"}
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {motionData ? (
        <BVHComponent motionData={motionData} />
      ) : (
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Fetching BVH data..." : "No BVH data loaded."}
        </p>
      )}
    </div>
  );
}
