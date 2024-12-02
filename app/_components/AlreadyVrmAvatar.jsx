import React, { useEffect, useRef } from 'react';
import { useAnimations } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { AnimationMixer, NumberKeyframeTrack, AnimationClip } from 'three'; // Import only necessary components
import { Leva, useControls } from 'leva'; // Use useControls instead of useControl

export const Model = ({ currentVrm, ...props }) => {
  const vrmRef = useRef(null); // VRM model ref for direct manipulation

  // Create the blink animation
  const trackName = currentVrm?.expressionManager.getExpressionTrackName('blink');
  const track = new NumberKeyframeTrack(
    trackName,
    [0.0, 0.5, 1.0], // times
    [0.0, 1.0, 0.0] // values
  );

  const clip = new AnimationClip(
    'blink', // name
    1.0, // duration
    [track] // tracks
  );

  // Use the useAnimations hook
  const { actions, mixer } = useAnimations([clip], vrmRef);

  // Play the blink animation when the component mounts
  useEffect(() => {
    if (actions['blink']) {
        actions['blink'].play();
        currentVrm.expressionManager.setValue("Proud", 1)
        currentVrm.expressionManager.update()
        console.log(currentVrm,"trget bind",Json.stringify(currentVrm.expressionManager.expressionMap['Proud']._bind))
    }
  }, [actions]);


  return (
    <>
      <primitive ref={vrmRef} object={currentVrm?.scene} {...props} />
      
    </>
  );
};
