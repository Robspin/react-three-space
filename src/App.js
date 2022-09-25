import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { useRef, useState, Suspense, useMemo, useEffect } from 'react'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { FlyControls, useGLTF, useAnimations } from '@react-three/drei'
import starPng from './assets/star.png'


const SpaceShip = (props) => {
    const [movingForward, setMovingForward] = useState(false)
    const group = useRef()
    const gltf = useGLTF( '/models/starship/scene.gltf')
    const { actions, mixer } = useAnimations(gltf.animations, group)

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Shift': case 'm':
                    setMovingForward(true)
            }
        })
        document.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'Shift': case 'm':
                    setMovingForward(false)
            }
        })
    },[])

    useEffect(() => {
        const animation = actions['Take 001']
        animation.timeScale = 0.2
        animation.play()
        console.log(group.current)
    }, [mixer])

    useFrame(({ camera }) => {
        // Move mesh to be flush with camera
        group.current.position.copy(camera.position)
        group.current.translateY(-3)
        group.current.quaternion.copy(camera.quaternion)
        group.current.rotation.y -= 0.09
        if (movingForward) camera.translateZ(-0.5)

        group.current.translateZ(-25)
    })

    return <primitive {...props} scale={0.3} ref={group} object={gltf.scene} />
}

useGLTF.preload("/models/starship/scene.gltf")

function Box(props) {
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    const [movingForward, setMovingForward] = useState(false)
    const [turningUp, setTurningUp] = useState(false)
    const [turningDown, setTurningDown] = useState(false)
    const [turningLeft, setTurningLeft] = useState(false)
    const [turningRight, setTurningRight] = useState(false)
    const mesh = useRef()

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Shift': case 'm':
                    setMovingForward(true)
            }
        })
        document.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'Shift': case 'm':
                    setMovingForward(false)
            }
        })
        mesh.current.rotation.x = Math.PI / 2;
        // return () => {
        //     document.removeEventListener('keypress')
        // }
    },[])

    useFrame(({ camera }) => {
        // Move mesh to be flush with camera
        mesh.current.position.copy(camera.position)
        mesh.current.quaternion.copy(camera.quaternion)

        if (movingForward) camera.translateZ(-0.5)
        mesh.current.translateZ(-5)
        // if (turningUp) camera.rotation.y += 0.005
        // if (turningDown) camera.rotation.y -= 0.005
        // if (turningLeft) camera.rotation.x += 0.005
        // if (turningRight) camera.rotation.x -= 0.005



        // Apply offset
        // camera.rotation.x = 5
        // camera.rotation.y += Math.PI * 0.00025
        camera.rotation.x += 0.0002
        // mesh.current.rotation.x += 0.001
    })

    return (
        <mesh
            {...props}
            ref={mesh}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <axesHelper args={[10]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}

const Stars = () => {
    const starSprite = useLoader(TextureLoader, starPng)
    const vertice = () => Math.random() * 600 - 300
    const starsRef = useRef()
    const count = 6000

    useFrame(() => {
        // starsRef.current.rotation.x += 0.0002
        // starsRef.current.position.x += 0.01
    })

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

        return new Float32Array(positions)
    }, [count])

    return (
        <points ref={starsRef}>
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
                    <FlyControls movementSpeed={5} rollSpeed={0.1} />
                    <Stars />
                    <SpaceShip position={[90, 10, 0]} />
                  <ambientLight />
                  <pointLight position={[10, 10, 10]} />
                  {/*<Box position={[-1.2, 0, 0]} />*/}
                  {/*<Box position={[90, 10, 0]} />*/}
                </Canvas>
              </Suspense>
    )
}

export default App
