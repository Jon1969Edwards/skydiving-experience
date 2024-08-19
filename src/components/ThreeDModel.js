import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeDModel = () => {
  const mountRef = useRef(null);
  const mixerRef = useRef(null);
  const headRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    const clock = new THREE.Clock();

    let scene = new THREE.Scene();
    let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement);

    let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0.9, 13.9);

    const MODEL_PATH = 'https://holydiver2.s3.eu-north-1.amazonaws.com/falling2.glb';

    const loadModel = (modelPath) => {
      const loader = new GLTFLoader();

      loader.load(
        modelPath,
        (gltf) => {
          const model = gltf.scene;
          model.rotation.y = Math.PI;
          model.position.y = -0.9;
          model.position.z = 7;

          scene.add(model);

          model.traverse((object) => {
            if (object.isBone && object.name === 'mixamorigNeck') {
              headRef.current = object;
            }
          });

          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;

          if (gltf.animations.length) {
            console.log("Available animations:", gltf.animations.map(clip => clip.name));
            const idleClip = THREE.AnimationClip.findByName(gltf.animations, 'idle');
            if (idleClip) {
              const idleAction = mixer.clipAction(idleClip);
              idleAction.play();
            } else {
              console.error("Idle animation not found.");
            }
          }
        },
        undefined,
        (error) => console.error('An error occurred while loading the model', error)
      );
    };

    const addLights = () => {
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
      hemiLight.position.set(0, 50, 0);
      scene.add(hemiLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
      dirLight.position.set(-8, 12, 8);
      scene.add(dirLight);
    };

    const onMouseMove = (event) => {
      if (headRef.current) {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, -mouseX * 0.5, 0.1);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -mouseY * 0.5, 0.1);
      }
    };

    const update = () => {
      requestAnimationFrame(update);
      const delta = clock.getDelta();
      if (mixerRef.current) mixerRef.current.update(delta);
      renderer.render(scene, camera);
    };

    window.addEventListener('mousemove', onMouseMove);

    loadModel(MODEL_PATH);
    addLights();
    update();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default ThreeDModel;
