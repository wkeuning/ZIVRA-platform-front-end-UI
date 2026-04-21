"use client";

import { BVHViewer } from "./BVHViewer";
import { useState, useEffect } from "react";

export default function BVHComponent({ motionData }: { motionData: string }) {
  const [parsedData, setParsedData] = useState<ParsedBVHData | null>(null);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    try {
      const parsed = parseBVHData(motionData);
      // const filtered = filterBVHByJoints(parsed, usingBodyJoints);

      console.log("Parsed BVH Data:", parsed);
      setParsedData(parsed);
      setError(null);
    } catch (err) {
      setError(
        `Failed to parse BVH data: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      setParsedData(null);
    }
  }, [motionData]);

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold text-red-600">Error:</h2>
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
        <details className="mt-2">
          <summary className="cursor-pointer text-sm text-gray-600">
            Show raw data
          </summary>
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
            {motionData}
          </pre>
        </details>
      </div>
    );
  }

  if (!parsedData) {
    return (
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">Loading BVH data...</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">BVH Animation Viewer</h2>
      <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm">
        Loaded {parsedData.frames.length} frames of animation data
      </div>
      <BVHViewer bvhData={parsedData} fixedSize={true} />
    </div>
  );
}

type ParsedBVHData = {
  hierarchy: string;
  frames: number[][];
  frameCount: number;
  frameTime: number;
  joints: JointChannel[];
};

type JointChannel = {
  name: string;
  numChannels: number;
  channelNames: string[];
  startIndex: number; // index into each frame's channel array
  endIndex: number; // exclusive
};

/**
 * Parse BVH string with channel structure.
 */
function parseBVHData(bvhString: string): ParsedBVHData {
  const lines = bvhString.replace(/\r\n/g, "\n").trim().split("\n");
  const hierarchyStart = lines.findIndex(
    (line) => line.trim().toUpperCase() === "HIERARCHY"
  );
  const motionStart = lines.findIndex(
    (line) => line.trim().toUpperCase() === "MOTION"
  );

  if (hierarchyStart === -1 || motionStart === -1) {
    throw new Error("Invalid BVH: Missing HIERARCHY or MOTION section.");
  }

  const hierarchyLines = lines.slice(hierarchyStart, motionStart);
  const hierarchy = hierarchyLines.join("\n");
  const motionLines = lines.slice(motionStart);

  const framesLine = motionLines.find((line) =>
    line.trim().startsWith("Frames:")
  );
  const frameTimeLine = motionLines.find((line) =>
    line.trim().startsWith("Frame Time:")
  );
  if (!framesLine || !frameTimeLine)
    throw new Error("Missing Frames or Frame Time.");

  const frameCount = parseInt(framesLine.split(":")[1].trim(), 10);
  const frameTime = parseFloat(frameTimeLine.split(":")[1].trim());

  // Parse hierarchy for joint channel info
  const jointRegex = /(ROOT|JOINT)\s+(\S+)/;
  const channelRegex = /CHANNELS\s+(\d+)\s+(.+)/;

  const joints: JointChannel[] = [];
  let currentIndex = 0;
  let currentJoint: JointChannel | null = null;

  for (const line of hierarchyLines) {
    const trimmed = line.trim();
    const jointMatch = trimmed.match(jointRegex);
    if (jointMatch) {
      const name = jointMatch[2];
      currentJoint = {
        name,
        numChannels: 0,
        channelNames: [],
        startIndex: currentIndex,
        endIndex: currentIndex,
      };
      joints.push(currentJoint);
    }
    const channelMatch = trimmed.match(channelRegex);
    if (channelMatch && currentJoint) {
      const numChannels = parseInt(channelMatch[1]);
      const channelNames = channelMatch[2].trim().split(/\s+/);
      currentJoint.numChannels = numChannels;
      currentJoint.channelNames = channelNames;
      currentJoint.startIndex = currentIndex;
      currentJoint.endIndex = currentIndex + numChannels;
      currentIndex += numChannels;
    }
  }

  // Parse frame data
  const frameDataStart = motionLines.findIndex(
    (line) =>
      !line.trim().startsWith("Frames:") &&
      !line.trim().startsWith("Frame Time:") &&
      line.trim() !== "" &&
      !line.trim().startsWith("MOTION")
  );
  const frameDataLines = motionLines.slice(frameDataStart);
  const frames = frameDataLines
    .filter((l) => l.trim())
    .map((l) => l.trim().split(/\s+/).map(Number));

  return { hierarchy, frames, frameCount, frameTime, joints };
}
