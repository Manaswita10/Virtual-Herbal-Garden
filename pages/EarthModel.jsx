import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import '/pages/styles/EarthBackground.css';

const EarthModel = () => {
  const mountRef = useRef(null);
  const [error, setError] = useState(null);
  const [labels, setLabels] = useState([]);
  const earthRef = useRef(null);
  const isUserInteractingRef = useRef(false);
  const controlsRef = useRef(null);
  const targetZoomRef = useRef(5);
  const currentZoomRef = useRef(5);
  const router = useRouter();

  useEffect(() => {
    // WebGL support check
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setError('WebGL is not supported in your browser.');
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    let frameId;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      canvas: mountRef.current,
      alpha: true,
      logarithmicDepthBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = false; // Disable default OrbitControls zoom
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.enablePan = false;
    
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE
    };

    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_ROTATE
    };

    controls.addEventListener('start', () => {
      isUserInteractingRef.current = true;
    });

    controls.addEventListener('end', () => {
      setTimeout(() => {
        isUserInteractingRef.current = false;
      }, 1500);
    });

    // Continent data
    const continents = [
      { name: 'North America', lat: 40, lon: -100, path: '/North-America' },
      { name: 'South America', lat: -15, lon: -60, path: '/South-America' },
      { name: 'Europe', lat: 50, lon: 10, path: '/Europe' },
      { name: 'Africa', lat: 0, lon: 20, path: '/Africa' },
      { name: 'Asia', lat: 35, lon: 100, path: '/Asia' },
      { name: 'Australia', lat: -25, lon: 135, path: '/Australia' }
    ];

    // Utility function to convert lat/lon to Vector3
    const latLonToVector3 = (lat, lon, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = (radius * Math.sin(phi) * Math.sin(theta));
      const y = (radius * Math.cos(phi));
      return new THREE.Vector3(x, y, z);
    };

    // Update label positions
    const updateLabelPositions = () => {
      if (!earthRef.current) return;

      const labelData = continents.map(continent => {
        const position = latLonToVector3(continent.lat, continent.lon, 1.55);
        const vector = position.clone();
        vector.applyMatrix4(earthRef.current.matrixWorld);

        const pos = new THREE.Vector3(position.x, position.y, position.z);
        pos.applyMatrix4(earthRef.current.matrixWorld);
        const dot = pos.normalize().dot(camera.position.normalize());

        vector.project(camera);
        const x = (vector.x * 0.5 + 0.5) * width;
        const y = (-vector.y * 0.5 + 0.5) * height;

        return {
          ...continent,
          x,
          y,
          visible: dot < 0.2
        };
      });

      setLabels(labelData);
    };

    // Smooth zoom function
    const updateZoom = () => {
      const zoomDiff = targetZoomRef.current - currentZoomRef.current;
      if (Math.abs(zoomDiff) > 0.01) {
        currentZoomRef.current += zoomDiff * 0.1;
        
        const direction = camera.position.clone().normalize();
        camera.position.copy(direction.multiplyScalar(currentZoomRef.current));
        
        controls.update();
      }
    };

    // Animation loop
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      if (earthRef.current && !isUserInteractingRef.current) {
        earthRef.current.rotation.y += 0.001;
      }

      updateZoom();
      controls.update();
      renderer.render(scene, camera);
      updateLabelPositions();
    };

    // Load Earth model
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
        animate();
      },
      undefined,
      (error) => setError('An error occurred loading the 3D model: ' + error.message)
    );

    // Add location pins
    const addLocationPins = (earthModel) => {
      const textureLoader = new THREE.TextureLoader();
      const pinTexture = textureLoader.load('/assets/pin.png', () => {
        continents.forEach(continent => {
          const spriteMaterial = new THREE.SpriteMaterial({ 
            map: pinTexture, 
            color: 0xffffff,
            opacity: 0.8,
            transparent: true
          });
          
          const sprite = new THREE.Sprite(spriteMaterial);
          sprite.scale.set(0.2, 0.2, 0.2);
          const position = latLonToVector3(continent.lat, continent.lon, 1.55);
          sprite.position.copy(position);
          earthModel.add(sprite);
        });
      });
    };

    // Improved zoom handler
    const handleWheel = (event) => {
      event.preventDefault();
      
      const zoomSensitivity = 0.0007;
      const deltaY = event.deltaY;
      
      // Calculate new target zoom
      let newTargetZoom = targetZoomRef.current * (1 + deltaY * zoomSensitivity);
      
      // Clamp the target zoom
      newTargetZoom = THREE.MathUtils.clamp(
        newTargetZoom,
        controls.minDistance,
        controls.maxDistance
      );
      
      targetZoomRef.current = newTargetZoom;
    };

    // Window resize handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    // Event listeners
    mountRef.current.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (mountRef.current) {
        mountRef.current.removeEventListener('wheel', handleWheel);
      }
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }

      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => {
              if (material.map) material.map.dispose();
              material.dispose();
            });
          } else {
            if (object.material.map) object.material.map.dispose();
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  const handleContinentClick = (path) => {
    router.push(path);
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="earth-container">
      <div className="background-effects">
        <div className="star-field"></div>
        <div className="orbital-ring ring-1"></div>
        <div className="orbital-ring ring-2"></div>
        <div className="orbital-ring ring-3"></div>
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <canvas 
        ref={mountRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          position: 'relative', 
          zIndex: 2,
          cursor: isUserInteractingRef.current ? 'grabbing' : 'grab'
        }} 
      />

      {labels.map((label, index) => (
        <div
          key={index}
          onClick={() => handleContinentClick(label.path)}
          className="continent-label"
          style={{
            left: `${label.x}px`,
            top: `${label.y}px`,
            opacity: label.visible ? 1 : 0,
            pointerEvents: label.visible ? 'auto' : 'none',
            transition: 'opacity 0.3s ease'
          }}
        >
          {label.name}
        </div>
      ))}

      <div className="navigation-hint">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
};

export default EarthModel;