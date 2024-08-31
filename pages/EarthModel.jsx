'use client';

import React, { useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const EarthModel = () => {
  const mountRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    let scene, camera, renderer, earth, starfield, controls, raycaster;

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 15;

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      mountRef.current.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.enableZoom = false;

      raycaster = new THREE.Raycaster();

      createEarth();
      createStarfield();
      createLights();
      createMarkers();
    };

    const createEarth = () => {
      const geometry = new THREE.SphereGeometry(5, 64, 64);
      const loader = new THREE.TextureLoader();
      const texture = loader.load('/assets/earth.jpg');
      const material = new THREE.ShaderMaterial({
        uniforms: {
          earthTexture: { value: texture },
          time: { value: 0 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D earthTexture;
          uniform float time;
          varying vec2 vUv;
          varying vec3 vNormal;
          void main() {
            vec4 texColor = texture2D(earthTexture, vUv);
            float atmosphere = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
            vec3 glow = vec3(0.3, 0.6, 1.0) * atmosphere;
            gl_FragColor = vec4(texColor.rgb + glow, 1.0);
          }
        `
      });
      earth = new THREE.Mesh(geometry, material);
      scene.add(earth);
    };

    const createStarfield = () => {
      const geometry = new THREE.SphereGeometry(90, 64, 64);
      const loader = new THREE.TextureLoader();
      const texture = loader.load('/assets/starfield.jpg');
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
      });
      starfield = new THREE.Mesh(geometry, material);
      scene.add(starfield);
    };

    const createLights = () => {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
      scene.add(ambientLight);
      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(50, 50, 50);
      scene.add(pointLight);
    };

    const createMarkers = () => {
      const markerPositions = [
        { name: 'North America', position: new THREE.Vector3(-3.5, 2, 3), route: '/north-america' },
        { name: 'South America', position: new THREE.Vector3(-2, -1, 4), route: '/south-america' },
        { name: 'Europe', position: new THREE.Vector3(0.5, 3, 4), route: '/europe' },
        { name: 'Africa', position: new THREE.Vector3(1, 0, 5), route: '/africa' },
        { name: 'Asia', position: new THREE.Vector3(4, 2, 2), route: '/asia' },
        { name: 'Australia', position: new THREE.Vector3(4, -2, -2), route: '/australia' }
      ];

      const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      const markerMaterial = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(0xff3333) },
          time: { value: 0 }
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          uniform float time;
          varying vec3 vNormal;
          void main() {
            float pulse = sin(time * 3.0) * 0.5 + 0.5;
            gl_FragColor = vec4(color * pulse, 1.0);
          }
        `
      });

      markerPositions.forEach(markerInfo => {
        const marker = new THREE.Mesh(markerGeometry, markerMaterial.clone());
        marker.position.copy(markerInfo.position);
        marker.userData = { name: markerInfo.name, route: markerInfo.route };
        earth.add(marker);
      });
    };

    const onMouseClick = (event) => {
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(earth.children);

      if (intersects.length > 0) {
        const clickedMarker = intersects[0].object;
        router.push(clickedMarker.userData.route);
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      earth.rotation.y += 0.001;
      earth.material.uniforms.time.value += 0.01;
      earth.children.forEach(child => {
        child.material.uniforms.time.value += 0.01;
      });
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    init();
    animate();

    window.addEventListener('resize', handleResize);
    window.addEventListener('click', onMouseClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', onMouseClick);
      scene.remove(earth);
      scene.remove(starfield);
      renderer.dispose();
    };
  }, [router]);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }}></div>;
};

export default dynamic(() => Promise.resolve(EarthModel), { ssr: false });