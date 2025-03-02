"use client";

import { useEffect, useRef } from "react";

export default function ARGlasses() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let faceMeshInstance;
    let cameraInstance;

    const loadFaceMesh = async () => {
      const { FaceMesh } = await import("@mediapipe/face_mesh");
      const { Camera } = await import("@mediapipe/camera_utils");
      const {
        drawConnectors,
        FACEMESH_TESSELATION,
        FACEMESH_RIGHT_EYE,
        FACEMESH_RIGHT_EYEBROW,
        FACEMESH_RIGHT_IRIS,
        FACEMESH_LEFT_EYE,
        FACEMESH_LEFT_EYEBROW,
        FACEMESH_LEFT_IRIS,
        FACEMESH_FACE_OVAL,
        FACEMESH_LIPS,
      } = await import("@mediapipe/drawing_utils");

      if (!videoRef.current || !canvasRef.current) return;
      const canvasCtx = canvasRef.current.getContext("2d");

      const onResults = (results) => {
        if (!canvasCtx || !results.image) return;

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

        if (results.multiFaceLandmarks) {
          for (const landmarks of results.multiFaceLandmarks) {
            drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, { color: "#C0C0C070", lineWidth: 1 });
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, { color: "#FF3030" });
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, { color: "#FF3030" });
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, { color: "#FF3030" });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, { color: "#30FF30" });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, { color: "#30FF30" });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, { color: "#30FF30" });
            drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, { color: "#E0E0E0" });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, { color: "#E0E0E0" });
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

    loadFaceMesh();

    return () => {
      if (faceMeshInstance) faceMeshInstance.close();
      if (cameraInstance) cameraInstance.stop();
    };
  }, []);

  return (
    <div className="relative">
      <video ref={videoRef} className="absolute w-full h-auto" autoPlay playsInline />
      <canvas ref={canvasRef} className="absolute w-full h-auto" />
    </div>
  );
}
