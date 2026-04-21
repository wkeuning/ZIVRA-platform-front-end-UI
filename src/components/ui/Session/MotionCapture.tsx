import { useEffect, useState } from "react";
import { BVHViewer } from "@/components/visualize/BVHViewer";
import { config } from "@/configs/AppConfig";

interface ParsedBVH {
  hierarchy: string;
  frames: number[][];
}

interface MotionCaptureProps {
  sessionDuration: number;
  bvhId?: string;
}

function parseBVHData(bvhString: string): ParsedBVH {
  if (!bvhString) {
    throw new Error("Empty BVH string received");
  }

  const lines = bvhString.trim().split("\n");

  const hierarchyStart = lines.findIndex((line) => line.trim() === "HIERARCHY");
  if (hierarchyStart === -1) throw new Error("HIERARCHY section not found");

  const motionStart = lines.findIndex((line) => line.trim() === "MOTION");
  if (motionStart === -1) throw new Error("MOTION section not found");

  const hierarchyLines = lines.slice(hierarchyStart, motionStart);
  const hierarchy = hierarchyLines.join("\n");

  const motionLines = lines.slice(motionStart);

  const framesLine = motionLines.find((line) =>
    line.trim().startsWith("Frames:")
  );
  const frameTimeLine = motionLines.find((line) =>
    line.trim().startsWith("Frame Time:")
  );

  if (!framesLine || !frameTimeLine) {
    throw new Error("Frames or Frame Time missing");
  }

  const frameCount = parseInt(framesLine.split(":")[1].trim());

  const frameStart = motionLines.findIndex(
    (line) =>
      !line.startsWith("MOTION") &&
      !line.startsWith("Frames:") &&
      !line.startsWith("Frame Time:") &&
      line.trim() !== ""
  );

  if (frameStart === -1) throw new Error("No motion frame data found");

  const frameLines = motionLines.slice(frameStart);

  const frames: number[][] = [];

  for (const line of frameLines) {
    if (!line.trim()) continue;

    const values = line
      .trim()
      .split(/\s+/)
      .map((v) => parseFloat(v));

    if (!isNaN(values[0])) frames.push(values);
  }

  if (frames.length !== frameCount) {
    console.warn(`Expected ${frameCount} frames, but parsed ${frames.length}`);
  }

  return { hierarchy, frames };
}

export default function MotionCapture({
  sessionDuration,
  bvhId,
}: MotionCaptureProps) {
  const [motionData, setMotionData] = useState<string>("");
  const [parsedBVH, setParsedBVH] = useState<ParsedBVH | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bvhId) return;

    const loadBvhFile = async () => {
      try {
        const url = `${config.apiUrl}api/BvhFile/GetSingle/${bvhId}`;

        const res = await fetch(url);

        if (!res.ok) throw new Error("Couldn't retrieve BVH file");

        const text = await res.text();
        setMotionData(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknwown error");
      }
    };

    loadBvhFile();
  }, [bvhId]);

  useEffect(() => {
    if (!motionData) return;

    try {
      const parsed = parseBVHData(motionData);
      setParsedBVH(parsed);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error after parsing BVH");
      setParsedBVH(null);
    }
  }, [motionData]);

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded-lg mt-4">
        <p className="text-red-700 font-bold">Error: {error}</p>
      </div>
    );
  }

  if (!parsedBVH) {
    return (
      <div className="bg-white p-4 rounded-lg shadow mt-4">
        <p>BVH data is loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-4">
      <BVHViewer
        bvhData={parsedBVH}
        fixedSize
        sessionDuration={sessionDuration}
      />
    </div>
  );
}
