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
    
    const [sceneObjects, setSceneObjects] = React.useState(new Map());
    
    // initial setup of scene, camera, and renderer when component mounts.
    React.useEffect(() => {
        
        const rendererInit = new THREE.WebGLRenderer();
        rendererInit.setSize(window.innerWidth, window.innerHeight);
        if (mountPoint.current !== null) mountPoint.current.appendChild(rendererInit.domElement);
        const sceneInit = new THREE.Scene();
        const cameraInit = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // DO all setup related things here //

        // manage the state of the scene, camera, and renderer, which allows for them to be accessible in other
        // hooks and parts of this component function, like setupSceneObjects() below
        setScene(sceneInit);
        setCamera(cameraInit);
        setRenderer(rendererInit);

        // for when the component unmounts
        return ()=>{
            stop();
        }
    }, [])


    // This hook handles inserting objects into the scene once the scene is generated.
    // Note that had to guard here to avoid issues with this being called on initial mount when everything is undefined
    React.useEffect(()=>{
        if(scene != null){
            setupSceneObjects()
        }
    }, [scene])

    // Note that here, in addition to adding the cube to the scene, I'm adding it to a map called sceneObjects.
    //   sceneObjects is defined in the top as a React State, and can be referenced in the animation loop
    //    to make changes to specific
    const setupSceneObjects = () => {
        const cube = new THREE.Mesh(geometry, material);
        setSceneObjects(sceneObjects.set('cube1', cube));
        scene.add(cube);        
        camera.position.z = 5;
    }

    // When props (i.e. speed) change from the parent component, we want the variables within animate() to be updated accordingly. 
    //  This can be done by stopping and reinitializing animate().
    // we also want this to happen when objects in the scene are added or removed
    React.useEffect(()=>{
        if(scene != null){
            stop(); start();
        }
    },[speed, scene, sceneObjects])

    // This function runs when animate() is called. 
    // All objects intended for update should be managed with React.useState() and 
    //   should be included as dependencies in the hook above.
    const updateScene = () => {
        const cube = sceneObjects.get('cube1');
        cube.rotation.x += speed;
        cube.rotation.y += speed;
        
    };

    const animate = () => {
        frameId.current = (window.requestAnimationFrame(animate)); 
        updateScene();
        renderer.render(scene, camera);
    }

    const start = () => {
        if(!frameId.current) frameId.current = (window.requestAnimationFrame(animate));
    }
    const stop = () => {
        cancelAnimationFrame(frameId.current);
        frameId.current = 0;
    }

    return (
        <div ref={mountPoint} />
    );
}

export default ThreeScene;
