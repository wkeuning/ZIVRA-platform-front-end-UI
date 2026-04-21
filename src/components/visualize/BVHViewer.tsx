import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { BVHLoader } from "three/addons/loaders/BVHLoader.js";
import Slider from "@mui/material/Slider";

interface BVHViewerProps {
  bvhData: {
    hierarchy: string;
    frames: number[][];
  };
  fixedSize?: boolean;
  sessionDuration?: number;
}

export const BVHViewer = ({
  bvhData,
  fixedSize = false,
  sessionDuration,
}: BVHViewerProps) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(true);
  const [playingUI, setPlayingUI] = useState(true);

  // References for mixers and actions
  const gltfMixerRef = useRef<THREE.AnimationMixer | null>(null);
  const bvhMixerRef = useRef<THREE.AnimationMixer | null>(null);
  const bvhSkeletonHelperRef = useRef<THREE.SkeletonHelper | null>(null);
  const bvhResultRef = useRef<any>(null);

  const updateCurrentTime = useCallback((time: number) => {
    const now = performance.now();
    // Update UI max 20 times per second to save performance
    if (now - lastUpdateRef.current > 50) {
      setCurrentTime(time);
      lastUpdateRef.current = now;
    }
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    // ---------- Three.js scene setup ----------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    const camera = new THREE.PerspectiveCamera(
      45,
      fixedSize ? 2 : window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // Position camera to see the full human figure
    camera.position.set(0, 1.6, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    const setRendererSize = () => {
      if (!mountRef.current) return;
      if (fixedSize) {
        const width = mountRef.current.clientWidth;
        const height = 400; // Adjusted height for better integration
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      } else {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      }
    };
    setRendererSize();

    // Attach renderer
    while (mountRef.current.firstChild) mountRef.current.removeChild(mountRef.current.firstChild);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.update();

    scene.add(new THREE.GridHelper(10, 10));

    // Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // ---------- State / Loaders ----------
    const clock = new THREE.Clock();

    let modelRoot: THREE.Object3D | null = null; // The 3D Avatar (GLB)
    let boneMap: Record<string, THREE.Bone | null> = {};

    // --- Helpers ---
    function normalize(name: string) {
      return name
        .toLowerCase()
        .replace(/^mixamorig/, "")
        .replace(/[^a-z0-9]/g, "");
    }

    function collectModelBones(root: THREE.Object3D) {
      const map: { [k: string]: THREE.Bone } = {};
      root.traverse((c) => {
        if ((c as any).isBone) {
          const n = normalize(c.name);
          map[n] = c as THREE.Bone;
        } else if ((c as any).isSkinnedMesh) {
          const sk = (c as THREE.SkinnedMesh).skeleton;
          if (sk && sk.bones) {
            sk.bones.forEach((b) => {
              const n = normalize(b.name);
              if (!map[n]) map[n] = b;
            });
          }
        }
      });
      return map;
    }

const mixamoAliases = [ //bvh names --> model names
      ["hips", "hips"], 
      ["spine", "spine"], 
      ["chest", "spine1"], 
      ["upperchest", "spine2"], 
      ["neck", "neck"], 
      ["head", "head"], 

      // Right arm 
      ["rightshoulder", "rightshoulder"], 
      ["rightupperarm", "rightarm"], 
      ["rightlowerarm", "rightforearm"], 
      ["righthand", "righthand"], 

      // Left arm 
      ["leftshoulder", "leftshoulder"], 
      ["leftupperarm", "leftarm"], 
      ["leftlowerarm", "leftforearm"], 
      ["lefthand", "lefthand"], 
      
      // // Left fingers 
      // ["leftindexproximal", "lefthandindex1"], 
      // ["leftindexintermediate", "lefthandindex2"], 
      // ["leftindexdistal", "lefthandindex3"], 
      // ["leftmiddleproximal", "lefthandmiddle1"], 
      // ["leftmiddleintermediate", "lefthandmiddle2"], 
      // ["leftmiddledistal", "lefthandmiddle3"], 
      // ["leftringproximal", "lefthandring1"], 
      // ["leftringintermediate", "lefthandring2"], 
      // ["leftringdistal", "lefthandring3"], 
      // ["leftpinkyproximal", "lefthandpinky1"], 
      // ["leftpinkyintermediate", "lefthandpinky2"], 
      // ["leftpinkydistal", "lefthandpinky3"], 
      // ["leftthumbproximal", "lefthandthumb1"], 
      // ["leftthumbintermediate", "lefthandthumb2"], 
      // ["leftthumbdistal", "lefthandthumb3"],

      // Right fingers
      // ["rightthumbproximal", "righthandthumb1"], 
      // ["rightthumbintermediate", "righthandthumb2"], 
      // ["rightthumbdistal", "righthandthumb3"],

      // ["rightindexproximal", "righthandindex1"], 
      // ["rightindexintermediate", "righthandindex2"], 
      // ["rightindexdistal", "righthandindex3"],

      // ["rightmiddleproximal", "righthandmiddle1"], 
      // ["rightmiddleintermediate", "righthandmiddle2"], 
      // ["rightmiddledistal", "righthandmiddle3"], 

      // ["rightringproximal", "righthandring1"], 
      // ["rightringintermediate", "righthandring2"], 
      // ["rightringdistal", "righthandring3"], 

      // ["rightpinkyproximal", "righthandpinky1"], 
      // ["rightpinkyintermediate", "righthandpinky2"], 
      // ["rightpinkydistal", "righthandpinky3"], 
    ];

    function rotate(x: number, y: number, z: number) {
      return new THREE.Euler(THREE.MathUtils.degToRad(x), THREE.MathUtils.degToRad(y), THREE.MathUtils.degToRad(z));
    }

    const rotationOffsets: Record<string, THREE.Euler> = {
      rightshoulder: rotate(-90, 0, 90),
      leftshoulder: rotate(0, 0, -90),
      rightarm: rotate(0, 0, 180),
      rightforearm: rotate(-90, -90, 90),
      righthand: rotate(180, 0, 0),
    };

    function autoMap(bvhRoot: THREE.Object3D, modelRootObj: THREE.Object3D) {
      const modelMap = collectModelBones(modelRootObj);
      const map: Record<string, THREE.Bone | null> = {};
      const bones: THREE.Object3D[] = [];
      bvhRoot.traverse((c) => {
        if ((c as any).isBone || c.type === "Bone") bones.push(c);
      });

      bones.forEach((b) => {
        const bn = normalize(b.name);
        let found: THREE.Bone | undefined = undefined;

        if (modelMap[bn]) found = modelMap[bn];

        if (!found) {
          for (const [bvhToken, glToken] of mixamoAliases) {
            if (bn.includes(bvhToken)) {
              const candidateKey = Object.keys(modelMap).find((k) => k.includes(glToken));
              if (candidateKey) found = modelMap[candidateKey];
            }
          }
        }

        if (!found) {
          const sideless = bn.replace(/^(left|right)|(_left|_right)|(left$|right$)/g, "");
          if (modelMap[sideless]) found = modelMap[sideless];
        }

        if (found) {
          const key = normalize(found.name);
          if (rotationOffsets[key]) {
            const q = new THREE.Quaternion().setFromEuler(rotationOffsets[key]);
            found.quaternion.multiply(q);
          }
        }
        map[b.name] = found || null;
      });

      boneMap = map;

      console.log("Auto-mapped bones:", Object.keys(map).length,"/", bones.length);
      return map;
    }

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      "/Ybot.glb",
      (gltf) => {
        modelRoot = gltf.scene;
        modelRoot.scale.set(1, 1, 1);
        modelRoot.position.set(0, 0, 0);
        scene.add(modelRoot);

        scene.add(new THREE.SkeletonHelper(modelRoot));
        console.log("GLB loaded successfully.");
      },
      undefined,
      (err) => {
        console.warn("Could not load 3D Avatar (Ybot.glb). Displaying raw skeleton instead.", err);
      }
    );

    function buildBVHString(data: any) {
      if (!data || !data.hierarchy || !data.frames) return null;
      const frameCount = data.frames.length;
      const frameTime = sessionDuration && sessionDuration > 0 
            ? sessionDuration / frameCount 
            : 0.033333; 
            
      const motionLines = data.frames.map((f: number[]) => f.join(" ")).join("\n");
      return `${data.hierarchy}
MOTION
Frames: ${frameCount}
Frame Time: ${frameTime}
${motionLines}`;
    }

    const bvhLoader = new BVHLoader();

    try {
      const bvhString = buildBVHString(bvhData);
      if (!bvhString) throw new Error("Invalid BVH data construction");

      const result = bvhLoader.parse(bvhString);
      bvhResultRef.current = result;

      const bvhSkeleton = result.skeleton.bones[0];
      scene.add(bvhSkeleton);

      bvhMixerRef.current = new THREE.AnimationMixer(bvhSkeleton);
      
      if (result.clip) {
        const action = bvhMixerRef.current.clipAction(result.clip);
        action.play();
        setTotalTime(result.clip.duration);
      }

      const checkModel = setInterval(() => {
        if (modelRoot) {
          clearInterval(checkModel);
          gltfMixerRef.current = new THREE.AnimationMixer(modelRoot);
          
          autoMap(result.skeleton.bones[0], modelRoot);
          
          if (bvhSkeletonHelperRef.current) bvhSkeletonHelperRef.current.visible = false;
        }
      }, 500);

      // Stop checking after 10 seconds (give up on model)
      setTimeout(() => clearInterval(checkModel), 10000);

    } catch (e: any) {
      console.error("Error parsing BVH data:", e);
      setError("Failed to process motion data.");
    }

    // ---------- ANIMATION LOOP ----------
    const tmpQ = new THREE.Quaternion();
    const tmpQparent = new THREE.Quaternion();
    const tmpPos = new THREE.Vector3();

    function animate() {
      animationRef.current = requestAnimationFrame(animate);
      
      let delta = clock.getDelta();
      if (delta > 0.1) delta = 0.1; 

      if (!isPlayingRef.current) delta = 0;

      if (bvhMixerRef.current && bvhResultRef.current) {
         bvhMixerRef.current.update(delta);
         
         const action = bvhMixerRef.current.existingAction(bvhResultRef.current.clip);
         if (action) {
             updateCurrentTime(action.time);
         }
      }

      if (bvhResultRef.current && modelRoot) {
        bvhResultRef.current.skeleton.bones.forEach((b: THREE.Object3D) => {
          const target = boneMap[b.name] as THREE.Bone | null | undefined;
          if (!target) return;

          b.getWorldQuaternion(tmpQ);

          const p = target.parent;
          if (p) {
            p.getWorldQuaternion(tmpQparent);
            tmpQparent.invert();
            tmpQ.multiplyQuaternions(tmpQparent, tmpQ);
          }

          const norm = normalize(target.name);
          if (rotationOffsets[norm]) {
            const offsetQ = new THREE.Quaternion().setFromEuler(rotationOffsets[norm]);
            tmpQ.multiply(offsetQ);
          }
          target.quaternion.copy(tmpQ);

          if (b.name.toLowerCase().includes("hips") || b.name.toLowerCase() === "root") {
            b.getWorldPosition(tmpPos);
            
            if (modelRoot!.parent) {
               const local = tmpPos.clone();
               modelRoot!.parent!.worldToLocal(local);
               local.y = 0; // Lock to floor
               modelRoot!.position.copy(local);
            } else {
               modelRoot!.position.copy(tmpPos);
            }
          }
        });

        modelRoot.updateMatrixWorld(true);
      }

      renderer.render(scene, camera);
    }
    
    animate();

    // Resize handling
    const onResize = () => setRendererSize();
    window.addEventListener("resize", onResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      scene.clear();
    };
  }, [bvhData, fixedSize, sessionDuration, updateCurrentTime]);

  const handleSliderChange = (
    _event: Event,
    value: number | number[],
  ) => {
    if (!Array.isArray(value) && bvhMixerRef.current && bvhResultRef.current?.clip) {
      setCurrentTime(value);
  
      const action = bvhMixerRef.current.existingAction(
        bvhResultRef.current.clip
      );
  
      if (action) {
        action.time = value;
        bvhMixerRef.current.update(0); // Force render current frame
      }
    }
  };
  

  const togglePlay = () => {
      isPlayingRef.current = !isPlayingRef.current;
      setPlayingUI(isPlayingRef.current);
  };

  return (
    <div className="flex flex-col w-full">
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-2xl mb-4 text-center">
          {error}
        </div>
      )}
      
      <div
        ref={mountRef}
        className="rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
        style={fixedSize ? { width: "100%", height: "400px" } : { width: "100%", height: "100vh" }}
      />

      {/* Controls Bar */}
      <div className="flex items-center gap-4 mt-4 px-2">
        <button
            onClick={togglePlay}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
                playingUI 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
        >
            {playingUI ? "Pause" : "Play"}
        </button>

        <span className="text-sm font-mono min-w-[60px] text-right">
            {currentTime.toFixed(2)}s
        </span>

        <Slider
            value={currentTime}
            min={0}
            max={totalTime || 10}
            step={0.01}
            onChange={handleSliderChange}
            aria-labelledby="time-slider"
            className="flex-1"
            sx={{
                color: '#2563eb',
                '& .MuiSlider-thumb': {
                    width: 16,
                    height: 16,
                },
            }}
        />

        <span className="text-sm font-mono min-w-[60px]">
            {totalTime.toFixed(2)}s
        </span>
      </div>
    </div>
  );
};

export default BVHViewer;