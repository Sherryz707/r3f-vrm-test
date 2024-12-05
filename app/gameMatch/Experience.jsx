'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Model from "./Duck"

export default function CenteredModel() {
  return (
    <div className="h-screen w-screen">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        {/* Add ambient light and directional light */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 5, 5]} intensity={1} />
        {/* Render the model in the center */}
              <Model scale={5} />
        {/* Controls to rotate the view */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
