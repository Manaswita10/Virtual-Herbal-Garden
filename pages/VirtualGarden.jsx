import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import axios from 'axios';

const VirtualGarden = () => {
  const containerRef = useRef(null);
  const [plants, setPlants] = useState([]);
  const [isVRMode, setIsVRMode] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await axios.get('/api/plants');
        setPlants(response.data);
      } catch (error) {
        console.error('Error fetching plants:', error);
      }
    };
    fetchPlants();

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x91785c });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Sky
    scene.background = new THREE.Color(0x9EE5E3);

    // Stylized trees
    const createStylizedTree = (x, z) => {
      const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.4, 2, 8);
      const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.set(x, 1, z);

      const leafGeometry = new THREE.SphereGeometry(1.5, 8, 8);
      const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x9ACD32 });
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      leaf.position.set(x, 3, z);

      scene.add(trunk);
      scene.add(leaf);
    };

    for (let i = 0; i < 20; i++) {
      createStylizedTree(Math.random() * 80 - 40, Math.random() * 80 - 40);
    }

    // Camera and controls setup
    camera.position.set(0, 5, 10);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Plant models
    const loadPlantModel = async (plant) => {
      try {
        const urlsResponse = await axios.get(`/api/getPresignedUrls?modelBasePath=${plant.modelBasePath}`);
        const modelUrls = urlsResponse.data;
        const gltfUrl = Object.entries(modelUrls).find(([key]) => key.endsWith('.gltf'));
        
        if (gltfUrl) {
          const loader = new GLTFLoader();
          loader.load(gltfUrl[1], (gltf) => {
            gltf.scene.scale.set(0.5, 0.5, 0.5);
            gltf.scene.position.set(Math.random() * 20 - 10, 0, Math.random() * 20 - 10);
            scene.add(gltf.scene);

            // Make plants clickable
            gltf.scene.userData = { type: 'plant', id: plant._id };
          });
        }
      } catch (error) {
        console.error('Error loading plant model:', error);
      }
    };

    plants.forEach(loadPlantModel);

    // Raycaster for plant selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        let selectedObject = intersects[0].object;
        while(selectedObject.parent && !selectedObject.userData.type) {
          selectedObject = selectedObject.parent;
        }
        if (selectedObject.userData.type === 'plant') {
          setScore(prevScore => prevScore + 1);
          // Here you can add more logic for plant selection, like showing info
        }
      }
    };

    window.addEventListener('click', onMouseClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', onMouseClick);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, [plants]);

  const toggleVRMode = () => {
    setIsVRMode(!isVRMode);
    // Here you would implement the switch to VR mode
    // This might involve using a VR-specific renderer or camera
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      <button 
        style={{ 
          position: 'absolute', 
          top: '10px', 
          left: '10px', 
          zIndex: 100,
          padding: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
        onClick={toggleVRMode}
      >
        Toggle VR Mode
      </button>
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 100,
        padding: '10px',
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'white',
        borderRadius: '5px'
      }}>
        Score: {score}
      </div>
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        padding: '10px',
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'white',
        borderRadius: '5px'
      }}>
        Use W, A, S, D to move. Click on Plants for info and score a point
      </div>
    </div>
  );
};

export default VirtualGarden;