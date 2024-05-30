"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GameCanvas({
  islandsInfo,
  islandClickedFlag,
  getIslandClicked,
}: {
  islandsInfo: {
    occupiedBy: string;
    coordinates: { x: any; y: any };
  }[];
  islandClickedFlag: boolean;
  getIslandClicked: (x: number, y: number) => void;
}) {
  const htmlEleRef = useRef<HTMLDivElement | null>(null);

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
      camera.current.position.set(0, 0, 10);
      mouseSpeedFactor.current = 0;
    } else mouseSpeedFactor.current = 0.2;
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
    camera.current.zoom = 0.05;
    camera.current.position.set(50, 50, 10);
    camera.current.updateProjectionMatrix();
    scene.current.add(camera.current);

    // Generate Ocean
    const oceanTexture = new THREE.TextureLoader().load("/image/ocean/oceanTemplateMVP_version.png");
    oceanTexture.wrapS = THREE.RepeatWrapping;
    oceanTexture.wrapT = THREE.RepeatWrapping;
    oceanTexture.repeat.set(100, 100);
    const oceanMat = new THREE.MeshBasicMaterial({ map: oceanTexture, side: THREE.DoubleSide });
    const oceanGeo = new THREE.PlaneGeometry(htmlEleRef.current.clientWidth, htmlEleRef.current.clientHeight);
    const oceanPlain = new THREE.Mesh(oceanGeo, oceanMat);
    scene.current.add(oceanPlain);

    // Generate Islands
    islandsInfo.map(({ coordinates }) => {
      const islandTexture = new THREE.TextureLoader().load("/image/ocean/Main_Island.png");
      const islandMat = new THREE.MeshBasicMaterial({ map: islandTexture, transparent: false, alphaTest: 0.8 });
      const islandGeo = new THREE.PlaneGeometry(10, 10);
      const islandPlain = new THREE.Mesh(islandGeo, islandMat);
      islandPlain.position.set(coordinates.x, coordinates.y, 0);
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

    camera.current.position.x -= (deltaX * 30) / htmlEleRef.current.clientWidth;
    camera.current.position.y += (deltaY * 30) / htmlEleRef.current.clientHeight;

    cursorStartPosition.current.x = e.clientX;
    cursorStartPosition.current.y = e.clientY;
  }

  function handleMouseMove(e: any) {
    if (!htmlEleRef.current) return;

    if (isGrabbing.current) handleDragCanvas(e);
    else {
      const awayFromEdge = 10;

      if (e.clientX < awayFromEdge) cameraMoveDirection.current.x = -1 + (e.clientX / awayFromEdge - 1);
      else if (e.clientX > htmlEleRef.current.clientWidth - awayFromEdge)
        cameraMoveDirection.current.x = 1 - ((htmlEleRef.current.clientWidth - e.clientX) / awayFromEdge - 1);
      else cameraMoveDirection.current.x = 0;

      if (e.clientY < awayFromEdge) cameraMoveDirection.current.y = 1 - e.clientY / awayFromEdge;
      else if (e.clientY > htmlEleRef.current.clientHeight - awayFromEdge)
        cameraMoveDirection.current.y = -1 + (htmlEleRef.current.clientHeight - e.clientY) / awayFromEdge;
      else cameraMoveDirection.current.y = 0;
    }
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
      className="w-screen h-screen cursor-grab active:cursor-grabbing"
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
    />
  );
}
