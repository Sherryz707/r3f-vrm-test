// 'use client';
// import { Canvas } from '@react-three/fiber';
// import { Environment, OrbitControls } from '@react-three/drei';
// import { Leva, useControls } from 'leva';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
// import { useEffect, useState } from 'react';
// import { Model } from '../_components/AlreadyVrmAvatar';

// const Experience = () => {
//   // Leva controls for light properties
//   const { lightColor, lightIntensity, lightPosition, ambientIntensity } = useControls('Lighting', {
//     lightColor: { value: '#fff4e1' }, // Sunlight color
//     lightIntensity: { value: 1.3, min: 0, max: 10, step: 0.1 }, // Directional light intensity
//     lightPosition: { value: [7.4, -4.2, 4.5], step: 0.1 }, // Directional light position
//     ambientIntensity: { value: 0.8, min: 0, max: 2, step: 0.1 }, // Ambient light intensity
//   });

//   const { modelPosition, modelRotation, expression } = useControls('Model', {
//     modelPosition: { value: [0, -0.6, 2.7], step: 0.1 },
//     modelRotation: { value: [0, 3.3, 0], step: 0.1 },
//     expression: { options: ['neutral', 'happy'] },
//   });

//   const [currentVrm, setCurrentVrm] = useState();

//   useEffect(() => {
//     const loader = new GLTFLoader();
//     loader.register((parser) => new VRMLoaderPlugin(parser));

//     loader.load(
//       '/real_pink.vrm', // URL of the VRM file
//       (gltf) => {
//         const vrm = gltf.userData.vrm;

//         // Optimize the VRM model
//         VRMUtils.removeUnnecessaryVertices(gltf.scene);
//         VRMUtils.combineSkeletons(gltf.scene);

//         // Disable frustum culling
//         vrm.scene.traverse((obj) => {
//           obj.frustumCulled = false;
//         });

//         setCurrentVrm(vrm);
//         console.log('mesh', vrm.scene.children[0]);

//         // Rotate if the VRM is VRM0.0
//         VRMUtils.rotateVRM0(vrm);
//       },
//       (progress) =>
//         console.log('Loading model...', (progress.loaded / progress.total) * 100, '%'),
//       (error) => console.error('Error loading VRM:', error)
//     );

//     return () => {
//       if (currentVrm) {
//         currentVrm.dispose?.();
//       }
//     };
//   }, []);

//   return (
//     <div className="h-screen w-screen">
//       <Leva collapsed />
//       <Canvas shadows camera={{ position: [0, 1, 5], fov: 30 }}>
//         {/* Directional Light */}
//         <directionalLight
//           color={lightColor}
//           intensity={lightIntensity}
//           position={lightPosition}
//           castShadow
//         />
//         {/* Ambient Light */}
//         <ambientLight intensity={ambientIntensity} />

//         {/* Environment for reflections */}
//         {/* <Environment preset="sunset" /> */}

//         {/* Model */}
//         {currentVrm && (
//           <Model
//             currentVrm={currentVrm}
//             position={modelPosition}
//             rotation={modelRotation}
//             expression={expression}
//           />
//         )}

//         {/* Orbit Controls */}
//         <OrbitControls target={[0, 1, 1]} maxDistance={10} minDistance={1.5} />
//       </Canvas>
//     </div>
//   );
// };

