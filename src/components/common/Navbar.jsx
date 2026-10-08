'use client';
import React, { useState, useRef, useMemo, useEffect } from 'react'
import { navLinks } from './Header'
import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react'
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const MorphingText = ({ isExpanded, pathname, charRects, wordRects, logoRect, hoveredHref }) => {
    const { viewport } = useThree();
    const color = pathname === '/thesis' ? '#0b1a2c' : 'white';

    const sceneData = useMemo(() => {
        if (charRects.length === 0 || wordRects.length === 0) return { chars: [], activeDots: [] };

        const radius = 40;
        let chars = [];
        let activeDots = [];

        let circleCenterX = viewport.width / 2 - 100;
        let circleCenterY = viewport.height / 2 - 100;

        // Align circle's right edge with the right padding, and top edge with top-5
        if (logoRect && wordRects.length > 0) {
            const lastWord = wordRects[wordRects.length - 1];
            const paddingRightBoundary = lastWord.left + lastWord.width;

            const screenCenterX = paddingRightBoundary - radius;
            const screenCenterY = logoRect.top + radius; // top-5 margin exactly

            circleCenterX = screenCenterX - viewport.width / 2;
            circleCenterY = -(screenCenterY - viewport.height / 2);
        }

        const circumference = 2 * Math.PI * radius;

        // Calculate total width of all words
        let totalWordWidth = 0;
        wordRects.forEach(w => { totalWordWidth += w.width; });

        const totalWordAngle = (totalWordWidth / circumference) * Math.PI * 2;
        const remainingAngle = Math.PI * 2 - totalWordAngle;
        const gapAngle = remainingAngle / navLinks.length;

        // Start angle: center the first word at the very top of the circle (0 degrees)
        let currentAngle = 0;
        if (wordRects[0]) {
            currentAngle = - ((wordRects[0].width / 2) / circumference) * Math.PI * 2;
        }

        navLinks.forEach((link, wordIdx) => {
            const currentWordRect = wordRects[wordIdx];
            if (!currentWordRect) return;

            const wordChars = charRects.filter(r => r.wordIdx === wordIdx);

            // Map individual characters to angles
            wordChars.forEach((rect) => {
                const startX = rect.x - viewport.width / 2;
                const startY = -(rect.y - viewport.height / 2);

                // Character's offset relative to the left edge of the word
                const charOffset = rect.x - currentWordRect.left;
                const charAngle = (charOffset / circumference) * Math.PI * 2;
                const angle = currentAngle + charAngle;

                chars.push({
                    char: rect.char,
                    isBullet: false,
                    startX,
                    startY,
                    baseAngle: angle
                });
            });

            // Advance angle by the word's total width
            currentAngle += (currentWordRect.width / circumference) * Math.PI * 2;

            // Place the separator bullet exactly halfway through the gap
            const bulletAngle = currentAngle + gapAngle / 2;

            let bulletStartX = 0;
            let bulletStartY = -(currentWordRect.y - viewport.height / 2);
            if (wordIdx < navLinks.length - 1 && wordRects[wordIdx + 1]) {
                const nextWordRect = wordRects[wordIdx + 1];
                bulletStartX = ((currentWordRect.x + nextWordRect.x) / 2) - viewport.width / 2;
            } else {
                bulletStartX = (currentWordRect.x + 40) - viewport.width / 2;
            }

            chars.push({
                char: '•',
                isBullet: true,
                startX: bulletStartX,
                startY: bulletStartY,
                baseAngle: bulletAngle
            });

            // Advance angle past the gap
            currentAngle += gapAngle;

            // Active route indicator dot
            const wordStartX = currentWordRect.x - viewport.width / 2;
            const wordStartY = -(currentWordRect.y - viewport.height / 2);
            activeDots.push({
                href: link.href,
                startX: wordStartX,
                startY: wordStartY - 14, // Fixed distance below text center
            });
        });

        return { chars, activeDots, circleCenterX, circleCenterY, radius };
    }, [viewport.width, viewport.height, charRects, wordRects]);

    const charsRef = useRef();
    const activeDotsRef = useRef();

    useFrame((state, delta) => {
        if (!charsRef.current || !activeDotsRef.current) return;
        const targetProgress = isExpanded ? 0 : 1;
        const currentProgress = charsRef.current.userData.progress || 0;

        const newProgress = THREE.MathUtils.damp(currentProgress, targetProgress, 4.5, delta);
        charsRef.current.userData.progress = newProgress;

        let currentSpin = charsRef.current.userData.spin || 0;

        // Handle 360 degree spinning of the circular badge
        if (!isExpanded) {
            currentSpin += delta * 1.2; // 1.2 radians per second
            if (currentSpin >= Math.PI * 2) currentSpin -= Math.PI * 2;
        } else {
            // Find shortest path back to 0 rotation when expanding
            if (currentSpin > Math.PI) {
                currentSpin = THREE.MathUtils.damp(currentSpin, Math.PI * 2, 4.5, delta);
                if (currentSpin >= Math.PI * 2 - 0.001) currentSpin = 0;
            } else {
                currentSpin = THREE.MathUtils.damp(currentSpin, 0, 4.5, delta);
            }
        }
        charsRef.current.userData.spin = currentSpin;

        // Animate Characters
        charsRef.current.children.forEach((mesh, i) => {
            const data = sceneData.chars[i];
            if (!data) return;

            const currentAngle = data.baseAngle + currentSpin;
            const endX = sceneData.circleCenterX + Math.cos(currentAngle - Math.PI / 2) * sceneData.radius;
            const endY = sceneData.circleCenterY - Math.sin(currentAngle - Math.PI / 2) * sceneData.radius;
            const endRot = -currentAngle;

            mesh.position.x = THREE.MathUtils.lerp(data.startX, endX, newProgress);
            mesh.position.y = THREE.MathUtils.lerp(data.startY, endY, newProgress);

            const qTarget = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, !isExpanded ? endRot : 0));
            mesh.quaternion.slerp(qTarget, 0.1);

            if (mesh.material) {
                if (data.isBullet) {
                    mesh.material.transparent = true;
                    mesh.material.opacity = newProgress;
                } else {
                    mesh.material.transparent = true;
                    mesh.material.opacity = 1.0; // Text no longer fades on hover!
                }
            }
        });

        // Animate Active Dots
        activeDotsRef.current.children.forEach((mesh, i) => {
            const data = sceneData.activeDots[i];
            if (!data) return;

            const isActive = pathname === data.href;
            const isHovered = hoveredHref === data.href;

            // Active dot is visible if active OR hovered, but disappears when collapsed to circle
            const showDot = isExpanded && (isActive || isHovered);
            const targetOpacity = showDot ? 1.0 : 0.0;

            if (mesh.material) {
                mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, targetOpacity, 0.2);
            }
        });
    });

    return (
        <group>
            <group ref={charsRef}>
                {sceneData.chars.map((data, i) => (
                    <Text
                        key={i}
                        fontSize={16}
                        color={color}
                        anchorX="center"
                        anchorY="middle"
                        fontWeight="bold"
                    >
                        {data.char}
                        <meshBasicMaterial color={color} transparent />
                    </Text>
                ))}
            </group>
            <group ref={activeDotsRef}>
                {sceneData.activeDots.map((data, i) => (
                    <mesh key={i} position={[data.startX, data.startY, 0]}>
                        <circleGeometry args={[2.5, 32]} />
                        <meshBasicMaterial color={color} transparent opacity={0} />
                    </mesh>
                ))}
            </group>
        </group>
    );
}

