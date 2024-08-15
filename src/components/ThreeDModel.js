import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeDModel = () => {
  const mountRef = useRef(null);
  let head; // Variable to store the reference to the head bone or mesh

  useEffect(() => {
    let scene, renderer, camera, model, mixer;
    const clock = new THREE.Clock();
    const mouse = new THREE.Vector2();

    const MODEL_PATH = 'https://holydiver2.s3.eu-north-1.amazonaws.com/falling2.glb'; // Updated model URL

    const init = () => {
      scene = new THREE.Scene();

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.shadowMap.enabled = true;
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);

      camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0.9, 13.9); // Adjusted camera position

      loadModel(MODEL_PATH);
      addLights();
      update();

      // Add mouse movement listener
      document.addEventListener('mousemove', onMouseMove, false);
    };

    const loadModel = (modelPath) => {
      const loader = new GLTFLoader();

      loader.load(
        modelPath,
        (gltf) => {
          model = gltf.scene;

          // Traverse the model to find the head bone or mesh
          model.traverse((object) => {
            if (object.isBone && object.name.toLowerCase().includes('head')) {
              head = object;
            }
          });

          // Rotate the model 180 degrees around the y-axis and tilt it forward even more
          model.rotation.y = Math.PI;
          model.rotation.x = 1.5; // Further tilt the model forward

          // Move the model up and closer to the camera
          model.position.y = 2; // Move up
          model.position.z = 8; // Move closer to the camera

          scene.add(model);

          mixer = new THREE.AnimationMixer(model);
          const animationAction = mixer.clipAction(gltf.animations[0]);
          animationAction.play();
        },
        undefined,
        (error) => console.error('An error occurred while loading the model', error)
      );
    };

    const onMouseMove = (event) => {
      // Convert mouse position to normalized device coordinates (-1 to +1)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update head rotation to follow the mouse
      if (head) {
        const headRotationLimit = 0.3; // Limit the rotation to prevent unnatural movements
        head.rotation.y = THREE.MathUtils.clamp(mouse.x * headRotationLimit, -headRotationLimit, headRotationLimit);
        head.rotation.x = THREE.MathUtils.clamp(mouse.y * headRotationLimit, -headRotationLimit, headRotationLimit);
      }
    };

    const addLights = () => {
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
      hemiLight.position.set(0, 50, 0);
      scene.add(hemiLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
      dirLight.position.set(-8, 12, 8);
      dirLight.castShadow = true;
      scene.add(dirLight);
    };

    const update = () => {
      requestAnimationFrame(update);

      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);

      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      renderer.render(scene, camera);
    };

    const resizeRendererToDisplaySize = (renderer) => {
      const canvas = renderer.domElement;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const canvasPixelWidth = canvas.width / window.devicePixelRatio;
      const canvasPixelHeight = canvas.height / window.devicePixelRatio;

      const needResize =
        canvasPixelWidth !== width || canvasPixelHeight !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    };

    init();

    return () => {
      // Cleanup on component unmount
      mountRef.current.removeChild(renderer.domElement);
      document.removeEventListener('mousemove', onMouseMove, false);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default ThreeDModel;
