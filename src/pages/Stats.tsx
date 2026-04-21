import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BVHComponent from "@/components/visualize/BVHComponent";
import { config } from "@/configs/AppConfig";
import { useState } from "react";

export default function Stats() {
  const [bvhId, setBvhId] = useState("");
  const [motionData, setMotionData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      //GET
      // /api/BvhFile/GetSingle/{guid}
      console.log(`${config.apiUrl}api/BvhFile/GetSingle/${bvhId}`);
      const response = await fetch(
        `${config.apiUrl}api/BvhFile/GetSingle/${bvhId}`
      );

      if (response.ok) {
        const data = await response.text();
        setMotionData(data);
      } else {
        console.error(
          "Failed to fetch BVH data:",
          response.status,
          response.statusText
        );
        setMotionData("");
      }
    } catch (error) {
      console.error("Error fetching BVH data:", error);
      setMotionData("");
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="flex gap-4 flex-col p-6">
      <h1 className="text-2xl font-bold">BVH Viewer Test Page f908c0e5-bc58-4810-90bf-e64721a636cc</h1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <Input
            type="text"
            placeholder="Enter BVH ID (GUID)"
            value={bvhId}
            onChange={(e) => setBvhId(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !bvhId.trim()}
          >
            {isLoading ? "Loading..." : "Load from API"}
          </Button>
        </div>
      </div>
      {motionData && (
        <div className="mt-4">
          <BVHComponent motionData={motionData} />
        </div>
      )}
    </div>
  );
};
