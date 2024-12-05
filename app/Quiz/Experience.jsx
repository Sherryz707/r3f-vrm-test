'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, CameraControls, OrbitControls,RoundedBox, Text } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import { Model } from '../_components/AlreadyVrmAvatar';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { useEffect, useState } from 'react';

const CameraManager = () => (
  <OrbitControls
    target={[0, 1, 1]} // Focus on the character's upper body
    enablePan={true}
    enableZoom={true}
    maxDistance={10}
    minDistance={1.5}
  />
);

function Experience() {
  // Leva controls for real-time adjustments
  const { position, rotation,expression } = useControls({
    position: { value: [-0.1, -0.5, 3.7], step: 0.1 },
    rotation: { value: [0, 3.3, 0], step: 0.1 },
    expression: { options: ['neutral','happy']}
  });
    const [currentVrm,setCurrentVrm]=useState()
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(
      '/real_pink.vrm', // URL of the VRM file
      (gltf) => {
        const vrm = gltf.userData.vrm;

        // Optimize the VRM model
        VRMUtils.removeUnnecessaryVertices(gltf.scene);
        VRMUtils.combineSkeletons(gltf.scene);

        // Disable frustum culling
        vrm.scene.traverse((obj) => {
          obj.frustumCulled = false;
        });

          setCurrentVrm(vrm);
        console.log("mesh", vrm.scene.children[0])
        // rotate if the VRM is VRM0.0
			  VRMUtils.rotateVRM0( vrm );
        
      },
      (progress) => console.log('Loading model...', (progress.loaded / progress.total) * 100, '%'),
      (error) => console.error('Error loading VRM:', error)
    );

    return () => {
      if (currentVrm) {
        currentVrm.dispose?.();
      }
    };
  }, []);
  return (
    <div className="h-[32rem] w-[35rem] relative z-10">
      <Leva collapsed />
      <Canvas shadows camera={{ position: [0, 1, 5], fov: 30 }}>
        {/* Directional Light */}
        <directionalLight
          position={[-0.1, -0.5, 3.7]} // Position of light source
          intensity={2} // Strong light for clear character visibility
          castShadow
        />
        {/* Ambient Light */}
        {/* <ambientLight intensity={0.5} /> */}
        {/* Additional Light for Shadow Fill */}
        

        {/* Environment for realistic reflections */}
        <Environment preset="sunset" />
        {/* Circular boundary using Drei's Circle */}
        {/* Avatar Model */}
        {currentVrm && <Model currentVrm={currentVrm} position={position} rotation={rotation} expression={expression} />}
        {/* Camera Controls */}
        {/* <CameraManager /> */}
      </Canvas>
    </div>
  );
}

export default Experience;
