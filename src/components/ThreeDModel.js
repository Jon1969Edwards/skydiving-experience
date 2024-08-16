import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeDModel = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    let scene, renderer, camera, model, mixer;
    const clock = new THREE.Clock();

    const MODEL_PATH = 'https://holydiver2.s3.eu-north-1.amazonaws.com/falling2.glb';

    const init = () => {
      scene = new THREE.Scene();
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      currentMount.appendChild(renderer.domElement);

      camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0.9, 13.9); // Adjust camera position

      loadModel(MODEL_PATH);
      addLights();
      update();
    };

    const loadModel = (modelPath) => {
      const loader = new GLTFLoader();

      loader.load(
        modelPath,
        (gltf) => {
          model = gltf.scene;
          // Correct the model's rotation and position
          model.rotation.y = Math.PI; 
          model.rotation.x = 0.9; // Ensure it's upright

          // Move the model up and closer to the camera
          model.position.y = -0.9; // Move up
          model.position.z = 7; // Move closer to the camera

          scene.add(model);

          mixer = new THREE.AnimationMixer(model);
          const animationAction = mixer.clipAction(gltf.animations[0]);
          animationAction.play();
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

    const update = () => {
      requestAnimationFrame(update);
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
      renderer.render(scene, camera);
    };

    init();

    return () => {
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default ThreeDModel;