// export default Experience;
'use client';
import { Canvas,useThree } from '@react-three/fiber';
import { Html, OrbitControls,CameraControls } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { Model } from '../_components/AlreadyVrmAvatar';
import { Leva, useControls,button, buttonGroup, folder  } from 'leva';
const Experience = () => {
  

  return (
    <div className="h-screen w-screen">
        <Leva/>
    <Canvas
      shadows
      dpr={2}
      camera={{ position: [-0.3, 1, -3], fov: 30 }}
      
    >
        <Scene/>
      </Canvas>
      <div
      className="fixed top-1/2 right-16 transform -translate-y-1/2 bg-gray-800 rounded-lg shadow-2xl h-[60%] w-[40%] z-10 transition-all duration-300"
    >
      <div className="flex flex-col items-center justify-center h-full">
        {/* Webcam Placeholder */}
        <div className="relative w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">[ Webcam Screen Placeholder ]</p>
        </div>

        {/* Answer Button */}
        <button
          className="mt-4 px-4 py-2 text-white font-semibold bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Check Answer
        </button>
      </div>
    </div>
    </div>
  );
};
function Scene() {
  const [currentVrm, setCurrentVrm] = useState();
    const { modelPosition, modelRotation, expression } = useControls('Model', {
    modelPosition: { value: [0.0, 0.0,0.0], step: 0.1 },
    modelRotation: { value: [0.0,0.2, 0.0], step: 0.1 },
    expression: { options: ['neutral', 'happy'] },
  });
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(
      '/real_pink.vrm', // Replace with your VRM file path
      (gltf) => {
        const vrm = gltf.userData.vrm;

        // Model optimizations
        VRMUtils.removeUnnecessaryVertices(gltf.scene);
        VRMUtils.combineSkeletons(gltf.scene);

        vrm.scene.traverse((obj) => (obj.frustumCulled = false));

        setCurrentVrm(vrm);
      },
      (progress) => console.log('Loading...', (progress.loaded / progress.total) * 100, '%'),
      (error) => console.error('Error loading VRM:', error)
    );
  }, []);
 
  // camera
   const cameraControlsRef = useRef()

  const { camera } = useThree()
    // All same options as the original "basic" example: https://yomotsu.github.io/camera-controls/examples/basic.html
  const { minDistance, enabled, verticalDragToForward, dollyToCursor, infinityDolly } = useControls({
    thetaGrp: buttonGroup({
      label: 'rotate theta',
      opts: {
        '+45º': () => cameraControlsRef.current?.rotate(45 * DEG2RAD, 0, true),
        '-90º': () => cameraControlsRef.current?.rotate(-90 * DEG2RAD, 0, true),
        '+360º': () => cameraControlsRef.current?.rotate(360 * DEG2RAD, 0, true)
      }
    }),
    phiGrp: buttonGroup({
      label: 'rotate phi',
      opts: {
        '+20º': () => cameraControlsRef.current?.rotate(0, 20 * DEG2RAD, true),
        '-40º': () => cameraControlsRef.current?.rotate(0, -40 * DEG2RAD, true)
      }
    }),
    truckGrp: buttonGroup({
      label: 'truck',
      opts: {
        '(1,0)': () => cameraControlsRef.current?.truck(1, 0, true),
        '(0,1)': () => cameraControlsRef.current?.truck(0, 1, true),
        '(-1,-1)': () => cameraControlsRef.current?.truck(-1, -1, true)
      }
    }),
    dollyGrp: buttonGroup({
      label: 'dolly',
      opts: {
        '1': () => cameraControlsRef.current?.dolly(1, true),
        '-1': () => cameraControlsRef.current?.dolly(-1, true)
      }
    }),
    zoomGrp: buttonGroup({
      label: 'zoom',
      opts: {
        '/2': () => cameraControlsRef.current?.zoom(camera.zoom / 2, true),
        '/-2': () => cameraControlsRef.current?.zoom(-camera.zoom / 2, true)
      }
    }),
    minDistance: { value: 0 },
    moveTo: folder(
      {
        vec1: { value: [3, 5, 2], label: 'vec' },
        'moveTo(…vec)': button((get) => cameraControlsRef.current?.moveTo(...get('moveTo.vec1'), true))
      },
      { collapsed: true }
    ),
    'fitToBox(mesh)': button(() => cameraControlsRef.current?.fitToBox(meshRef.current, true)),
    setPosition: folder(
      {
        vec2: { value: [-5, 2, 1], label: 'vec' },
        'setPosition(…vec)': button((get) => cameraControlsRef.current?.setPosition(...get('setPosition.vec2'), true))
      },
      { collapsed: true }
    ),
    setTarget: folder(
      {
        vec3: { value: [3, 0, -3], label: 'vec' },
        'setTarget(…vec)': button((get) => cameraControlsRef.current?.setTarget(...get('setTarget.vec3'), true))
      },
      { collapsed: true }
    ),
    setLookAt: folder(
      {
        vec4: { value: [1, 2, 3], label: 'position' },
        vec5: { value: [1, 1, 0], label: 'target' },
        'setLookAt(…position, …target)': button((get) => cameraControlsRef.current?.setLookAt(...get('setLookAt.vec4'), ...get('setLookAt.vec5'), true))
      },
      { collapsed: true }
    ),
    lerpLookAt: folder(
      {
        vec6: { value: [-2, 0, 0], label: 'posA' },
        vec7: { value: [1, 1, 0], label: 'tgtA' },
        vec8: { value: [0, 2, 5], label: 'posB' },
        vec9: { value: [-1, 0, 0], label: 'tgtB' },
        t: { value: Math.random(), label: 't', min: 0, max: 1 },
        'f(…posA,…tgtA,…posB,…tgtB,t)': button((get) => {
          return cameraControlsRef.current?.lerpLookAt(
            ...get('lerpLookAt.vec6'),
            ...get('lerpLookAt.vec7'),
            ...get('lerpLookAt.vec8'),
            ...get('lerpLookAt.vec9'),
            get('lerpLookAt.t'),
            true
          )
        })
      },
      { collapsed: true }
    ),
    saveState: button(() => cameraControlsRef.current?.saveState()),
    reset: button(() => cameraControlsRef.current?.reset(true)),
    enabled: { value: true, label: 'controls on' },
    verticalDragToForward: { value: false, label: 'vert. drag to move forward' },
    dollyToCursor: { value: false, label: 'dolly to cursor' },
    infinityDolly: { value: false, label: 'infinity dolly' }
  })
  return <group position-x={-0.3}>
          <CameraControls
          ref={cameraControlsRef}
          minDistance={minDistance}
          enabled={enabled}
          verticalDragToForward={verticalDragToForward}
          dollyToCursor={dollyToCursor}
          infinityDolly={infinityDolly}
        />
      {/* Directional Light */}
      <directionalLight
        color={0xffffff}
        intensity={Math.PI}
        position={[1, 1, 1]}
        castShadow
      />

      {/* Ambient Light */}
      <ambientLight intensity={0.5} />

        {/* Model */}
        <Suspense fallback={<Html><p>LoAIDNG MODEL</p></Html>}>

        {currentVrm && <Model currentVrm={currentVrm} position={modelPosition} rotation={modelRotation} />}
        </Suspense>

      {/* Camera Controls */}
          <OrbitControls target={[0, 1, 0]} />
          </group>
}
export default Experience;
