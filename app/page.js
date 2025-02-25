"use client";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";

// بارگذاری مدل فقط در مرورگر
const ModelViewer = dynamic(() => import("./modelViewer"), { ssr: false });

const CameraPage = () => {
  const [streaming, setStreaming] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const videoRef = useRef(null);

  const openCamera = async () => {
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // استفاده از دوربین پشت
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreaming(true);
        }
      } catch (error) {
        console.error("دسترسی به دوربین امکان‌پذیر نیست:", error);
      }
    } else {
      console.error("API getUserMedia در این مرورگر پشتیبانی نمی‌شود.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>واقعیت افزوده (AR)</h1>

      {!streaming && (
        <button onClick={openCamera} style={{ padding: "10px 20px", fontSize: "16px" }}>
          فعال‌سازی دوربین (پشت)
        </button>
      )}

      {streaming && !showModel && (
        <button
          onClick={() => setShowModel(true)}
          style={{ padding: "10px 20px", fontSize: "16px", marginTop: "20px" }}
        >
          نمایش مدل سه‌بعدی در AR
        </button>
      )}

      {showModel && <ModelViewer src="/cube.glb" alt="مدل سه‌بعدی" />}

      <div style={{ marginTop: "20px" }}>
        <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxWidth: "500px" }}></video>
      </div>
    </div>
  );
};

export default CameraPage;
