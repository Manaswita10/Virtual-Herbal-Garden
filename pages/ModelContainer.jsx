import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Model({ url }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const gltf = useLoader(
    GLTFLoader,
    url,
    undefined,
    (error) => {
      console.error('An error happened while loading the model:', error);
      setError(error);
    }
  );
  const ref = useRef();

  useEffect(() => {
    if (gltf) {
      setLoading(false);
      console.log('Model loaded successfully:', gltf);
    }
  }, [gltf]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
    }
  });

  if (error) {
    return <mesh><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="red" /></mesh>;
  }

  if (loading) {
    return <mesh><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="yellow" /></mesh>;
  }

  return (
    <primitive 
      ref={ref}
      object={gltf.scene} 
      scale={[0.5, 0.5, 0.5]}
      position={[0, 0, 0]}
    />
  );
}

function DebugInfo() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    console.log('WebGL Renderer:', gl);
    console.log('Scene:', scene);
    console.log('Camera:', camera);
  }, [gl, scene, camera]);
  return null;
}

export default function ModelContainer() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }} style={{ background: '#000000' }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Suspense fallback={<mesh><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="blue" /></mesh>}>
        <Model url="/assets/Asia_images/3d-models/AloeVera.gltf" />
      </Suspense>
      <OrbitControls />
      <axesHelper args={[5]} />
      <gridHelper />
      <DebugInfo />
    </Canvas>
  );
}