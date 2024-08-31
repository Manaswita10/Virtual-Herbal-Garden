'use client';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Dynamically import echarts-gl to prevent SSR issues
const EChartsGL = dynamic(() => import('echarts-gl'), { ssr: false });

const AloeVera = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Set up the scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xf5f5f5, 1); // Off-white background color

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Set up the lighting for brighter colors
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(1, 1, 0).normalize();
    scene.add(directionalLight);

    // Load the GLTF model
    const loader = new GLTFLoader();
    loader.load('/assets/Asia_images/drive-download-20240829T184556Z-001/scene.gltf', (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      // Position the model at the top left corner and increase its size
      model.position.set(-2, 1.5, 0); // Adjusted position for better alignment
      model.scale.set(1, 1, 2); // Increased size

      // Animation for auto-rotation
      const animate = () => {
        requestAnimationFrame(animate);

        // Auto-rotate the model
        model.rotation.y += 0.01;

        renderer.render(scene, camera);
      };

      animate();
    });

    // Set up the camera
    camera.position.z = 5;

    // Set up the orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;

    // Handle window resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      // Clean up on unmount
      window.removeEventListener('resize', handleResize);
      controls.dispose();
    };
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <div ref={mountRef} style={{ width: '40%', height: '60vh', marginRight: '20px' }} />
      <div style={{ flex: 1, color: '#333', lineHeight: '1.8' }}>
        <h1 style={{ fontSize: '2.5em', fontWeight: 'bold', marginBottom: '20px' }}>Aloe Vera</h1>
        <p>
          <strong>Botanical Name:</strong> <em>Aloe barbadensis miller</em><br />
          <strong>Common Names:</strong> Aloe, True Aloe, Medicinal Aloe<br />
          <strong>Habitat:</strong> Native to the Arabian Peninsula, but widely cultivated in tropical and subtropical regions.<br />
        </p>
        <h2 style={{ fontSize: '2em', fontWeight: 'bold', marginTop: '30px' }}>Medicinal Uses</h2>
        <p>
          Aloe Vera is known for its soothing and healing properties. The gel from its leaves is used to treat skin conditions like burns, cuts, and eczema. It also has anti-inflammatory and antimicrobial properties.
        </p>
        <h2 style={{ fontSize: '2em', fontWeight: 'bold', marginTop: '30px' }}>Health Benefits</h2>
        <p>
          Aloe Vera is rich in vitamins, minerals, and antioxidants. It supports digestive health, boosts the immune system, and can help regulate blood sugar levels. Its moisturizing properties make it popular in skincare products.
        </p>
        <h2 style={{ fontSize: '2em', fontWeight: 'bold', marginTop: '30px' }}>Methods of Cultivation</h2>
        <p>
          Aloe Vera is easy to grow in well-draining soil and requires minimal care. It thrives in warm, sunny climates but can also be grown indoors. Water the plant sparingly, allowing the soil to dry out between waterings.
        </p>
        <h2 style={{ fontSize: '2em', fontWeight: 'bold', marginTop: '30px' }}>More Interesting Facts</h2>
        <p>
          Did you know that Aloe Vera has been used for centuries in traditional medicine across various cultures? Ancient Egyptians called it the plant of immortality. Today, it is used in numerous products ranging from health supplements to beauty creams, making it one of the most versatile natural remedies.
        </p>
        <p>
          Aloe Vera can also be consumed in the form of juice. This juice is believed to aid in digestion, detoxify the body, and improve skin clarity. However, it is important to consult with a healthcare provider before adding it to your diet, as excessive consumption can have side effects.
        </p>
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '20px' }}>Learn More About Aloe Vera</h2>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: '0', overflow: 'hidden', maxWidth: '100%', background: '#000', marginBottom: '20px' }}>
            <iframe
              style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}
              src="https://www.youtube.com/embed/VIDEO_ID_HERE"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Aloe Vera Video"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AloeVera;
