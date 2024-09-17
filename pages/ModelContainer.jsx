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
  const [loadingError, setLoadingError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current || !modelUrls || Object.keys(modelUrls).length === 0) {
      setLoadingError("No model URLs provided");
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add point light for glow effect
    const glowLight = new THREE.PointLight(0x00ff00, 1, 100);
    glowLight.position.set(0, 0, 0);
    scene.add(glowLight);
    glowLightRef.current = glowLight;

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

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
            child.material.envMapIntensity = 1.5;
            child.material.needsUpdate = true;
          }
        });

        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        gltf.scene.position.sub(center);

        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        const scaleFactor = 5.0;
        gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Adjust glow light based on model size
        glowLight.position.set(0, 0, 0);
        glowLight.distance = maxDim * 3;
        glowLight.intensity = 0.5;

        const gridSize = maxDim * 15;
        const divisions = 20;
        const gridHelper = new THREE.GridHelper(gridSize, divisions, 0x0000ff, 0x00FF00);
        gridHelper.position.y = -maxDim / 3;
        gridHelper.material.opacity = 0.5;
        gridHelper.material.transparent = true;
        gridHelper.visible = true;
        scene.add(gridHelper);
        gridRef.current = gridHelper;

        const distance = maxDim * 4;
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

    const animate = () => {
      requestAnimationFrame(animate);
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
      renderer.dispose();
      controls.dispose();
    };
  }, [modelUrls, onError]);

  if (loadingError) {
    return <div>Error: {loadingError}</div>;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          fontSize: '24px'
        }}>
          Loading...
        </div>
      )}
    </div>
  );
}