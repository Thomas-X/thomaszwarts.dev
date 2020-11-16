import ReactDOM from 'react-dom'
import React, {useEffect, useState} from 'react'
import {Canvas, useLoader} from 'react-three-fiber'
import {Stars, TrackballControls, RoundedBox, useNormalTexture, OrbitControls} from '@react-three/drei'
import './App.css'
import * as THREE from "three"
import RalewayBold from "./Raleway_Bold.json";
import {Camera} from "./Camera";

function App() {
    const font = new THREE.FontLoader().parse(RalewayBold);

    const textOptions = {
        font,
        size: 5,
        height: 1
    };

    const repeat = 8
    const scale = 4
    const [normalMap, url] = useNormalTexture(
        3, // index of the normal texture - https://github.com/emmelleppi/normal-maps/blob/master/normals.json
        // second argument is texture attributes
        {
            offset: [0, 0],
            repeat: [repeat, repeat],
            anisotropy: 8
        }
    )


    return (
        <Canvas colorManagement>
            <Camera/>
            <ambientLight castShadow={true}/>
            <spotLight
                intensity={0.6}
                position={[20, 20, 20]}
                shadow-bias={-0.00005}
                angle={Math.PI / 6}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                castShadow
            />
            <mesh position={[0, 20, 0]}>
                <textGeometry attach='geometry' args={['ya yeet', textOptions]}/>
                <meshStandardMaterial
                    attach='material'
                    normalMap={normalMap}
                    normalScale={[scale, scale]}
                    roughness={0.9}
                    metalness={0.1}
                />
            </mesh>

            <RoundedBox
                args={[2, 2, 2]}
                position={[0,2,-5]}
                radius={0.05}
                smoothness={4}
            >
                <meshStandardMaterial attach="material" color="orange"/>
            </RoundedBox>

            <RoundedBox
                args={[1, 1, 1]}
                radius={0.05}
                smoothness={4}
            >
                <meshStandardMaterial attach="material" color="orange"/>
            </RoundedBox>

        </Canvas>
    );
}

export default App;
