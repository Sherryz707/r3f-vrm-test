import React, { useEffect, useRef, useState } from 'react';
import { useAnimations } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { AnimationMixer, NumberKeyframeTrack, AnimationClip,LoopOnce,Vector3,MathUtils } from 'three'; // Import only necessary components
import { Leva, useControls } from 'leva'; // Use useControls instead of useControl
import { useFrame, useThree } from '@react-three/fiber';
import {loadMixamoAnimation} from "./loadMixamoAnim"
export const Model = ({ currentVrm, expression, ...props }) => {
  const { camera } = useThree(); // Access the camera
  console.log("HAND",currentVrm)
  const vrmRef = useRef(null); // VRM model ref for direct manipulation
  const boneRef=useRef(null)
  // create AnimationMixer for VRM
  let currentMixer = new AnimationMixer( currentVrm.scene );
  console.log(currentVrm.expressionManager.expressionMap)
  // mixamo animation
  const [zoom,setZoom]=useState(false)
  useEffect(() => {
    
    loadFBX("/Waving_right.fbx")
    
    const action = actions['happy']
    action.reset().fadeIn(0.5).play();
    action.clampWhenFinished = true; // Stop the animation at the last frame
    action.loop=LoopOnce; 
    

    
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
      const action = currentMixer.clipAction(clip)
      action.reset().fadeIn(0.5).play()
      action.clampWhenFinished = true; // Stop the animation at the last frame
      action.loop=LoopOnce;
      setTimeout(() => {
        action.paused = true;
        const bone = currentVrm.humanoid.getNormalizedBoneNode('rightHand'); // This will return an Object3D
        
      if (bone) {
        boneRef.current = bone;
        // setZoom(true)
      }
        // Pause animation
    }, 1055); // 50

    } );

  }
  // useEffect(() => {
  //   if (boneRef.current) {
  //     console.log("ZOOMING IN BROTHERS")
  //     const boneWorldPosition = new Vector3();
  //     boneRef.current.getWorldPosition(boneWorldPosition);
  //     camera.lookAt(boneWorldPosition);
  //   }
  // },[zoom])
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
    // if (boneRef.current) {
    //   // Get the world position of the bone
    //   const boneWorldPosition = new Vector3();
    //   boneRef.current.getWorldPosition(boneWorldPosition);
    //   // Make sure the camera keeps looking at the bone
    //   camera.lookAt(boneWorldPosition);
    //    // Lerp the camera position to the bone's position for smooth zoom
    //   camera.position.lerp(new Vector3(boneWorldPosition.x, boneWorldPosition.y, boneWorldPosition.z + 3), 0.05);

    //   // Optionally, you can update the FOV for a more zoomed-in effect
    //   camera.fov = MathUtils.lerp(camera.fov, 30, 0.05); // Gradually zoom in FOV (adjust the 30 to the desired FOV)

      

    //   // // Update camera and render
    //   // camera.updateProjectionMatrix();
      
    // }
     if (boneRef.current) {
      const boneWorldPosition = new Vector3();
      boneRef.current.getWorldPosition(boneWorldPosition);
//  camera.lookAt(boneWorldPosition);
     
      // Smoothly lerp camera position and zoom
      // vrmRef.current.position.lerp(new Vector3(vrmRef.current.position.x,vrmRef.current.position.y, vrmRef.current.position.z-0.5), 0.05);
      // camera.fov = MathUtils.lerp(camera.fov, 30, 0.05); // Gradually zoom in (adjust the 30 to the desired FOV)
      // camera.lookAt(boneWorldPosition);
      
      // Ensure the camera updates properly
      //  camera.updateProjectionMatrix();
      //  camera.lookAt(boneWorldPosition);
    }
  })

  return (
    <>
      <primitive ref={vrmRef} object={currentVrm?.scene} {...props} />
      
    </>
  );
};
