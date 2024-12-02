// 'use client';

// import { Canvas } from '@react-three/fiber';
// import { Environment, CameraControls } from '@react-three/drei';
// import { Leva, useControls } from 'leva';
// import { Model } from './VrmAvatar';

// const CameraManager = () => (
//   <CameraControls
//     minZoom={1}
//     maxZoom={30.3}
//     mouseButtons={{ left: 1, wheel: 16 }}
//     touches={{ one: 32, two: 512 }}
//   />
// );

// function Experience() {
//   // Using `leva` to control avatar position and rotation in real-time
//   const { position, rotation } = useControls({
//     position: {
//       value: [0, 0, 0], // Initial position [x, y, z]
//       step: 0.1,
//     },
//     rotation: {
//       value: [0, 0, 0], // Initial rotation [x, y, z] in radians
//       step: 0.1,
//     },
//   });

//   return (
//     <div className="h-screen w-screen bg-gradient-to-b from-pink-200 to-pink-100">
//       <Leva collapsed />
//       <Canvas shadows camera={{ position: [0, 2, 5], fov: 35 }}>
//         {/* Environment setup */}
//         <ambientLight intensity={0.5} />
//         <spotLight position={[0, 2, -1]} intensity={0.4} />
        
//         {/* Avatar Model with Leva-controlled position and rotation */}
//         <Model position={position} rotation={rotation} />

//         <CameraManager />
//       </Canvas>
//     </div>
//   );
// }

// export default Experience;
'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, CameraControls, OrbitControls } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import { Model } from './VrmAvatar';

const CameraManager = () => (
  <OrbitControls
    target={[0, 1, -1]} // Focus on the character's upper body
    enablePan={true}
    enableZoom={true}
    maxDistance={10}
    minDistance={1.5}
  />
);

function Experience() {
  // Leva controls for real-time adjustments
  const { position, rotation } = useControls({
    position: { value: [0, -0.3, 4.0], step: 0.1 },
    rotation: { value: [0, 3.1, 0], step: 0.1 },
  });

  return (
    <div className="h-screen w-screen bg-black">
      <Leva collapsed />
      <Canvas shadows camera={{ position: [0, 1, 5], fov: 30 }}>
        {/* Directional Light */}
        <directionalLight
          position={[2, 4, 5]} // Position of light source
          intensity={1.5} // Strong light for clear character visibility
          castShadow
        />
        {/* Ambient Light */}
        <ambientLight intensity={0.5} />
        {/* Additional Light for Shadow Fill */}
        

        {/* Environment for realistic reflections */}
        <Environment preset="studio" />

        {/* Avatar Model */}
        <Model position={position} rotation={rotation} />

        {/* Camera Controls */}
        <CameraManager />
      </Canvas>
    </div>
  );
}

export default Experience;
