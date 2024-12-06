'use client';

import { Canvas,useThree} from '@react-three/fiber';
import { Environment, CameraControls, OrbitControls } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import { Model } from './AlreadyVrmAvatar';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { useEffect, useRef, useState } from 'react';
import { AnimationMixer, NumberKeyframeTrack, AnimationClip,LoopOnce,Vector3,MathUtils } from 'three';
// const CameraManager = () => (
//   <OrbitControls
//     target={[0, 1, -1]} // Focus on the character's upper body
//     enablePan={true}
//     enableZoom={true}
//     maxDistance={10}
//     minDistance={1.5}
//   />
// );

function Experience() {
  
  return (
    <div className="h-screen w-screen bg-black">
      <Leva collapsed />
      <Canvas shadows camera={{ position: [0, 1, 5], fov: 30 }}>
       <Scene/>
      </Canvas>
    </div>
  );
}
function Scene(){
  const { camera } = useThree();
  const cameraControlRef = useRef();
  // State to store the initial camera position and target
  const [initialCameraState, setInitialCameraState] = useState({
    position: new Vector3(),
    target: new Vector3(),
  });
  // Leva controls for real-time adjustments
  let { position, rotation,expression,zoom } = useControls({
    position: { value: [0, -0.5, 4.0], step: 0.1 },
    rotation: { value: [0, 3.1, 0], step: 0.1 },
    expression: { options: ['neutral', 'happy'] },
    zoom: {
      options:["no_zoom","zoom"]
    }
  });
    const [currentVrm,setCurrentVrm]=useState()
  useEffect(() => {
     if (cameraControlRef.current) {
      setInitialCameraState({
        position: camera.position.clone(),
        target: cameraControlRef.current.getTarget(new Vector3()),
      });
    }
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
  useEffect(() => {
    if (currentVrm && zoom == "zoom") {
      // position=[-0.1, position[1], 4.1]
      const bone = currentVrm.humanoid.getNormalizedBoneNode('leftHand');
    const boneWorldPosition = new Vector3();
      bone.getWorldPosition(boneWorldPosition);
      // camera.lookAt(boneWorldPosition)
      // Use CameraControls setTarget to look at the bone
//       cameraControlRef.current.setTarget(
//         boneWorldPosition.x,
//         boneWorldPosition.y,
//         boneWorldPosition.z,
//         true // Smooth transition
//       );
//       cameraControlRef.current.setPosition(
//     boneWorldPosition.x,
//     boneWorldPosition.y + 0.2, // Adjust height slightly
//     boneWorldPosition.z - 4.0, // Move closer on the Z-axis
//     true // Smooth transition
      // );
      const offsetZ = 0.5; // Adjust this value for how close you want the camera
       currentVrm.scene.position.set(
      -0.2, // Move left slightly
      -0.5, // Height adjustment
      4.0 // Move model closer on the Z-axis
    );
    // Set the model's rotation (in radians)
    currentVrm.scene.rotation.set(
      currentVrm.scene.rotation.x,  // Keep the current x rotation
      3.4,                          // Set y rotation to 3.4 radians
      currentVrm.scene.rotation.z   // Keep the current z rotation
    );

// cameraControlRef.current.setPosition(
//     -0.2,
//     boneWorldPosition.y + 0.2, // Slight height adjustment
//     boneWorldPosition.z + offsetZ, // Move closer
//     true // Smooth transition
// );
cameraControlRef.current.setTarget(
    boneWorldPosition.x,
    boneWorldPosition.y,
    boneWorldPosition.z, // Keep looking at the hand
    true
);


      console.log(initialCameraState)
        }
 

},[zoom])
  return <> {/* Directional Light */}
    <CameraControls ref={cameraControlRef} />
        <directionalLight
          position={[2, 4, 5]} // Position of light source
          intensity={1.5} // Strong light for clear character visibility
          castShadow
        />
        {/* Ambient Light */}
        <ambientLight intensity={0.5} />
        {/* Additional Light for Shadow Fill */}
        

        {/* Environment for realistic reflections */}
        <Environment preset="sunset" />

        {/* Avatar Model */}
              {currentVrm && <Model currentVrm={currentVrm} position={position} rotation={rotation} expression={expression} />}

        {/* Camera Controls */}
    {/* <CameraManager /></> */}
    </>
}
export default Experience;