const Navbar = () => {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isNavbarHovered, setIsNavbarHovered] = useState(false);
    const [hoveredHref, setHoveredHref] = useState(null);
    const [charRects, setCharRects] = useState([]);
    const [wordRects, setWordRects] = useState([]);
    const [logoRect, setLogoRect] = useState(null);

    const container = useRef(null);

    useGSAP(() => {
        const trigger = ScrollTrigger.create({
            start: () => window.innerHeight * 0.3,
            onEnter: () => setIsScrolled(true),
            onLeaveBack: () => setIsScrolled(false)
        });
        return () => { if (trigger) trigger.kill(); };
    }, []);

    // Extract exact layout locations from the DOM to map into 3D
    useEffect(() => {
        const measure = () => {
            const cNodes = document.querySelectorAll('.nav-char');
            const cRects = [];
            cNodes.forEach(node => {
                const rect = node.getBoundingClientRect();
                cRects.push({
                    char: node.dataset.char,
                    wordIdx: parseInt(node.dataset.wordIdx),
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                });
            });

            const wNodes = document.querySelectorAll('.nav-word');
            const wRects = [];
            wNodes.forEach(node => {
                const rect = node.getBoundingClientRect();
                wRects.push({
                    href: node.dataset.href,
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    left: rect.left,
                    width: rect.width
                });
            });

            const lNode = document.querySelector('.nav-logo');
            if (lNode) {
                setLogoRect(lNode.getBoundingClientRect());
            }

            if (cRects.length > 0) {
                setCharRects(cRects);
                setWordRects(wRects);
            }
        };

        setTimeout(measure, 50); // slight delay to ensure layout is computed
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, [pathname]);


    useGSAP(() => {
        let animDelay = 1
        if (pathname === "/") animDelay = 4.5
        if (pathname === "/about") animDelay = 1.5
        gsap.fromTo(".navbar",
            { opacity: 0 },
            {
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                delay: animDelay,
            }
        );
    }, [pathname])

    return (
        <div ref={container} className="navbar opacity-0 flex padding mix-blend-difference fixed z-[100000] w-full top-5 items-center justify-between pointer-events-none">
            {/* Logo */}
            <div className="nav-logo pointer-events-auto z-10">
                <Link href="/">
                    <svg width="51" height="44" viewBox="0 0 51 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50.7143 21.7422H41.4776V0.278763C41.4776 0.135165 41.3645 0.0184884 41.2242 0.00951348C41.0839 0.000538573 40.9572 0.103745 40.9391 0.242856C40.577 3.14175 39.3008 8.74658 34.8024 13.7277C33.8927 14.7373 32.9378 15.6079 31.9693 16.3842V0.274271C31.9693 0.130673 31.8562 0.0139965 31.7159 0.00502164C31.5711 -0.00395326 31.4489 0.0992669 31.4308 0.238378C31.0687 3.13727 29.7925 8.74209 25.2941 13.7232C24.3844 14.7328 23.4295 15.6034 22.4611 16.3797V0.269793C22.4611 0.126195 22.3479 0.00951841 22.2076 0.000543503C22.0673 -0.0084314 21.9406 0.0947751 21.9225 0.233886C21.5605 3.13278 20.2843 8.73761 15.7858 13.7187C10.2012 19.9069 3.05079 21.3832 0.235874 21.7333C0.0955806 21.7512 -0.00850306 21.8769 0.000548122 22.016C0.00959931 22.1596 0.127267 22.2673 0.272086 22.2673H9.51334V43.7308C9.51334 43.8743 9.62648 43.991 9.76677 44C9.7713 44 9.77583 44 9.78488 44C9.92064 44 10.0383 43.9013 10.0564 43.7622C10.4094 40.8678 11.6766 35.2719 16.1886 30.2774C17.1028 29.2677 18.0577 28.3926 19.0261 27.6208V43.7308C19.0261 43.8743 19.1393 43.991 19.2796 44C19.2841 44 19.2886 44 19.2977 44C19.4334 44 19.5511 43.9013 19.5692 43.7622C19.9222 40.8678 21.1894 35.2719 25.7014 30.2774C26.6156 29.2677 27.5705 28.3926 28.5389 27.6208V43.7308C28.5389 43.8743 28.6521 43.991 28.7924 44C28.7969 44 28.8014 44 28.8105 44C28.9462 44 29.0639 43.9013 29.082 43.7622C29.435 40.8678 30.7022 35.2719 35.2142 30.2774C40.8078 24.0892 47.9537 22.6128 50.7641 22.2628C50.9044 22.2448 51.0085 22.1192 50.9995 21.9801C50.9904 21.8365 50.8727 21.7288 50.7279 21.7288L50.7143 21.7422Z" fill={pathname === '/thesis' ? '#0b1a2c' : 'white'} />
                    </svg>
                </Link>
            </div>

            {/* 3JS Canvas for ultra-smooth layout morphing */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <Canvas style={{ pointerEvents: 'none' }} orthographic camera={{ position: [0, 0, 100], zoom: 1 }}>
                    <MorphingText
                        isExpanded={!isScrolled || isNavbarHovered}
                        pathname={pathname}
                        charRects={charRects}
                        wordRects={wordRects}
                        logoRect={logoRect}
                        hoveredHref={hoveredHref}
                    />
                </Canvas>
            </div>

            {/* Invisible Hitbox for the circular badge to trigger expansion */}
            {isScrolled && !isNavbarHovered && logoRect && wordRects.length > 0 && (
                <div
                    className="fixed rounded-full pointer-events-auto z-20 cursor-pointer"
                    style={{
                        width: 100, // slightly larger for easier hovering
                        height: 100,
                        top: logoRect.top - 10,
                        left: wordRects[wordRects.length - 1].left + wordRects[wordRects.length - 1].width - 90
                    }}
                    onMouseEnter={() => setIsNavbarHovered(true)}
                />
            )}

            {/* Invisible HTML layer to retain clickable bounding boxes and trigger hover state */}
            <div
                className={`nav-wrapper bg-transparent h-20 pointer-events-auto flex items-center justify-center z-10 transition-opacity duration-300 ${!isScrolled || isNavbarHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onMouseLeave={() => setIsNavbarHovered(false)}
            >
                <div className="nav-inline flex items-center gap-x-8 uppercase text-[1rem] font-semibold">
                    {navLinks.map((item, i) => {
                        return (
                            <Link
                                key={i}
                                href={item.href}
                                className="nav-word cursor-pointer font-semibold relative flex justify-center text-transparent outline-none"
                                data-href={item.href}
                                onMouseEnter={() => setHoveredHref(item.href)}
                                onMouseLeave={() => setHoveredHref(null)}
                            >
                                {item.label.toUpperCase().split('').map((char, j) => (
                                    <span
                                        key={j}
                                        className="nav-char"
                                        data-char={char}
                                        data-word-idx={i}
                                    >
                                        {char === ' ' ? '\u00A0' : char}
                                    </span>
                                ))}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default Navbar