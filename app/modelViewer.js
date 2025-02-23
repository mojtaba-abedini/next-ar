"use client";

import "@google/model-viewer";

const ModelViewer = () => {
  return (
    <model-viewer
      src="/cube.glb"
      ar
      ar-modes="webxr scene-viewer quick-look"
      camera-controls
      auto-rotate
      shadow-intensity="1"
      style={{ width: "100%", height: "500px" }}
    >
    </model-viewer>
  );
};

export default ModelViewer;
