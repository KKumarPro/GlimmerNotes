import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

interface Pet {
  id: string;
  name: string;
  species: string;
  level: number;
  happiness: number;
  energy: number;
  bond: number;
  mood: string;
}

interface VirtualPet3DProps {
  pet: Pet;
  onPetClick: () => void;
}

export function VirtualPet3D({ pet, onPetClick }: VirtualPet3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const petMeshRef = useRef<THREE.Group>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Pet model - simple cosmic fairy
    const petGroup = new THREE.Group();
    
    // Main body
    const bodyGeometry = new THREE.SphereGeometry(1, 16, 16);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color().setHSL(0.8, 0.6, 0.7),
      transparent: true,
      opacity: 0.9,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    petGroup.add(body);

    // Wings
    const wingGeometry = new THREE.PlaneGeometry(1.5, 0.8);
    const wingMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color().setHSL(0.9, 0.4, 0.8),
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-1.2, 0.2, 0);
    leftWing.rotation.z = 0.3;
    petGroup.add(leftWing);
    
    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(1.2, 0.2, 0);
    rightWing.rotation.z = -0.3;
    petGroup.add(rightWing);

    // Sparkle effects
    const sparkleGeometry = new THREE.BufferGeometry();
    const sparkleCount = 50;
    const sparklePositions = new Float32Array(sparkleCount * 3);

    for (let i = 0; i < sparkleCount * 3; i++) {
      sparklePositions[i] = (Math.random() - 0.5) * 6;
    }

    sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    const sparkleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.8,
    });

    const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
    petGroup.add(sparkles);

    // Floating platform
    const platformGeometry = new THREE.CylinderGeometry(2, 2, 0.2, 16);
    const platformMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color().setHSL(0.7, 0.3, 0.4),
      transparent: true,
      opacity: 0.7,
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = -2;
    platform.receiveShadow = true;
    scene.add(platform);

    scene.add(petGroup);
    petMeshRef.current = petGroup;

    // Mouse interaction
    const onMouseClick = () => {
      onPetClick();
    };

    renderer.domElement.addEventListener('click', onMouseClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (petMeshRef.current) {
        const time = Date.now() * 0.001;
        
        // Floating animation
        petMeshRef.current.position.y = Math.sin(time) * 0.3;
        
        // Gentle rotation
        petMeshRef.current.rotation.y += 0.005;
        
        // Wing flapping
        const leftWing = petMeshRef.current.children[1] as THREE.Mesh;
        const rightWing = petMeshRef.current.children[2] as THREE.Mesh;
        
        if (leftWing && rightWing) {
          leftWing.rotation.z = 0.3 + Math.sin(time * 8) * 0.2;
          rightWing.rotation.z = -0.3 - Math.sin(time * 8) * 0.2;
        }
        
        // Sparkle animation
        const sparkles = petMeshRef.current.children[3] as THREE.Points;
        if (sparkles) {
          sparkles.rotation.y += 0.01;
        }

        // Mood-based color changes
        const happiness = pet.happiness / 100;
        const body = petMeshRef.current.children[0] as THREE.Mesh;
        if (body.material instanceof THREE.MeshPhongMaterial) {
          body.material.color.setHSL(0.3 + happiness * 0.3, 0.6, 0.5 + happiness * 0.2);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', onMouseClick);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [pet, onPetClick]);

  return (
    <motion.div
      ref={containerRef}
      className="w-full h-80 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      whileHover={{ scale: 1.02 }}
      data-testid="virtual-pet-3d"
    />
  );
}
