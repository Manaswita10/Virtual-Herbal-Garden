import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function ModelContainer({ modelUrls, onError }) {
 const containerRef = useRef(null);
 const sceneRef = useRef(null);
 const rendererRef = useRef(null);
 const cameraRef = useRef(null);
 const controlsRef = useRef(null);
 const gridRef = useRef(null);
 const modelRef = useRef(null);
 const glowLightRef = useRef(null);
 const particleSystemRef = useRef(null);
 const lightBeamsRef = useRef([]);
 const [loadingError, setLoadingError] = useState(null);
 const [isLoading, setIsLoading] = useState(true);
 const animationFrameId = useRef(null);

 useEffect(() => {
   if (!containerRef.current || !modelUrls || Object.keys(modelUrls).length === 0) {
     setLoadingError("No model URLs provided");
     return;
   }

   // Scene Setup
   const scene = new THREE.Scene();
   scene.background = new THREE.Color(0x0a0a0a);
   scene.fog = new THREE.FogExp2(0x0a0a0a, 0.01);
   sceneRef.current = scene;

   // Camera Setup
   const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
   cameraRef.current = camera;

   // Renderer Setup
   const renderer = new THREE.WebGLRenderer({ 
     antialias: true,
     alpha: true,
   });
   renderer.setPixelRatio(window.devicePixelRatio);
   renderer.toneMapping = THREE.ACESFilmicToneMapping;
   renderer.toneMappingExposure = 1.2;
   renderer.shadowMap.enabled = true;
   renderer.shadowMap.type = THREE.PCFSoftShadowMap;
   rendererRef.current = renderer;

   const updateRendererSize = () => {
     const container = containerRef.current;
     if (container) {
       const width = container.clientWidth;
       const height = container.clientHeight;
       renderer.setSize(width, height);
       camera.aspect = width / height;
       camera.updateProjectionMatrix();
     }
   };

   updateRendererSize();
   containerRef.current.appendChild(renderer.domElement);

   // Enhanced Lighting Setup
   const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
   scene.add(ambientLight);

   // Key Light
   const keyLight = new THREE.DirectionalLight(0xffffff, 1);
   keyLight.position.set(5, 5, 5);
   keyLight.castShadow = true;
   keyLight.shadow.mapSize.width = 2048;
   keyLight.shadow.mapSize.height = 2048;
   keyLight.shadow.camera.near = 0.5;
   keyLight.shadow.camera.far = 500;
   scene.add(keyLight);

   // Fill Light
   const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
   fillLight.position.set(-5, 5, -5);
   scene.add(fillLight);

   // Back Light
   const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
   backLight.position.set(0, -5, -5);
   scene.add(backLight);

   // Rim Light with green tint
   const rimLight = new THREE.DirectionalLight(0x00ff00, 0.2);
   rimLight.position.set(0, 3, -5);
   scene.add(rimLight);

   // Glow Light
   const glowLight = new THREE.PointLight(0x00ff00, 1, 100);
   glowLight.position.set(0, 0, 0);
   scene.add(glowLight);
   glowLightRef.current = glowLight;

   // Enhanced Particle System
   const particlesGeometry = new THREE.BufferGeometry();
   const particleCount = 1000;
   const positions = new Float32Array(particleCount * 3);

   for(let i = 0; i < particleCount * 3; i += 3) {
     positions[i] = (Math.random() - 0.5) * 50;
     positions[i + 1] = (Math.random() - 0.5) * 50;
     positions[i + 2] = (Math.random() - 0.5) * 50;
   }

   particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
   const particlesMaterial = new THREE.PointsMaterial({
     color: 0x00ff00,
     size: 0.05,
     transparent: true,
     opacity: 0.3,
     blending: THREE.AdditiveBlending
   });

   const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
   scene.add(particleSystem);
   particleSystemRef.current = particleSystem;

   // Light Beams
   const createLightBeam = (position, rotation) => {
     const cylinderGeometry = new THREE.CylinderGeometry(0.05, 0.05, 20, 32);
     const volumetricMaterial = new THREE.MeshBasicMaterial({
       color: 0x00ff00,
       transparent: true,
       opacity: 0.05,
       blending: THREE.AdditiveBlending
     });
     const lightBeam = new THREE.Mesh(cylinderGeometry, volumetricMaterial);
     lightBeam.position.copy(position);
     lightBeam.rotation.copy(rotation);
     scene.add(lightBeam);
     return lightBeam;
   };

   const beams = [];
   for (let i = 0; i < 4; i++) {
     const angle = (i / 4) * Math.PI * 2;
     const position = new THREE.Vector3(
       Math.cos(angle) * 10,
       0,
       Math.sin(angle) * 10
     );
     const rotation = new THREE.Euler(0, angle, 0);
     beams.push(createLightBeam(position, rotation));
   }
   lightBeamsRef.current = beams;

   // Controls Setup
   const controls = new OrbitControls(camera, renderer.domElement);
   controlsRef.current = controls;
   controls.enableDamping = true;
   controls.dampingFactor = 0.05;
   controls.enableZoom = true;
   controls.autoRotate = true;
   controls.autoRotateSpeed = 0.5;

   // Model Loading
   const loader = new GLTFLoader();
   const gltfUrl = Object.entries(modelUrls).find(([key]) => key.endsWith('.gltf'));

   if (!gltfUrl) {
     setLoadingError("No GLTF file found in provided URLs");
     return;
   }

   const manager = new THREE.LoadingManager();
   manager.setURLModifier((url) => {
     const fileName = url.split('/').pop();
     const matchingUrl = Object.entries(modelUrls).find(([key]) => key.includes(fileName));
     return matchingUrl ? matchingUrl[1] : url;
   });

   loader.manager = manager;

   loader.load(
     gltfUrl[1],
     (gltf) => {
       modelRef.current = gltf.scene;
       scene.add(gltf.scene);

       gltf.scene.traverse((child) => {
         if (child.isMesh) {
           child.material.envMapIntensity = 2;
           child.castShadow = true;
           child.receiveShadow = true;
           child.material.needsUpdate = true;
           
           if (child.material) {
             child.material.roughness = 0.5;
             child.material.metalness = 0.5;
           }
         }
       });

       const box = new THREE.Box3().setFromObject(gltf.scene);
       const center = box.getCenter(new THREE.Vector3());
       gltf.scene.position.sub(center);

       const size = box.getSize(new THREE.Vector3());
       const maxDim = Math.max(size.x, size.y, size.z);
       const scaleFactor = 5.0;
       gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);

       // Adjust glow light
       glowLight.position.set(0, 0, 0);
       glowLight.distance = maxDim * 3;
       glowLight.intensity = 0.8;

       // Enhanced Grid
       const gridSize = maxDim * 15;
       const divisions = 30;
       const mainGridColor = 0x0055ff;
       const secondaryGridColor = 0x00ff44;
       
       // Main Grid
       const gridHelper = new THREE.GridHelper(gridSize, divisions, mainGridColor, secondaryGridColor);
       gridHelper.position.y = -maxDim / 3;
       gridHelper.material.opacity = 0.3;
       gridHelper.material.transparent = true;
       gridHelper.material.blending = THREE.AdditiveBlending;
       scene.add(gridHelper);

       // Secondary Grid
       const secondaryGrid = new THREE.GridHelper(gridSize * 0.5, divisions / 2, mainGridColor, secondaryGridColor);
       secondaryGrid.position.y = -maxDim / 3 + 0.1;
       secondaryGrid.material.opacity = 0.15;
       secondaryGrid.material.transparent = true;
       secondaryGrid.material.blending = THREE.AdditiveBlending;
       scene.add(secondaryGrid);

       gridRef.current = [gridHelper, secondaryGrid];

       // Camera Position
       const distance = maxDim * 3;
       camera.position.set(distance, distance, distance);
       camera.lookAt(0, 0, 0);
       controls.target.set(0, 0, 0);

       setIsLoading(false);
     },
     undefined,
     (error) => {
       console.error('Error loading 3D model:', error);
       setLoadingError(`Failed to load 3D model: ${error.message}`);
       setIsLoading(false);
       if (onError) onError(error);
     }
   );

   // Animation Loop
   const animate = () => {
     animationFrameId.current = requestAnimationFrame(animate);

     if (particleSystemRef.current) {
       particleSystemRef.current.rotation.y += 0.0003;
     }

     if (glowLightRef.current) {
       glowLightRef.current.intensity = 0.8 + Math.sin(Date.now() * 0.001) * 0.2;
     }

     lightBeamsRef.current.forEach((beam, index) => {
       beam.rotation.y += 0.005 * (index % 2 ? 1 : -1);
       beam.material.opacity = 0.05 + Math.sin(Date.now() * 0.001 + index) * 0.02;
     });

     controls.update();
     renderer.render(scene, camera);
   };

   animate();

   const handleResize = () => {
     updateRendererSize();
   };

   window.addEventListener('resize', handleResize);

   return () => {
     window.removeEventListener('resize', handleResize);
     if (containerRef.current && renderer.domElement) {
       containerRef.current.removeChild(renderer.domElement);
     }
     if (animationFrameId.current) {
       cancelAnimationFrame(animationFrameId.current);
     }
     scene.clear();
     renderer.dispose();
     controls.dispose();
   };
 }, [modelUrls, onError]);

 return (
   <div style={{ position: 'relative', width: '100%', height: '100%' }}>
     <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
     {isLoading && (
       <div className="loading-overlay">
         <div className="loading-content">
           <div className="loading-spinner" />
           <div className="loading-text">Loading Model...</div>
         </div>
         <style jsx>{`
           .loading-overlay {
             position: absolute;
             top: 0;
             left: 0;
             width: 100%;
             height: 100%;
             display: flex;
             justify-content: center;
             align-items: center;
             background: radial-gradient(circle, rgba(0,50,0,0.9) 0%, rgba(0,0,0,0.95) 100%);
             color: #00ff00;
           }
           .loading-content {
             display: flex;
             flex-direction: column;
             align-items: center;
             gap: 20px;
           }
           .loading-spinner {
             width: 50px;
             height: 50px;
             border: 3px solid rgba(0, 255, 0, 0.1);
             border-top-color: #00ff00;
             border-radius: 50%;
             animation: spin 1s linear infinite;
           }
           .loading-text {
             font-size: 24px;
             font-family: monospace;
             text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
           }
           @keyframes spin {
             to { transform: rotate(360deg); }
           }
         `}</style>
       </div>
     )}
     {loadingError && (
       <div className="error-container">
         <div className="error-message">
           Error: {loadingError}
         </div>
         <style jsx>{`
           .error-container {
             display: flex;
             justify-content: center;
             align-items: center;
             height: 100%;
             color: #ff0000;
             background: rgba(0, 0, 0, 0.8);
             padding: 20px;
             border-radius: 10px;
             text-align: center;
           }
           .error-message {
             font-size: 18px;
             font-family: monospace;
           }
         `}</style>
       </div>
     )}
   </div>
 );
}