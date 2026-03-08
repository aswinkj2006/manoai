import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, RoundedBox, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

// ─── Hand Pose Configuration Types ───────────────────────────────────────────
interface FingerConfig {
    mcp: number;   // Metacarpophalangeal joint rotation (base)
    pip: number;   // Proximal interphalangeal joint rotation (middle)
    spread?: number; // Lateral spread (Z rotation on MCP group)
}

interface HandPose {
    index: FingerConfig;
    middle: FingerConfig;
    ring: FingerConfig;
    pinky: FingerConfig;
    // Thumb: [Z-axis tuck/spread, X-axis up/down]
    thumb: [number, number];
    // Optional whole-hand rotation adjustments
    wristX?: number;
    wristZ?: number;
}

// ─── Pose Dictionary — All 26 letters + numbers + common signs ───────────────
const CURL = Math.PI / 2;         // 90° = fully curled
const HALF = Math.PI / 4;         // 45° = half curled
const QCURL = Math.PI / 5.5;      // ~32° = gentle curl (resting)
const SLIGHT = Math.PI / 10;

const poses: Record<string, HandPose> = {
    // ── DEFAULT IDLE ──
    DEFAULT: {
        index: { mcp: QCURL, pip: QCURL, spread: 0.04 },
        middle: { mcp: QCURL * 1.1, pip: QCURL * 1.1, spread: 0 },
        ring: { mcp: QCURL * 1.2, pip: QCURL * 1.2, spread: -0.04 },
        pinky: { mcp: QCURL * 1.3, pip: QCURL * 1.3, spread: -0.08 },
        thumb: [0.3, 0.2],
    },

    // ── ALPHABET ──
    A: {
        index: { mcp: CURL, pip: CURL },
        middle: { mcp: CURL, pip: CURL },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [0.1, 0.5], // thumb alongside index, upright
    },
    B: {
        index: { mcp: 0, pip: 0 },
        middle: { mcp: 0, pip: 0 },
        ring: { mcp: 0, pip: 0 },
        pinky: { mcp: 0, pip: 0 },
        thumb: [Math.PI / 1.8, 0.2], // thumb folded across palm
    },
    C: {
        index: { mcp: HALF, pip: HALF, spread: 0.05 },
        middle: { mcp: HALF, pip: HALF, spread: 0 },
        ring: { mcp: HALF, pip: HALF, spread: -0.05 },
        pinky: { mcp: HALF, pip: HALF, spread: -0.1 },
        thumb: [0.3, 0.7], // thumb curves to match
    },
    D: {
        index: { mcp: 0, pip: 0 },       // index: straight up
        middle: { mcp: CURL, pip: HALF },  // others curl to meet thumb
        ring: { mcp: CURL, pip: HALF },
        pinky: { mcp: CURL, pip: HALF },
        thumb: [0.5, 0.5],                // thumb meets middle/ring tips
    },
    E: {
        index: { mcp: HALF, pip: CURL },
        middle: { mcp: HALF, pip: CURL },
        ring: { mcp: HALF, pip: CURL },
        pinky: { mcp: HALF, pip: CURL },
        thumb: [0.9, 0.4],  // thumb tucked under bent fingers
    },
    F: {
        index: { mcp: HALF, pip: HALF },  // index pinches with thumb
        middle: { mcp: 0, pip: 0, spread: 0.06 },
        ring: { mcp: 0, pip: 0, spread: 0 },
        pinky: { mcp: 0, pip: 0, spread: -0.05 },
        thumb: [0.3, 0.6],  // thumb meets index
    },
    G: {
        index: { mcp: HALF * 0.3, pip: 0, spread: 0 }, // index points sideways
        middle: { mcp: CURL, pip: CURL },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [0, 0.1],
        wristZ: 1.2, // rotate whole hand so index points sideways
    },
    H: {
        index: { mcp: SLIGHT, pip: 0, spread: 0.05 },
        middle: { mcp: SLIGHT, pip: 0, spread: -0.05 },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [CURL, 0.1],
        wristZ: 1.2, // rotate so index+middle point sideways
    },
    I: {
        index: { mcp: CURL, pip: CURL },
        middle: { mcp: CURL, pip: CURL },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: 0, pip: 0 },   // only pinky up
        thumb: [CURL * 0.8, 0.2],
    },
    J: {
        // J starts like I but draws a J curve — show I shape
        index: { mcp: CURL, pip: CURL },
        middle: { mcp: CURL, pip: CURL },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: 0, pip: 0 },
        thumb: [CURL * 0.8, 0.2],
    },
    K: {
        index: { mcp: 0, pip: 0, spread: 0.1 },
        middle: { mcp: SLIGHT * 1.5, pip: SLIGHT, spread: -0.1 },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [0.3, 0.4],  // thumb between index and middle
    },
    L: {
        index: { mcp: 0, pip: 0 },           // index straight up
        middle: { mcp: CURL, pip: CURL },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [-0.6, 0.1],  // thumb out to side (Z rotation outward)
    },
    M: {
        index: { mcp: HALF, pip: HALF },
        middle: { mcp: HALF, pip: HALF },
        ring: { mcp: HALF, pip: HALF },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [1.2, 0.4],  // thumb tucked deeply under 3 fingers
    },
    N: {
        index: { mcp: HALF, pip: HALF },
        middle: { mcp: HALF, pip: HALF },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [1.0, 0.4],  // thumb tucked under 2 fingers
    },
    O: {
        index: { mcp: HALF * 1.3, pip: HALF, spread: 0.05 },
        middle: { mcp: HALF * 1.3, pip: HALF, spread: 0 },
        ring: { mcp: HALF * 1.3, pip: HALF, spread: -0.05 },
        pinky: { mcp: HALF * 1.2, pip: HALF, spread: -0.1 },
        thumb: [0.2, 0.9],   // thumb curves to meet fingertips
    },
    P: {
        // Like K but pointed downward
        index: { mcp: 0, pip: 0, spread: 0.1 },
        middle: { mcp: SLIGHT * 1.5, pip: SLIGHT, spread: -0.1 },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [0.3, 0.4],
        wristX: 0.6,  // tilt hand forward/down
    },
    Q: {
        // Like G but pointed down
        index: { mcp: HALF * 0.3, pip: 0 },
        middle: { mcp: CURL, pip: CURL },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [0.2, 0.2],
        wristX: 0.6,
        wristZ: 0.8,
    },
    R: {
        index: { mcp: 0, pip: 0 },
        middle: { mcp: 0, pip: 0, spread: 0.18 }, // shifted to cross over index
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [CURL, 0.2],
    },
    S: {
        index: { mcp: CURL, pip: CURL },
        middle: { mcp: CURL, pip: CURL },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [0.3, 0.1],  // thumb across front of fist
    },
    T: {
        index: { mcp: CURL, pip: HALF },
        middle: { mcp: CURL, pip: CURL },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [0.4, 0.6],  // thumb inserts between index and middle
    },
    U: {
        index: { mcp: 0, pip: 0, spread: 0.03 },
        middle: { mcp: 0, pip: 0, spread: -0.03 },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [CURL, 0.2],
    },
    V: {
        index: { mcp: 0, pip: 0, spread: 0.15 },
        middle: { mcp: 0, pip: 0, spread: -0.15 },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [CURL, 0.2],
    },
    W: {
        index: { mcp: 0, pip: 0, spread: 0.15 },
        middle: { mcp: 0, pip: 0, spread: 0 },
        ring: { mcp: 0, pip: 0, spread: -0.15 },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [CURL, 0.2],
    },
    X: {
        index: { mcp: SLIGHT, pip: HALF },  // index hooks/bends
        middle: { mcp: CURL, pip: CURL },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [0.5, 0.3],
    },
    Y: {
        index: { mcp: CURL, pip: CURL },
        middle: { mcp: CURL, pip: CURL },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: 0, pip: 0 },  // pinky out
        thumb: [-0.3, 0.1],          // thumb out to side
    },
    Z: {
        // Z like index pointing, making a Z (show like a pointing hand)
        index: { mcp: 0, pip: 0 },
        middle: { mcp: CURL, pip: CURL },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [0.5, 0.2],
    },

    // ── NUMBERS ──
    '1': {
        index: { mcp: 0, pip: 0 },
        middle: { mcp: CURL, pip: CURL },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [CURL, 0.2],
    },
    '2': {
        index: { mcp: 0, pip: 0, spread: 0.12 },
        middle: { mcp: 0, pip: 0, spread: -0.12 },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [CURL, 0.2],
    },
    '3': {
        index: { mcp: 0, pip: 0, spread: 0.1 },
        middle: { mcp: 0, pip: 0, spread: 0 },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [-0.4, 0.1],  // thumb out to side (included in '3')
    },
    '4': {
        index: { mcp: 0, pip: 0, spread: 0.12 },
        middle: { mcp: 0, pip: 0, spread: 0.04 },
        ring: { mcp: 0, pip: 0, spread: -0.04 },
        pinky: { mcp: 0, pip: 0, spread: -0.12 },
        thumb: [CURL, 0.2],  // thumb folded
    },
    '5': {
        index: { mcp: 0, pip: 0, spread: 0.2 },
        middle: { mcp: 0, pip: 0, spread: 0.07 },
        ring: { mcp: 0, pip: 0, spread: -0.07 },
        pinky: { mcp: 0, pip: 0, spread: -0.2 },
        thumb: [-0.5, 0],  // thumb wide open
    },
    '6': {
        index: { mcp: 0, pip: 0, spread: 0.12 },
        middle: { mcp: 0, pip: 0, spread: 0.04 },
        ring: { mcp: 0, pip: 0, spread: -0.04 },
        pinky: { mcp: HALF, pip: HALF, spread: -0.12 }, // pinky touches thumb
        thumb: [0.3, 0.9],
    },
    '7': {
        index: { mcp: 0, pip: 0, spread: 0.12 },
        middle: { mcp: 0, pip: 0, spread: 0.04 },
        ring: { mcp: HALF, pip: HALF, spread: -0.04 }, // ring touches thumb
        pinky: { mcp: 0, pip: 0, spread: -0.15 },
        thumb: [0.3, 0.7],
    },
    '8': {
        index: { mcp: 0, pip: 0, spread: 0.12 },
        middle: { mcp: HALF, pip: HALF, spread: 0 },     // middle touches thumb
        ring: { mcp: 0, pip: 0, spread: -0.07 },
        pinky: { mcp: 0, pip: 0, spread: -0.15 },
        thumb: [0.3, 0.6],
    },
    '9': {
        index: { mcp: HALF, pip: HALF, spread: 0.06 }, // index touches thumb
        middle: { mcp: 0, pip: 0, spread: 0.04 },
        ring: { mcp: 0, pip: 0, spread: -0.04 },
        pinky: { mcp: 0, pip: 0, spread: -0.12 },
        thumb: [0.25, 0.6],
    },
    '10': {
        // Thumbs-up
        index: { mcp: CURL, pip: CURL },
        middle: { mcp: CURL, pip: CURL },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [-0.2, 0],  // thumb fully up
    },

    // ── COMMON SIGNS ──
    Hello: {
        index: { mcp: 0, pip: 0 },
        middle: { mcp: 0, pip: 0 },
        ring: { mcp: 0, pip: 0 },
        pinky: { mcp: 0, pip: 0 },
        thumb: [0.4, 0],
    },
    Goodbye: {
        index: { mcp: 0, pip: 0 },
        middle: { mcp: 0, pip: 0 },
        ring: { mcp: 0, pip: 0 },
        pinky: { mcp: 0, pip: 0 },
        thumb: [0.3, 0],
    },
    ThankYou: {
        // Flat hand at chin area
        index: { mcp: 0, pip: 0 },
        middle: { mcp: 0, pip: 0 },
        ring: { mcp: 0, pip: 0 },
        pinky: { mcp: 0, pip: 0 },
        thumb: [0.4, 0.1],
        wristX: -0.3,
    },
    Please: {
        // Flat hand on chest, circular
        index: { mcp: 0, pip: 0 },
        middle: { mcp: 0, pip: 0 },
        ring: { mcp: 0, pip: 0 },
        pinky: { mcp: 0, pip: 0 },
        thumb: [0.5, 0.1],
    },
    Sorry: {
        // Fist on chest
        index: { mcp: CURL, pip: CURL },
        middle: { mcp: CURL, pip: CURL },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [0.3, 0.2],
    },
    Yes: {
        // Fist bobbing — show fist
        index: { mcp: CURL, pip: CURL },
        middle: { mcp: CURL, pip: CURL },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [0.4, 0.3],
    },
    No: {
        // Index + middle snapping down to thumb
        index: { mcp: SLIGHT, pip: HALF },
        middle: { mcp: SLIGHT, pip: HALF },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [0.4, 0.5],
    },
    Love: {
        // Arms crossed over chest — show a closed, hugging-like fist
        index: { mcp: CURL, pip: CURL },
        middle: { mcp: CURL, pip: CURL },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [0.1, 0],
        wristZ: -0.4,
    },
    Help: {
        // A-fist on flat palm — show A fist
        index: { mcp: CURL, pip: CURL },
        middle: { mcp: CURL, pip: CURL },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [0, 0.5],
    },
    Name: {
        // H-shape: index + middle extended sideways (show like U)
        index: { mcp: SLIGHT, pip: 0, spread: 0.05 },
        middle: { mcp: SLIGHT, pip: 0, spread: -0.05 },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [CURL, 0.2],
    },
    Fine: {
        index: { mcp: 0, pip: 0, spread: 0.1 },
        middle: { mcp: 0, pip: 0, spread: 0.03 },
        ring: { mcp: 0, pip: 0, spread: -0.03 },
        pinky: { mcp: 0, pip: 0, spread: -0.1 },
        thumb: [-0.3, 0],  // thumb up touching chest side
    },
    Want: {
        // Both curved hands pulling in — show claw/half-curl
        index: { mcp: SLIGHT, pip: HALF },
        middle: { mcp: SLIGHT, pip: HALF },
        ring: { mcp: SLIGHT, pip: HALF },
        pinky: { mcp: SLIGHT, pip: HALF },
        thumb: [0.3, 0.3],
    },
    You: {
        // Simply pointing forward with index
        index: { mcp: 0, pip: 0 },
        middle: { mcp: CURL, pip: CURL },
        ring: { mcp: CURL, pip: CURL },
        pinky: { mcp: CURL, pip: CURL },
        thumb: [CURL, 0.2],
        wristX: -0.8,  // point forward
    },
};

