import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

interface Memory {
  id: string;
  title: string;
  content: string;
  starPosition: { x: number; y: number; z: number };
}

interface MemoryOrb3DProps {
  memories: Memory[];
  onStarClick: (memory: Memory) => void;
}

export function MemoryOrb3D({ memories, onStarClick }: MemoryOrb3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const starsRef = useRef<THREE.Points>();
  const memoryStarsRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create starfield background
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 200;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.6,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    starsRef.current = stars;

    // Create memory stars
    memories.forEach((memory) => {
      const starGeometry = new THREE.SphereGeometry(0.8, 16, 16);
      const starMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.8, 0.7),
        transparent: true,
        opacity: 0.8,
      });

      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.set(
        memory.starPosition?.x || (Math.random() - 0.5) * 80,
        memory.starPosition?.y || (Math.random() - 0.5) * 80,
        memory.starPosition?.z || (Math.random() - 0.5) * 80
      );

      star.userData = { memory };
      scene.add(star);
      memoryStarsRef.current.push(star);
    });

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(memoryStarsRef.current);

      if (intersects.length > 0) {
        const memory = intersects[0].object.userData.memory;
        onStarClick(memory);
      }
    };

    renderer.domElement.addEventListener('click', onMouseClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate starfield
      if (starsRef.current) {
        starsRef.current.rotation.x += 0.0005;
        starsRef.current.rotation.y += 0.0005;
      }

      // Animate memory stars
      memoryStarsRef.current.forEach((star, index) => {
        star.rotation.x += 0.01;
        star.rotation.y += 0.01;
        star.position.y += Math.sin(Date.now() * 0.001 + index) * 0.02;
      });

      // Camera orbit
      const time = Date.now() * 0.0005;
      camera.position.x = Math.cos(time) * 60;
      camera.position.z = Math.sin(time) * 60;
      camera.lookAt(0, 0, 0);

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
  }, [memories, onStarClick]);

  return (
    <motion.div
      ref={containerRef}
      className="w-full h-96 rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/30 to-blue-900/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      data-testid="memory-orb-3d"
    />
  );
}
