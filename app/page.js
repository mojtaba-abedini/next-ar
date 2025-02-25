"use client";
import { Canvas } from "@react-three/fiber";
import { XR, createXRStore } from "@react-three/xr";
import { useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useDrag } from "@use-gesture/react";
import { useThree } from "@react-three/fiber";
import { useSpring, a } from "@react-spring/three";

const store = createXRStore();

function Model({ path, position, setPosition, rotation, setRotation }) {
  const { scene } = useGLTF(path); // بارگذاری مدل GLB

  // متحرک‌سازی موقعیت و چرخش با `react-spring`
  const [{ pos, rot }, api] = useSpring(() => ({
    pos: position,
    rot: rotation,
    config: { mass: 1, tension: 200, friction: 20 },
  }));

  // گرفتن دوربین برای حرکت در فضای سه‌بعدی
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  // تابع کشیدن (Drag)
  const bind = useDrag(
    ({ offset: [x, y], first, last }) => {
      if (first) return; // اگر شروع کشیدن بود، کاری نکند
      const newPosition = [x / aspect, position[1], -y / aspect];
      const newRotation = [rotation[0], rotation[1] + 0.1, rotation[2]];

      // مقدار موقعیت و چرخش را در حالت ذخیره کن
      setPosition(newPosition);
      setRotation(newRotation);

      // مقدار را به انیمیشن `react-spring` بده
      api.start({ pos: newPosition, rot: newRotation });
    },
    { pointerEvents: true }
  );

  return (
    <a.primitive object={scene} position={pos} rotation={rot} {...bind()} />
  );
}

export default function App() {
  // مقدار اولیه‌ی موقعیت و چرخش مدل
  const [position, setPosition] = useState([0, 1, -1]);
  const [rotation, setRotation] = useState([0, 0, 0]);

  return (
    <>
      <button onClick={() => store.enterAR()}>Enter AR</button>
      <Canvas>
        <XR store={store}>
          <Model
            path="./cube.glb"
            position={position}
            setPosition={setPosition}
            rotation={rotation}
            setRotation={setRotation}
          />
        </XR>
      </Canvas>
    </>
  );
}
