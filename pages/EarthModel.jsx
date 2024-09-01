import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const EarthModel = () => {
  const mountRef = useRef(null);
  const [error, setError] = useState(null);
  const [labels, setLabels] = useState([]);
  const earthRef = useRef(null);
  const isUserInteractingRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setError('WebGL is not supported in your browser.');
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    let frameId;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      canvas: mountRef.current,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    camera.position.z = 5;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.minDistance = 3;
    controls.maxDistance = 10;

    controls.addEventListener('start', () => {
      isUserInteractingRef.current = true;
    });

    controls.addEventListener('end', () => {
      isUserInteractingRef.current = false;
    });

    const continents = [
      { name: 'North America', lat: 40, lon: -100, path: '/NorthAmerica' },
      { name: 'South America', lat: -15, lon: -60, path: '/SouthAmerica' },
      { name: 'Europe', lat: 50, lon: 10, path: '/Europe' },
      { name: 'Africa', lat: 0, lon: 20, path: '/Africa' },
      { name: 'Asia', lat: 35, lon: 100, path: '/Asia' },
      { name: 'Australia', lat: -25, lon: 135, path: '/Australia' }
    ];

    const latLonToVector3 = (lat, lon, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = (radius * Math.sin(phi) * Math.sin(theta));
      const y = (radius * Math.cos(phi));
      return new THREE.Vector3(x, y, z);
    };

    const updateLabelPositions = () => {
      if (!earthRef.current) return;

      const labelData = continents.map(continent => {
        const position = latLonToVector3(continent.lat, continent.lon, 1.55);
        const vector = position.clone();
        vector.applyMatrix4(earthRef.current.matrixWorld);
        vector.project(camera);
        const x = (vector.x * 0.5 + 0.5) * width;
        const y = (-vector.y * 0.5 + 0.5) * height;
        return { ...continent, x, y };
      });
      setLabels(labelData);
    };

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      if (earthRef.current && !isUserInteractingRef.current) {
        earthRef.current.rotation.y += 0.005;
      }

      controls.update();
      renderer.render(scene, camera);
      updateLabelPositions();
    };

    const loader = new GLTFLoader();
    loader.load(
      '/scene.gltf',
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.5, 1.5, 1.5);
        model.traverse((child) => {
          if (child.isMesh) {
            child.material.color.multiplyScalar(1.2);
            child.material.emissive = new THREE.Color(0x112244);
            child.material.emissiveIntensity = 0.2;
          }
        });
        scene.add(model);
        earthRef.current = model;
        
        addLocationPins(model);
        animate(); // Start the animation loop after the model is loaded
      },
      undefined,
      (error) => setError('An error occurred loading the 3D model: ' + error.message)
    );

    const addLocationPins = (earthModel) => {
      const textureLoader = new THREE.TextureLoader();
      const pinTexture = textureLoader.load('/assets/pin.png', () => {
        continents.forEach(continent => {
          const spriteMaterial = new THREE.SpriteMaterial({ map: pinTexture, color: 0xffffff });
          const sprite = new THREE.Sprite(spriteMaterial);
          sprite.scale.set(0.2, 0.2, 0.2);
          const position = latLonToVector3(continent.lat, continent.lon, 1.55);
          sprite.position.copy(position);
          earthModel.add(sprite);
        });
      });
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('start', () => {});
      controls.removeEventListener('end', () => {});
      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  const handleContinentClick = (path) => {
    router.push(path);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      backgroundImage: 'url("/assets/forest1.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <canvas ref={mountRef} style={{ width: '100%', height: '100%' }} />
      {labels.map((label, index) => (
        <div
          key={index}
          onClick={() => handleContinentClick(label.path)}
          style={{
            position: 'absolute',
            left: `${label.x}px`,
            top: `${label.y}px`,
            color: 'white',
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            textShadow: '1px 1px 1px black',
            padding: '5px',
            borderRadius: '3px',
            transform: 'translate(-50%, -50%)',
            cursor: 'pointer',
          }}
        >
          {label.name}
        </div>
      ))}
    </div>
  );
};

export default EarthModel;