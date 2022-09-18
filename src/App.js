import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { useRef, useState, Suspense, useMemo } from 'react'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import starPng from './assets/star.png'

function Box(props) {
    // This reference will give us direct access to the mesh
    const mesh = useRef()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => (mesh.current.rotation.x += 0.01))
    // Return view, these are regular three.js elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={mesh}
            scale={active ? 2.5 : 2}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}

const Stars = () => {
    const starSprite = useLoader(TextureLoader, starPng)
    const vertice = () => Math.random() * 600 - 300
    // const mesh = useRef()

    const count = 6000

    const positions = useMemo(() => {
        const positions = []

        for (let xi = 0; xi < count; xi++) {
            positions.push(vertice(), vertice(), vertice())
            // for(let zi = 0; zi < count; zi++) {
            //     const x = sep * (xi - count / 2)
            //     const z = sep * (zi - count / 2)
            //     const y = 0
            //     positions.push(x,y,z)
            // }
        }

        console.log(positions)
        return new Float32Array(positions)
    }, [count])

    return (
        <points>
            <bufferGeometry attach="geometry" >
                <bufferAttribute
                    attach={'attributes-position'}
                    array={positions}
                    count={positions.length / 3}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial attach="material" map={starSprite} color={0xaaaaaa} size={0.8} transparent={false}
                alphaTest={0.5} opacity={1.0} />
        </points>
    )
}


const App = () => {

    const camera = { fov: 60, aspect: window.innerWidth / window.innerHeight, position: [100, 10, 0] }


    return (
              <Suspense fallback={null}>
                <Canvas camera={camera}>
                  <Stars />
                  <ambientLight />
                  <pointLight position={[10, 10, 10]} />
                  {/*<Box position={[-1.2, 0, 0]} />*/}
                  <Box position={[1.2, 0, 0]} />
                </Canvas>
              </Suspense>
    )
}

export default App
