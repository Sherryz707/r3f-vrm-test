import React, { useEffect, useRef } from 'react';
import { useAnimations } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { AnimationMixer, NumberKeyframeTrack, AnimationClip,LoopOnce,Vector3 } from 'three'; // Import only necessary components
import { Leva, useControls } from 'leva'; // Use useControls instead of useControl
import { useFrame, useThree } from '@react-three/fiber';
import {loadMixamoAnimation} from "./loadMixamoAnim"
export const Model = ({ currentVrm, expression, ...props }) => {
  const { camera } = useThree(); // Access the camera
  console.log("HAND",currentVrm.humanoid.getNormalizedBoneNode("leftHand"))
  const vrmRef = useRef(null); // VRM model ref for direct manipulation
  const boneRef=useRef(null)
  // create AnimationMixer for VRM
  let currentMixer = new AnimationMixer( currentVrm.scene );
  console.log(currentVrm.expressionManager.expressionMap)
  // mixamo animation
  
  useEffect(() => {
    const bone = currentVrm.humanoid.getNormalizedBoneNode('leftHand'); // This will return an Object3D
      if (bone) {
        boneRef.current = bone;
      }
    loadFBX("./Dance.fbx")
    // let action = actions['happy'];
    const action = actions['happy']
    action.reset().fadeIn(0.5).play();
    action.loop=LoopOnce
    action.clampWhenFinished = true;
    

    
  },[])
  // Utility to create expression clips
  const createFacialExpressionClip = (expressionName) => {
    const trackName = currentVrm?.expressionManager.getExpressionTrackName(
      expressionName
    );
    if (!trackName) return null;
    const track = new NumberKeyframeTrack(
      trackName,
      [0.0, 0.5, 1.0],
      [0.0, 0.78,1]
    );
    return new AnimationClip(expressionName, 1.0, [track]);
  };

  const clipNeutral = createFacialExpressionClip("neutral");
  const clipHappy = createFacialExpressionClip("happy");

  const { actions, mixer } = useAnimations([clipNeutral, clipHappy], vrmRef);
  function loadFBX( animationUrl ) {

    let currentAnimationUrl = animationUrl;

    currentVrm.humanoid.resetNormalizedPose();
    
    
    // Load animation
    loadMixamoAnimation( animationUrl, currentVrm ).then( ( clip ) => {

      // Apply the loaded animation to mixer and play
      currentMixer.clipAction( clip ).play();
      currentMixer.timeScale = 1

    } );

  }
  // Play the blink animation when the component mounts
  useEffect(() => {
    if (actions[expression]) {
      // Play the current expression action
      const action = actions[expression];
      action.reset().fadeIn(0.5).play();
      action.clampWhenFinished = true; // Stop the animation at the last frame
      action.loop=LoopOnce; // Ensure the animation runs only once
    }
  }, [expression]);
  useFrame((state, delta) => {
    if (currentMixer) {
      currentMixer.update(delta)
    }
    if (mixer) {
      mixer.update(delta)
    }
    if (currentVrm) {
      currentVrm.update(delta)
    }
    if (boneRef.current) {
      // Get the world position of the bone
      const boneWorldPosition = new Vector3();
      boneRef.current.getWorldPosition(boneWorldPosition);

      // Make the camera look at the bone's position (using its world position)
      camera.lookAt(boneWorldPosition);
    }
  })

  return (
    <>
      <primitive ref={vrmRef} object={currentVrm?.scene} {...props} />
      
    </>
  );
};
