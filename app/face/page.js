"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function ARGlasses() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const glassesRef = useRef(null);

  useEffect(() => {
    let faceMeshInstance;
    let cameraInstance;
    
    const loadFaceMesh = async () => {
      const { FaceMesh } = await import("@mediapipe/face_mesh");
      const { Camera } = await import("@mediapipe/camera_utils");
      const { drawConnectors, FACEMESH_FACE_OVAL } = await import("@mediapipe/drawing_utils");

      if (!videoRef.current || !canvasRef.current) return;
      const canvasCtx = canvasRef.current.getContext("2d");

      // 🟢 تنظیمات FaceMesh
      const onResults = (results) => {
        if (!canvasCtx || !results.image) return;

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

        if (results.multiFaceLandmarks) {
          for (const landmarks of results.multiFaceLandmarks) {
            drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, { color: "#E0E0E0" });

            if (glassesRef.current) {
              const nose = landmarks[1]; // نقطه بینی
              glassesRef.current.position.set(nose.x * 2 - 1, -nose.y * 2 + 1, -2);
            }
          }
        }
        canvasCtx.restore();
      };

      faceMeshInstance = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMeshInstance.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMeshInstance.onResults(onResults);

      cameraInstance = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceMeshInstance.send({ image: videoRef.current });
        },
        width: 1280,
        height: 720,
      });

      cameraInstance.start();
    };

    const setupThreeJS = () => {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0, 2);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const light = new THREE.AmbientLight(0xffffff, 1);
      scene.add(light);

      const loader = new GLTFLoader();
      loader.load("/glasses.glb", (gltf) => {
        const glasses = gltf.scene;
        glasses.scale.set(0.5, 0.5, 0.5);
        scene.add(glasses);
        glassesRef.current = glasses;
      });

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();
    };

    loadFaceMesh();
    setupThreeJS();

    return () => {
      if (faceMeshInstance) faceMeshInstance.close();
      if (cameraInstance) cameraInstance.stop();
      if (rendererRef.current) document.body.removeChild(rendererRef.current.domElement);
    };
  }, []);

  return (
    <div className="relative">
      <video ref={videoRef} className="absolute w-full h-auto" autoPlay playsInline />
      <canvas ref={canvasRef} className="absolute w-full h-auto" />
    </div>
  );
}