// ─── Hand Model Component ─────────────────────────────────────────────────────
const HandModel = ({ currentWord }: { currentWord: string }) => {
    const groupRef = useRef<THREE.Group>(null);
    const thumbRef = useRef<THREE.Group>(null);
    const indexMcpRef = useRef<THREE.Group>(null); const indexPipRef = useRef<THREE.Group>(null);
    const middleMcpRef = useRef<THREE.Group>(null); const middlePipRef = useRef<THREE.Group>(null);
    const ringMcpRef = useRef<THREE.Group>(null); const ringPipRef = useRef<THREE.Group>(null);
    const pinkyMcpRef = useRef<THREE.Group>(null); const pinkyPipRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        // Gentle floating animation
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.04;
        }

        // Resolve the target pose
        const key = currentWord ? currentWord.trim() : '';
        const pose = poses[key] || poses['DEFAULT'];

        const lerpSpeed = 0.12;
        const lerp = (ref: React.RefObject<THREE.Group | null>, target: number, axis: 'x' | 'z' = 'x') => {
            if (ref.current) ref.current.rotation[axis] = THREE.MathUtils.lerp(ref.current.rotation[axis], target, lerpSpeed);
        };

        // Apply finger curls
        lerp(indexMcpRef, pose.index.mcp); lerp(indexPipRef, pose.index.pip);
        lerp(middleMcpRef, pose.middle.mcp); lerp(middlePipRef, pose.middle.pip);
        lerp(ringMcpRef, pose.ring.mcp); lerp(ringPipRef, pose.ring.pip);
        lerp(pinkyMcpRef, pose.pinky.mcp); lerp(pinkyPipRef, pose.pinky.pip);

        // Apply finger spread (Z rotation on MCP)
        if (indexMcpRef.current) indexMcpRef.current.rotation.z = THREE.MathUtils.lerp(indexMcpRef.current.rotation.z, pose.index.spread ?? 0, lerpSpeed);
        if (middleMcpRef.current) middleMcpRef.current.rotation.z = THREE.MathUtils.lerp(middleMcpRef.current.rotation.z, pose.middle.spread ?? 0, lerpSpeed);
        if (ringMcpRef.current) ringMcpRef.current.rotation.z = THREE.MathUtils.lerp(ringMcpRef.current.rotation.z, pose.ring.spread ?? 0, lerpSpeed);
        if (pinkyMcpRef.current) pinkyMcpRef.current.rotation.z = THREE.MathUtils.lerp(pinkyMcpRef.current.rotation.z, pose.pinky.spread ?? 0, lerpSpeed);

        // Apply thumb
        if (thumbRef.current) {
            thumbRef.current.rotation.z = THREE.MathUtils.lerp(thumbRef.current.rotation.z, pose.thumb[0], lerpSpeed);
            thumbRef.current.rotation.x = THREE.MathUtils.lerp(thumbRef.current.rotation.x, pose.thumb[1], lerpSpeed);
        }

        // Apply wrist orientation
        if (groupRef.current) {
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pose.wristX ?? 0, lerpSpeed * 0.5);
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, pose.wristZ ?? 0, lerpSpeed * 0.5);
        }

        // Special animations
        if (key === 'Hello') {
            if (groupRef.current) groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.15 - 0.1;
        }
        if (key === 'Yes') {
            if (groupRef.current) groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 4) * 0.2;
        }
        if (key === 'No') {
            if (groupRef.current) groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 5) * 0.25;
        }
    });

    const skinColor = '#e8b48a';
    const skinColorDark = '#d4936a';
    const nailColor = '#f5d5c0';
    const RAD = 0.13;

    // Articulated finger with 3 segments
    const ArticulatedFinger = ({ position, mcpRef, pipRef, scale = 1, length = 0.65 }: any) => (
        <group position={position} ref={mcpRef}>
            {/* Proximal phalanx */}
            <Cylinder args={[RAD * scale, RAD * 0.95 * scale, length, 14]} position={[0, length / 2, 0]} castShadow>
                <meshStandardMaterial color={skinColor} roughness={0.5} metalness={0.05} />
            </Cylinder>
            {/* Knuckle */}
            <mesh position={[0, length, 0]}>
                <sphereGeometry args={[RAD * scale, 12, 12]} />
                <meshStandardMaterial color={skinColor} roughness={0.4} metalness={0.05} />
            </mesh>

            {/* PIP joint + Middle/Distal phalanges */}
            <group position={[0, length, 0]} ref={pipRef}>
                <Cylinder args={[RAD * 0.93 * scale, RAD * 0.88 * scale, length * 0.85, 14]} position={[0, (length * 0.85) / 2, 0]} castShadow>
                    <meshStandardMaterial color={skinColor} roughness={0.5} metalness={0.05} />
                </Cylinder>
                {/* DIP knuckle */}
                <mesh position={[0, length * 0.85, 0]}>
                    <sphereGeometry args={[RAD * 0.9 * scale, 12, 12]} />
                    <meshStandardMaterial color={skinColorDark} roughness={0.45} metalness={0.05} />
                </mesh>
                {/* Distal phalanx */}
                <group position={[0, length * 0.85, 0]}>
                    <Cylinder args={[RAD * 0.85 * scale, RAD * 0.7 * scale, length * 0.65, 14]} position={[0, (length * 0.65) / 2, 0]} castShadow>
                        <meshStandardMaterial color={skinColor} roughness={0.5} />
                    </Cylinder>
                    {/* Nail */}
                    <mesh position={[0, length * 0.65, RAD * 0.5 * scale]} rotation={[Math.PI / 2, 0, 0]}>
                        <boxGeometry args={[RAD * 1.2 * scale, RAD * 0.12, RAD * 0.7 * scale]} />
                        <meshStandardMaterial color={nailColor} roughness={0.2} metalness={0.1} />
                    </mesh>
                </group>
            </group>
        </group>
    );

    return (
        <group ref={groupRef} position={[0, -0.4, 0]}>
            {/* Palm */}
            <RoundedBox args={[1.4, 1.5, 0.38]} radius={0.12} position={[0, 0, 0]} castShadow>
                <meshStandardMaterial color={skinColor} roughness={0.45} metalness={0.05} />
            </RoundedBox>
            {/* Palm bottom highlight */}
            <mesh position={[0, -0.3, 0.18]}>
                <planeGeometry args={[1.2, 0.9]} />
                <meshStandardMaterial color={skinColorDark} roughness={0.6} transparent opacity={0.3} />
            </mesh>

            {/* Fingers */}
            <ArticulatedFinger position={[-0.48, 0.75, 0]} mcpRef={indexMcpRef} pipRef={indexPipRef} length={0.66} />
            <ArticulatedFinger position={[-0.16, 0.78, 0]} mcpRef={middleMcpRef} pipRef={middlePipRef} length={0.72} />
            <ArticulatedFinger position={[0.16, 0.76, 0]} mcpRef={ringMcpRef} pipRef={ringPipRef} length={0.67} />
            <ArticulatedFinger position={[0.50, 0.68, 0]} mcpRef={pinkyMcpRef} pipRef={pinkyPipRef} length={0.52} scale={0.82} />

            {/* Thumb */}
            <group position={[-0.78, -0.15, 0]} ref={thumbRef} rotation={[0, 0, 0.5]}>
                {/* Metacarpal */}
                <Cylinder args={[0.17, 0.16, 0.7, 14]} position={[-0.18, 0.28, 0]} rotation={[0, 0, 0.5]} castShadow>
                    <meshStandardMaterial color={skinColor} roughness={0.45} metalness={0.05} />
                </Cylinder>
                {/* CMC knuckle */}
                <mesh position={[-0.35, 0.6, 0]}>
                    <sphereGeometry args={[0.17, 12, 12]} />
                    <meshStandardMaterial color={skinColor} roughness={0.4} />
                </mesh>
                {/* Proximal phalanx */}
                <Cylinder args={[0.155, 0.14, 0.55, 14]} position={[-0.35 - 0.12, 0.6 + 0.2, 0]} rotation={[0, 0, 0.45]} castShadow>
                    <meshStandardMaterial color={skinColor} roughness={0.45} />
                </Cylinder>
                {/* Nail area */}
                <mesh position={[-0.6, 0.9, 0.12]} rotation={[Math.PI / 2.5, 0, 0.4]}>
                    <boxGeometry args={[0.2, 0.04, 0.22]} />
                    <meshStandardMaterial color={nailColor} roughness={0.2} metalness={0.1} />
                </mesh>
            </group>

            {/* Wrist */}
            <Cylinder args={[0.58, 0.48, 0.9, 16]} position={[0, -1.15, 0]} castShadow>
                <meshStandardMaterial color={skinColor} roughness={0.45} metalness={0.05} />
            </Cylinder>
            {/* Wrist bottom */}
            <mesh position={[0, -1.6, 0]}>
                <sphereGeometry args={[0.48, 16, 16]} />
                <meshStandardMaterial color={skinColorDark} roughness={0.5} />
            </mesh>
        </group>
    );
};

