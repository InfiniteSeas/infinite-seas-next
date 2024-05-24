"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GameCanvas({
  islandClickedFlag,
  getIslandClicked,
}: {
  islandClickedFlag: boolean;
  getIslandClicked: () => void;
}) {
  const htmlEleRef = useRef<HTMLDivElement | null>(null);

  const scene = useRef<THREE.Scene | null>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const camera = useRef<THREE.OrthographicCamera | null>(null);
  const islandPlains = useRef<THREE.Mesh[]>([]);

  const lastMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraMoveDirection = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseSpeedFactor = useRef<number>(0.03);

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
    if (islandClickedFlag) {
      mouseSpeedFactor.current = 0;
      camera.current?.position.set(0, 0, 5);
    } else mouseSpeedFactor.current = 0.03;
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
    camera.current.position.set(0, 0, 5);

    // Generate Ocean
    const oceanTexture = new THREE.TextureLoader().load("/image/Ocean/OceanTemplateMVP_version.png");
    oceanTexture.wrapS = THREE.RepeatWrapping;
    oceanTexture.wrapT = THREE.RepeatWrapping;
    oceanTexture.repeat.set(100, 100);

    const oceanGeo = new THREE.PlaneGeometry(
      htmlEleRef.current.clientWidth / 10,
      htmlEleRef.current.clientHeight / 10,
      1,
      1
    );
    const oceanMat = new THREE.MeshBasicMaterial({ map: oceanTexture, side: THREE.DoubleSide });
    const oceanPlain = new THREE.Mesh(oceanGeo, oceanMat);
    scene.current?.add(oceanPlain);

    // Generate Island
    const islandTexture = new THREE.TextureLoader().load("/image/Ocean/Main_Island.png");
    const islandMat = new THREE.MeshBasicMaterial({ map: islandTexture, transparent: false, alphaTest: 0.8 });
    const islandGeo = new THREE.PlaneGeometry(0.5, 0.5);
    const islandPlain = new THREE.Mesh(islandGeo, islandMat);
    islandPlain.position.set(0, 0, 0);
    islandPlains.current.push(islandPlain);
    scene.current?.add(islandPlain);

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

    if (intersects.length > 0) getIslandClicked();
  }

  function handleDragCanvas(e: any) {
    console.log(234456);
    if (!camera.current || !htmlEleRef.current) return;

    let deltaX = e.clientX - lastMousePosition.current.x;
    let deltaY = e.clientY - lastMousePosition.current.y;

    camera.current.position.x -= deltaX / htmlEleRef.current.clientWidth;
    camera.current.position.y += deltaY / htmlEleRef.current.clientHeight;

    lastMousePosition.current.x = e.clientX;
    lastMousePosition.current.y = e.clientY;
  }

  function handleScrollCanvas(e: any) {
    if (!camera.current || !htmlEleRef.current) return;

    let zoomSpeed = 0.1;

    if (e.deltaY > 0) camera.current.zoom -= zoomSpeed;
    else if (e.deltaY < 0) camera.current.zoom += zoomSpeed;

    let minZoom = Math.min(htmlEleRef.current.clientWidth / htmlEleRef.current.clientHeight);
    let maxZoom = 2;

    camera.current.zoom = Math.max(minZoom, Math.min(maxZoom, camera.current.zoom));
    camera.current.updateProjectionMatrix();
  }

  function handleMouseMove(e: any) {
    if (!htmlEleRef.current) return;

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

  return (
    <div
      className="w-screen h-screen"
      draggable
      ref={htmlEleRef}
      onClick={handleClickCanvas}
      onDrag={handleDragCanvas}
      onWheel={handleScrollCanvas}
      onMouseMove={handleMouseMove}
    />
  );
}
