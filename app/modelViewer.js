"use client";
import "@google/model-viewer";

const ModelViewer = ({ src, alt, ar = true, autoRotate = true, cameraControls = true }) => {
  return (
    <model-viewer
      src={src}
      alt={alt}
      ar={ar}
      ar-modes="webxr scene-viewer quick-look"
      camera-controls={cameraControls}
      auto-rotate={autoRotate}
      shadow-intensity="1"
      style={{ width: "100%", height: "500px" }}
    ></model-viewer>
  );
};

export default ModelViewer;
