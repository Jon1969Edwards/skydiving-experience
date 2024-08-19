import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeDModel = () => {
  const mountRef = useRef(null);
  const mixerRef = useRef(null);
  const neckRef = useRef(null);
  const waistRef = useRef(null);
  const currentlyAnimatingRef = useRef(false); // Use useRef for currentlyAnimating

  useEffect(() => {
    const clock = new THREE.Clock();
    const currentMount = mountRef.current;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, -3, 30);

    const MODEL_PATH = 'https://holydiver2.s3.eu-north-1.amazonaws.com/falling2.glb';
    const textureLoader = new THREE.TextureLoader();
    const stacyTexture = textureLoader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy.jpg');
    stacyTexture.flipY = false;
    const stacyMaterial = new THREE.MeshPhongMaterial({ map: stacyTexture, color: 0xffffff, skinning: true });

    const loader = new GLTFLoader();

    loader.load(MODEL_PATH, (gltf) => {
      const model = gltf.scene;
      model.scale.set(7, 7, 7);
      model.position.y = -11;
      scene.add(model);

      const fileAnimations = gltf.animations;
      fileAnimations.forEach((clip) => {
        console.log('Animation name:', clip.name);
      });
      model.traverse((object) => {
        if (object.isMesh) {
          object.castShadow = true;
          object.receiveShadow = true;
          object.material = stacyMaterial;
        }
        if (object.isBone && object.name === 'mixamorigNeck') {
          neckRef.current = object;
        }
        if (object.isBone && object.name === 'mixamorigSpine') {
          waistRef.current = object;
        }
      });

      mixerRef.current = new THREE.AnimationMixer(model);

      const animationClip = THREE.AnimationClip.findByName(fileAnimations, 'Armature|mixamo.com|Layer0');
      animationClip.tracks.splice(3, 3);
      animationClip.tracks.splice(9, 3);
      const animationAction = mixerRef.current.clipAction(animationClip);
      animationAction.play();

      const possibleAnims = fileAnimations.filter((val) => val.name !== 'Armature|mixamo.com|Layer0').map((val) => {
        let clip = THREE.AnimationClip.findByName(fileAnimations, val.name);
        clip.tracks.splice(3, 3);
        clip.tracks.splice(9, 3);
        return mixerRef.current.clipAction(clip);
      });

      window.addEventListener('click', () => {
        if (!currentlyAnimatingRef.current) {
          currentlyAnimatingRef.current = true;
          const animIndex = Math.floor(Math.random() * possibleAnims.length);
          playModifierAnimation(animationAction, 0.25, possibleAnims[animIndex], 0.25);
        }
      });

      function playModifierAnimation(from, fSpeed, to, tSpeed) {
        if (!to) {
          console.error('Animation action is undefined.');
          currentlyAnimatingRef.current = false;
          return;
        }
      
        to.setLoop(THREE.LoopOnce);
        to.reset();
        to.play();
        from.crossFadeTo(to, fSpeed, true);
      
        setTimeout(() => {
          from.enabled = true;
          to.crossFadeTo(from, tSpeed, true);
          currentlyAnimatingRef.current = false;
        }, to._clip.duration * 1000 - (tSpeed + fSpeed) * 1000);
      }
      
    });

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
    dirLight.position.set(-8, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    scene.add(dirLight);

    const floorGeometry = new THREE.PlaneGeometry(5000, 5000);
    const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xeeeeee, shininess: 0 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.position.y = -11;
    scene.add(floor);

    document.addEventListener('mousemove', (e) => {
      const mousecoords = getMousePos(e);
      if (neckRef.current && waistRef.current) {
        moveJoint(mousecoords, neckRef.current, 50);
        moveJoint(mousecoords, waistRef.current, 30);
      }
    });

    const getMousePos = (e) => {
      return { x: e.clientX, y: e.clientY };
    };

    const moveJoint = (mouse, joint, degreeLimit) => {
      const degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
      joint.rotation.y = THREE.MathUtils.degToRad(degrees.x);
      joint.rotation.x = THREE.MathUtils.degToRad(degrees.y);
    };

    const getMouseDegrees = (x, y, degreeLimit) => {
      let dx = 0,
        dy = 0,
        xdiff,
        xPercentage,
        ydiff,
        yPercentage;

      const w = { x: window.innerWidth, y: window.innerHeight };

      if (x <= w.x / 2) {
        xdiff = w.x / 2 - x;
        xPercentage = (xdiff / (w.x / 2)) * 100;
        dx = ((degreeLimit * xPercentage) / 100) * -1;
      }
      if (x >= w.x / 2) {
        xdiff = x - w.x / 2;
        xPercentage = (xdiff / (w.x / 2)) * 100;
        dx = (degreeLimit * xPercentage) / 100;
      }
      if (y <= w.y / 2) {
        ydiff = w.y / 2 - y;
        yPercentage = (ydiff / (w.y / 2)) * 100;
        dy = (((degreeLimit * 0.5) * yPercentage) / 100) * -1;
      }
      if (y >= w.y / 2) {
        ydiff = y - w.y / 2;
        yPercentage = (ydiff / (w.y / 2)) * 100;
        dy = (degreeLimit * yPercentage) / 100;
      }
      return { x: dx, y: dy };
    };

    const animate = () => {
      requestAnimationFrame(animate);
      if (mixerRef.current) mixerRef.current.update(clock.getDelta());
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (currentMount) {
        currentMount.removeChild(renderer.domElement); // Cleanup using the copied ref value
      }
    };
  }, []);

  return <div ref={mountRef} />;
};

export default ThreeDModel;
