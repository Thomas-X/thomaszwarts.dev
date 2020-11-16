import React, {useEffect, useRef, useState} from "react";
import {PerspectiveCamera} from "@react-three/drei";
import {useFrame} from "react-three-fiber";
import lerp from "lerp";

export const Camera = (props) => {
    const mesh = useRef()
    const [z, setZ] = useState(16);
    useEffect(() => {
        let xDown = undefined;
        let yDown = undefined;
        const onScroll = (e, type) => {
            e.preventDefault()
            if (type === 'touchmove') {
                if (!xDown || !yDown) {
                    return;
                }
            }
            let x = (() => {
                if (type === 'touchmove') {
                    return e.touches[0].clientX
                } else if (type === 'wheel') {
                    return e.deltaX;
                }
            })()
            const y = (() => {
                if (type === 'touchmove') {
                    return e.touches[0].clientY;
                } else if (type === 'wheel') {
                    return e.deltaY;
                }
            })();
            const modifier = (() => {
                if (type === 'touchmove') {
                    return 0.0010;
                } else if (type === 'wheel') {
                    return 0.0065
                }
            })()

            if (type === 'touchmove') {
                const xDiff = xDown - x;
                const yDiff = yDown - y;
                if (Math.abs(xDiff) > Math.abs(yDiff)) {
                    if (xDiff > 0) {
                        // left swipe
                        console.log("SWIPE LEFT", xDiff)
                        x = xDiff
                    } else {
                        // right swipe
                        console.log("SWIPE RIGHT", xDiff)
                        x = xDiff
                    }

                }
            }

            if (type === 'wheel') {
                mesh.current.position.x += y * modifier
            } else if (type === 'touchmove') {
                mesh.current.position.x += x * modifier
            }

            // keyframing of camera (how to get this smooth?)
            if (mesh.current.position.x >= 2) {
                setZ(25)
            } else if (mesh.current.position.x < 2) {
                setZ(16)
            }
        }
        const onWheel = (e) => onScroll(e, 'wheel');
        const onTouchMove = (e) => onScroll(e, 'touchmove');
        const onTouchStart = (e) => {
            xDown = e.touches[0].clientX;
            yDown = e.touches[0].clientY;
        }

        window.addEventListener('wheel', onWheel)
        window.addEventListener('touchmove', onTouchMove)
        window.addEventListener('touchstart', onTouchStart)
        return () => {
            window.removeEventListener('touchstart', onTouchStart)
            window.removeEventListener('wheel', onWheel)
            window.removeEventListener('touchmove', onTouchMove)
        }
    }, [])

    useFrame(() => {
        mesh.current.position.z = lerp(mesh.current.position.z, z, 0.05)
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
