import React, { Suspense, useEffect, useRef, useState } from 'react'
import * as ReactDOM from 'react-dom'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import './styles.css'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRM, VRMSchema, VRMUtils } from '@pixiv/three-vrm'
import { Object3D } from 'three'
import { useControls } from 'leva'
/*

inspired by https://twitter.com/yeemachine/status/1414993821583118341

*/

const Avatar = () => {
  const { leftShoulder, rightShoulder } = useControls({
    leftShoulder: { value: 0, min: -1, max: 1 },
    rightShoulder: { value: 0, min: -1, max: 1 }
  })
  const { scene, camera } = useThree()
  const gltf = useGLTF('/three-vrm-girl.vrm')
  const avatar = useRef<VRM>()
  const [bonesStore, setBones] = useState<{ [part: string]: Object3D }>({})

  useEffect(() => {
    if (gltf) {
      VRMUtils.removeUnnecessaryJoints(gltf.scene)
      VRM.from(gltf as GLTF).then((vrm) => {
        avatar.current = vrm
        vrm.lookAt.target = camera
        vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Hips).rotation.y = Math.PI

        const bones = {
          neck: vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Neck),
          hips: vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Hips),
          LeftShoulder: vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftShoulder),
          RightShoulder: vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightShoulder)
        }

        // bones.RightShoulder.rotation.z = -Math.PI / 4

        setBones(bones)
      })
    }
  }, [scene, gltf, camera])

  useFrame(({ clock }, delta) => {
    if (avatar.current) {
      avatar.current.update(delta)
    }
    if (bonesStore.neck) {
      const t = clock.getElapsedTime()
      bonesStore.neck.rotation.y = (Math.PI / 4) * Math.sin(t * Math.PI)
    }
    if (bonesStore.LeftShoulder) {
      bonesStore.LeftShoulder.position.y = leftShoulder
      bonesStore.LeftShoulder.rotation.z = leftShoulder * Math.PI
    }
    if (bonesStore.RightShoulder) {
      bonesStore.RightShoulder.rotation.z = rightShoulder * Math.PI
    }
  })
  return <primitive object={gltf.scene}></primitive>
}

ReactDOM.render(
  <Canvas>
    <OrbitControls />
    <spotLight position={[0, 2, -1]} intensity={0.4} />
    <ambientLight intensity={0.65} />
    <Suspense fallback={null}>
      <Avatar />
    </Suspense>
  </Canvas>,
  document.getElementById('root')
)


			import * as THREE from 'three';
			import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
			import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
			import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

			// renderer
			const renderer = new THREE.WebGLRenderer();
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.setPixelRatio( window.devicePixelRatio );
			document.body.appendChild( renderer.domElement );

			// camera
			const camera = new THREE.PerspectiveCamera( 30.0, window.innerWidth / window.innerHeight, 0.1, 20.0 );
			camera.position.set( 0.0, 1.0, 5.0 );

			// camera controls
			const controls = new OrbitControls( camera, renderer.domElement );
			controls.screenSpacePanning = true;
			controls.target.set( 0.0, 1.0, 0.0 );
			controls.update();

			// scene
			const scene = new THREE.Scene();

			// light
			const light = new THREE.DirectionalLight( 0xffffff, Math.PI );
			light.position.set( 1.0, 1.0, 1.0 ).normalize();
			scene.add( light );

			// gltf and vrm
			let currentVrm = undefined;
			let currentMixer = undefined;
			const loader = new GLTFLoader();
			loader.crossOrigin = 'anonymous';

			loader.register( ( parser ) => {

				return new VRMLoaderPlugin( parser );

			} );

			loader.load(

				'./models/VRM1_Constraint_Twist_Sample.vrm',

				( gltf ) => {

					const vrm = gltf.userData.vrm;

					// calling these functions greatly improves the performance
					VRMUtils.removeUnnecessaryVertices( gltf.scene );
					VRMUtils.combineSkeletons( gltf.scene );

					// Disable frustum culling
					vrm.scene.traverse( ( obj ) => {

						obj.frustumCulled = false;

					} );

					scene.add( vrm.scene );
					currentVrm = vrm;
					prepareAnimation( vrm );
					console.log( vrm );

				},

				( progress ) => console.log( 'Loading model...', 100.0 * ( progress.loaded / progress.total ), '%' ),

				( error ) => console.error( error )

			);

			// animation
			function prepareAnimation( vrm ) {

				currentMixer = new THREE.AnimationMixer( vrm.scene );

				const quatA = new THREE.Quaternion( 0.0, 0.0, 0.0, 1.0 );
				const quatB = new THREE.Quaternion( 0.0, 0.0, 0.0, 1.0 );
				quatB.setFromEuler( new THREE.Euler( 0.0, 0.0, 0.25 * Math.PI ) );

				const armTrack = new THREE.QuaternionKeyframeTrack(
					vrm.humanoid.getNormalizedBoneNode( 'leftUpperArm' ).name + '.quaternion', // name
					[ 0.0, 0.5, 1.0 ], // times
					[ ...quatA.toArray(), ...quatB.toArray(), ...quatA.toArray() ] // values
				);

				const blinkTrack = new THREE.NumberKeyframeTrack(
					vrm.expressionManager.getExpressionTrackName( 'blink' ), // name
					[ 0.0, 0.5, 1.0 ], // times
					[ 0.0, 1.0, 0.0 ] // values
				);

				const clip = new THREE.AnimationClip( 'Animation', 1.0, [ armTrack, blinkTrack ] );
				const action = currentMixer.clipAction( clip );
				action.play();

			}

			// helpers
			const gridHelper = new THREE.GridHelper( 10, 10 );
			scene.add( gridHelper );

			const axesHelper = new THREE.AxesHelper( 5 );
			scene.add( axesHelper );

			// animate
			const clock = new THREE.Clock();

			function animate() {

				requestAnimationFrame( animate );

				const deltaTime = clock.getDelta();

				if ( currentVrm ) {

					currentVrm.update( deltaTime );

				}

				if ( currentMixer ) {

					currentMixer.update( deltaTime );

				}

				renderer.render( scene, camera );

			}

			animate();
		