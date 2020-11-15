import React, {useEffect, useRef} from "react";
import {PerspectiveCamera} from "@react-three/drei";
import {useFrame} from "react-three-fiber";

export const Camera = (props) => {
    const mesh = useRef()

    useEffect(() => {
        console.log("ya")
        const onScroll = (e) => {
            console.log(e)
        }
        window.addEventListener('scroll', onScroll)
        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    }, [])

    useFrame(() => {
    })

    return (
        <PerspectiveCamera
            makeDefault
            position={[0, 0, 16]}
            fov={40}
            ref={mesh}
            {...props}
        >
        </PerspectiveCamera>
    )
}