// ─── POSE LABEL COMPONENT ──────────────────────────────────────────────────────
const PoseLabel = ({ word }: { word: string }) => {
    const label = word.toUpperCase();
    const isLetter = label.length === 1 && /[A-Z]/.test(label);
    const isNumber = /^[0-9]+$/.test(label);
    const category = isLetter ? 'LETTER' : isNumber ? 'NUMBER' : 'SIGN';

    return (
        <div style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '20px',
            padding: '6px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            pointerEvents: 'none',
        }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>{category}</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: '1px' }}>{label}</span>
        </div>
    );
};

// ─── AVATAR VIEWER EXPORT ─────────────────────────────────────────────────────
interface AvatarViewerProps {
    currentWord: string;
}

export const AvatarViewer: React.FC<AvatarViewerProps> = ({ currentWord }) => {
    const isKnown = currentWord && (poses[currentWord] !== undefined);

    return (
        <div style={{
            width: '100%', height: '100%',
            borderRadius: '16px', overflow: 'hidden',
            background: 'radial-gradient(ellipse at center, rgba(0,40,60,0.9) 0%, var(--color-surface) 100%)',
            border: '1px solid var(--color-border)',
            position: 'relative'
        }}>
            <Canvas camera={{ position: [0, 0.5, 4.2], fov: 55 }} shadows>
                <ambientLight intensity={0.7} />
                <directionalLight position={[4, 6, 5]} intensity={1.8} color="#fffaf0" castShadow
                    shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
                <directionalLight position={[-4, 3, -3]} intensity={0.5} color="#a0d8ef" />
                <directionalLight position={[0, -3, 3]} intensity={0.2} color="#ffd0a0" />

                <HandModel currentWord={currentWord} />

                <Environment preset="apartment" />
                <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={12} blur={2.5} far={5} />
                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minPolarAngle={Math.PI / 5}
                    maxPolarAngle={Math.PI / 1.4}
                    autoRotate={!currentWord}
                    autoRotateSpeed={0.8}
                    minDistance={2}
                    maxDistance={7}
                />
            </Canvas>

            {/* Sign label */}
            {currentWord && <PoseLabel word={currentWord} />}

            {/* Rotation hint */}
            <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(4px)',
                padding: '5px 14px',
                borderRadius: '12px',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.75rem',
                pointerEvents: 'none',
                border: '1px solid rgba(255,255,255,0.08)',
                whiteSpace: 'nowrap',
            }}>
                🖱️ Drag to rotate · Scroll to zoom
            </div>

            {/* Unknown pose warning */}
            {currentWord && !isKnown && (
                <div style={{
                    position: 'absolute',
                    bottom: '44px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255, 100, 0, 0.15)',
                    border: '1px solid rgba(255,140,0,0.4)',
                    borderRadius: '8px',
                    padding: '4px 12px',
                    fontSize: '0.72rem',
                    color: '#ffaa55',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                }}>
                    3D pose not yet available for "{currentWord}"
                </div>
            )}
        </div>
    );
};
