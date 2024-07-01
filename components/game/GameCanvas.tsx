"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as THREE from "three";
import toast from "react-hot-toast";

export default function GameCanvas({
  islandsInfo,
  islandClickedFlag,
  currentPlayerIsland,
  getIslandClicked,
}: {
  islandsInfo: {
    occupiedBy: string;
    coordinates: { x: number; y: number };
  }[];
  islandClickedFlag: boolean;
  currentPlayerIsland: { x: number; y: number };
  getIslandClicked: (x: number, y: number) => void;
}) {
  const [progress, setProgress] = useState<number>(0);
  const [itemsLoaded, setItemsLoaded] = useState<number>(0);
  const [itemsTotal, setItemsTotal] = useState<number>(1);
  const [loadingFlag, setLoadingFlag] = useState<boolean>(false);

  const htmlEleRef = useRef<HTMLDivElement | null>(null);
  const lastToastTime = useRef<number>(0);

  const scene = useRef<THREE.Scene | null>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const camera = useRef<THREE.OrthographicCamera | null>(null);
  const islandPlains = useRef<THREE.Mesh[]>([]);

  const isGrabbing = useRef<boolean>(false);
  const cursorStartPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraMoveDirection = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseSpeedFactor = useRef<number>(0.2);

  // Mounted
  useEffect(() => {
    init();
    window.addEventListener("resize", () => onCanvasResize());

    const htmlEleCopy = htmlEleRef.current;
    return () => {
      if (renderer.current) htmlEleCopy?.removeChild(renderer.current.domElement);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Island clicked watcher, since we want to reset camera and factor
  useEffect(() => {
    if (!camera.current) return;

    if (islandClickedFlag) {
      camera.current.zoom = 0.05;
      camera.current.position.set(currentPlayerIsland.x, currentPlayerIsland.y, 10);
      camera.current.updateProjectionMatrix();

      mouseSpeedFactor.current = 0;
    } else mouseSpeedFactor.current = 0.2;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [islandClickedFlag]);

  function init() {
    if (!htmlEleRef.current) return;

    // Scene
    scene.current = new THREE.Scene();

    // Renderer
    renderer.current = new THREE.WebGLRenderer();
    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.current.setSize(htmlEleRef.current.clientWidth, htmlEleRef.current.clientHeight);
    htmlEleRef.current.appendChild(renderer.current.domElement);

    // Camera
    const aspect = htmlEleRef.current.clientWidth / htmlEleRef.current.clientHeight;
    camera.current = new THREE.OrthographicCamera(-aspect / 2, aspect / 2, 0.5, -0.5, 1, 1000);
    camera.current.zoom = 0.003;
    camera.current.position.set(-htmlEleRef.current.clientWidth / 3, -htmlEleRef.current.clientHeight / 3, 10);
    camera.current.updateProjectionMatrix();
    scene.current.add(camera.current);

    // Loading manager
    const manager = new THREE.LoadingManager();
    manager.onProgress = (_url, loaded, total) => {
      setProgress((loaded / total) * 100);
      setItemsLoaded(loaded);
      setItemsTotal(total);

      if (loaded / total === 1)
        setTimeout(() => {
          setLoadingFlag(true);
        }, 1000);
    };

    // Generate Ocean
    const oceanTexture = new THREE.TextureLoader(manager).load("/image/ocean/ocean.png");
    oceanTexture.colorSpace = "srgb";
    oceanTexture.wrapS = THREE.RepeatWrapping;
    oceanTexture.wrapT = THREE.RepeatWrapping;
    oceanTexture.repeat.set(100, 100);
    const oceanMat = new THREE.MeshBasicMaterial({ map: oceanTexture, side: THREE.DoubleSide });
    const oceanGeo = new THREE.PlaneGeometry(htmlEleRef.current.clientWidth, htmlEleRef.current.clientHeight);
    const oceanPlain = new THREE.Mesh(oceanGeo, oceanMat);
    scene.current.add(oceanPlain);

    // Generate Islands
    islandsInfo.map(({ coordinates }) => {
      if (!htmlEleRef.current) return;

      const islandTexture = new THREE.TextureLoader(manager).load("/image/ocean/Main_Island.png");
      islandTexture.colorSpace = "srgb";
      const islandMat = new THREE.MeshBasicMaterial({ map: islandTexture, transparent: false, alphaTest: 0.8 });
      const islandGeo = new THREE.PlaneGeometry(10, 10);
      const islandPlain = new THREE.Mesh(islandGeo, islandMat);
      islandPlain.position.set(
        coordinates.x - htmlEleRef.current.clientWidth / 2,
        coordinates.y - htmlEleRef.current.clientHeight / 2,
        0
      );
      islandPlains.current.push(islandPlain);
      scene.current?.add(islandPlain);
    });

    animate();
  }

  function animate() {
    if (!scene.current || !camera.current) return;

    camera.current.position.x += cameraMoveDirection.current.x * mouseSpeedFactor.current;
    camera.current.position.y += cameraMoveDirection.current.y * mouseSpeedFactor.current;
    renderer.current?.render(scene.current, camera.current);
    requestAnimationFrame(animate);
  }

  function onCanvasResize() {
    if (!camera.current || !htmlEleRef.current) return;

    renderer.current?.setSize(htmlEleRef.current.clientWidth, htmlEleRef.current.clientHeight);
    const aspect = htmlEleRef.current.clientWidth / htmlEleRef.current.clientHeight;

    camera.current.left = -aspect / 2;
    camera.current.right = aspect / 2;
    camera.current.top = 0.5;
    camera.current.bottom = -0.5;
    camera.current.updateProjectionMatrix();
  }

  // This function is used to click island
  function handleClickCanvas(e: any) {
    if (!camera.current || !htmlEleRef.current) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);

    raycaster.setFromCamera(mouse, camera.current);
    const intersects = raycaster.intersectObjects(islandPlains.current);

    if (intersects.length > 0) getIslandClicked(intersects[0].object.position.x, intersects[0].object.position.y);
  }

  function handleDragCanvas(e: any) {
    if (!camera.current || !htmlEleRef.current) return;

    const deltaX = e.clientX - cursorStartPosition.current.x;
    const deltaY = e.clientY - cursorStartPosition.current.y;

    cursorStartPosition.current.x = e.clientX;
    cursorStartPosition.current.y = e.clientY;

    const newX = camera.current.position.x - (deltaX * 1.5) / (camera.current.zoom * htmlEleRef.current.clientWidth);
    const newY = camera.current.position.y + (deltaY * 1.5) / (camera.current.zoom * htmlEleRef.current.clientHeight);

    if (Math.abs(newX) >= htmlEleRef.current.clientWidth / 3 || Math.abs(newY) >= htmlEleRef.current.clientHeight / 3) {
      const now = Date.now();
      if (now - lastToastTime.current >= 5000) {
        toast.error("Boundary reached!");
        lastToastTime.current = now;
      }
      return;
    }

    camera.current.position.x = newX;
    camera.current.position.y = newY;
  }

  function handleMouseMove(e: any) {
    if (!htmlEleRef.current) return;

    if (isGrabbing.current) handleDragCanvas(e);

    // Edge scroll
    // else {
    //   const awayFromEdge = 10;

    //   if (e.clientX < awayFromEdge) cameraMoveDirection.current.x = -1 + (e.clientX / awayFromEdge - 1);
    //   else if (e.clientX > htmlEleRef.current.clientWidth - awayFromEdge)
    //     cameraMoveDirection.current.x = 1 - ((htmlEleRef.current.clientWidth - e.clientX) / awayFromEdge - 1);
    //   else cameraMoveDirection.current.x = 0;

    //   if (e.clientY < awayFromEdge) cameraMoveDirection.current.y = 1 - e.clientY / awayFromEdge;
    //   else if (e.clientY > htmlEleRef.current.clientHeight - awayFromEdge)
    //     cameraMoveDirection.current.y = -1 + (htmlEleRef.current.clientHeight - e.clientY) / awayFromEdge;
    //   else cameraMoveDirection.current.y = 0;
    // }
  }

  function handleScrollCanvas(e: any) {
    if (!camera.current || !htmlEleRef.current) return;

    const zoomSpeed = 0.002;

    if (e.deltaY > 0 && camera.current.zoom > 0.003) camera.current.zoom -= zoomSpeed;
    else if (e.deltaY < 0 && camera.current.zoom < 0.1) camera.current.zoom += zoomSpeed;

    camera.current.updateProjectionMatrix();
  }

  return (
    <div
      className={`w-screen h-screen relative cursor-grab active:cursor-grabbing ${
        !(progress === 100 && loadingFlag) ? "z-40" : "z-0"
      }`}
      ref={htmlEleRef}
      onClick={handleClickCanvas}
      onMouseDown={(e) => {
        isGrabbing.current = true;
        cursorStartPosition.current.x = e.clientX;
        cursorStartPosition.current.y = e.clientY;
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={() => (isGrabbing.current = false)}
      onWheel={handleScrollCanvas}
    >
      {/* Progress curtain */}
      {!(progress === 100 && loadingFlag) && (
        <div className="absolute w-screen h-screen bg-[url('https://hackmd.io/_uploads/H1yiNQVkA.jpg')] bg-center bg-no-repeat bg-[length:100%_100%] flex justify-center items-center">
          <div className="absolute w-screen h-screen top-0 left-0 bg-black/50 z-0" />

          <div className="relative w-1/2 text-center z-40">
            <p className="text-lg text-white mb-2">
              Loading... {itemsLoaded} / {itemsTotal}
            </p>

            <div className="flex justify-center items-center bg-frame-progress bg-center bg-no-repeat bg-[length:100%_100%] h-12 overflow-hidden rounded-full overflow-hidden z-40">
              <div className="w-[92%]">
                <Image
                  src="/image/progress/progress.png"
                  alt="progress-bar"
                  className="transition-[width] duration-1000 ease-in-out h-3"
                  style={{ width: `${progress}%` }}
                  width={1000}
                  height={10}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
