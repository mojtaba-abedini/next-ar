"use client"

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { XRButton } from 'three/addons/webxr/XRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ARViewer = () => {
    const mountRef = useRef(null);
    const modelRef = useRef(null); // ارجاع به مدل برای تغییر موقعیت
    const [isInAR, setIsInAR] = useState(false); // استیت برای وضعیت AR

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor('#dbeafe');
        mountRef.current.appendChild(renderer.domElement);

        // فعال‌سازی WebXR
        renderer.xr.enabled = true;

        // اضافه کردن دکمه XRButton به صورت دستی برای موبایل
        const xrButton = XRButton.createButton(renderer);
        document.body.appendChild(xrButton);

        // افزودن نور به صحنه
        const light = new THREE.DirectionalLight(0xffffff, 5);
        light.position.set(5, 5, 5).normalize();
        scene.add(light);

        // بارگیری مدل سه‌بعدی
        const loader = new GLTFLoader();
        loader.load('/shirt.glb', (gltf) => {
            modelRef.current = gltf.scene; // ذخیره مدل در ارجاع
            modelRef.current.scale.set(0.05, 0.05, 0.05);  // کاهش مقیاس مدل
            modelRef.current.position.set(0, 0, 0); // مدل را در مرکز صحنه قرار دهید
            scene.add(modelRef.current);
        }, undefined, (error) => {
            console.error('Error loading model:', error);
        });

        // تنظیمات دوربین
        camera.position.set(0, 1.6, 3); // دوربین را در ارتفاع چشم انسان قرار دهید و فاصله‌ی بیشتر از مدل تنظیم کنید
        camera.lookAt(0, 0, 0); // دوربین به مرکز صحنه نگاه کند

        // رویداد شروع session WebXR
        renderer.xr.addEventListener('sessionstart', () => {
            setIsInAR(true); // تغییر استیت به AR
            if (modelRef.current) {
                modelRef.current.position.set(0, 0, -4); // تغییر موقعیت مدل در حالت AR
            }
        });

        // رویداد پایان session WebXR
        renderer.xr.addEventListener('sessionend', () => {
            setIsInAR(false); // تغییر استیت به حالت عادی
            if (modelRef.current) {
                modelRef.current.position.set(0, 0, 0); // بازگرداندن موقعیت مدل به حالت عادی
            }
        });

        // اضافه کردن OrbitControls برای چرخاندن و زوم کردن
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // فعال‌سازی تکسیر برای حرکت نرم دوربین
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false; // جلوگیری از جابجایی در فضای صفحه
        controls.maxPolarAngle = Math.PI / 2; // محدود کردن حرکت دوربین به محدوده 90 درجه
        controls.target.set(0, 0, 0);  // تنظیم مرکز چرخش به موقعیت مدل (0,0,0)

        // انیمیشن و رندر
        renderer.setAnimationLoop(() => {
            controls.update();  // به روز رسانی کنترل‌ها
            renderer.render(scene, camera);
        });

        // تمیزکاری
        return () => {
            renderer.setAnimationLoop(null); // متوقف کردن انیمیشن
            mountRef.current.removeChild(renderer.domElement);
            if (document.body.contains(xrButton)) {
                document.body.removeChild(xrButton);
            }
        };
    }, []);

    return (
        <div ref={mountRef} />
    );
};

export default ARViewer;
