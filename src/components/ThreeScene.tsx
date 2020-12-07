import React from 'react';
import * as THREE from "three";



function ThreeScene({ speed = 0.01 }) {
    const mountPoint = React.useRef<HTMLDivElement>(null);
    
    const [scene, setScene] = React.useState<THREE.Scene>(null);
    const [camera, setCamera] = React.useState<THREE.PerspectiveCamera>(null);
    const [renderer, setRenderer] = React.useState<THREE.WebGLRenderer>(null);

    const frameId = React.useRef(0)
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    
    const [sceneObjects, setSceneObjects] = React.useState([]);
    
    
    const setupScene = () => {
        const cube = new THREE.Mesh(geometry, material);
        setSceneObjects((old) => [...old,cube]);
        scene.add(cube);        
        camera.position.z = 5;
    }

    const renderScene = () => {
        sceneObjects.forEach((obj)=>{
            obj.rotation.x += speed;
            obj.rotation.y += speed;
        })
        
    };

    const animate = () => {
        frameId.current = (window.requestAnimationFrame(animate)); 
        renderScene();
        renderer.render(scene, camera);
    }

    const start = () => {
        if(!frameId.current) frameId.current = (window.requestAnimationFrame(animate));
    }
    const stop = () => {
        cancelAnimationFrame(frameId.current);
        frameId.current = 0;
    }

    const restart = ()=>{stop();start();}

    // initial setup of scene, camera, and renderer when component mounts.
    React.useEffect(() => {
        setScene(() => new THREE.Scene() );
        setCamera( () => new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000) )
        setRenderer(() => new THREE.WebGLRenderer());

        return ()=>{
            stop();
        }
    }, [])

    // configuring renderer. Note that I had to guard with renderer != null because this runs once on mount 
    // (renderer is not defined then) and again on subsequent changes to renderer
    React.useEffect(()=>{
        if(renderer != null) {
            renderer.setSize(window.innerWidth, window.innerHeight);
            if (mountPoint.current !== null) mountPoint.current.appendChild(renderer.domElement);
        }
    },[renderer])

    // setting up the scene with objects and stuff. Note that had to guard here as well to avoid issues with 
    //   this being called on initial mount when everything is undefined
    React.useEffect(()=>{
        if(scene != null){
            setupScene();
        }
    }, [scene])

    // When props (i.e. speed) change from the parent component, we want the variables within animate() to be updated accordingly. 
    //  This can be done by stopping and reinitializing animate().
    // we also want this to happen when objects in the scene are added or removed
    React.useEffect(()=>{
        if(scene != null){
            restart();
        }
    },[speed, scene, sceneObjects])


    return (
        <div ref={mountPoint} />
    );
}

export default ThreeScene;
