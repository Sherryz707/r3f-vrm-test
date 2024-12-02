import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useAnimations } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { AnimationMixer, NumberKeyframeTrack, AnimationClip } from 'three'; // Import only necessary components

export const Model = ({ ...props }) => {
  const [currentVrm, setCurrentVrm] = useState(null);
    const [mixerState, setMixer] = useState(null); // Animation mixerState state
    const [blink,setBlink]=useState()
  const vrmRef = useRef(null); // VRM model ref for direct manipulation
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
          console.log("mesh",vrm.scene.children[0])
        
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
        if (currentVrm) {
            console.log(currentVrm, "blink", currentVrm.expressionManager.expressionMap)
            // console.log(JSON.stringify(currentVrm.expressionManager, null, 2));  // Pretty-prints the object
            currentVrm.expressionManager.setValue(currentVrm.expressionManager.getExpressionTrackName('Proud'), 0.28)
            // const trackName = currentVrm.expressionManager.getExpressionTrackName('blink');
            // const track = new NumberKeyframeTrack(
            //     trackName,
            //     [0.0, 0.5, 1.0], // times
            //     [0.0, 1.0, 0.0] // values
            // );

            // const clip = new AnimationClip(
            //     'blink', // name
            //     1.0, // duration
            //     [track] // tracks
            // );

            // const mixerState = new AnimationMixer(currentVrm.scene);
            // const action = mixerState.clipAction(clip);
            // action.play();
            // setMixer(mixerState)
            // console.log("value", currentVrm.expressionManager.getValue("Proud"))
            // Set 'Proud' expression to a value (e.g., 0.28)
      const proudExpressionTrack = currentVrm.expressionManager.getExpressionTrackName('Proud');
      if (proudExpressionTrack) {
        currentVrm.expressionManager.setValue(proudExpressionTrack, 0.28);
        console.log("Set Proud expression to 0.28");
      } else {
        console.warn("'Proud' expression not found");
      }
        }
},[currentVrm])
  useFrame((state, delta) => {
    if (mixerState) mixerState.update(delta); // Update the mixerState on each frame
      if (currentVrm) {
          currentVrm.update(delta)

    }
  });

  return currentVrm ? (
    <primitive ref={vrmRef} object={currentVrm.scene} {...props} />
  ) : null;
};
