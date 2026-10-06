"use client";
import React, { useRef, useEffect, useState, useCallback } from 'react';

const ContactNextBackground = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const nodesRef = useRef([]);
    const connectionsRef = useRef([]);
    const lastSpawnPos = useRef({ x: -9999, y: -9999 });
    const animRef = useRef(null);
    const nodeIdCounter = useRef(0);

    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    // Configuration
    const CONFIG = {
        maxNodes: 300,
        spawnDistance: 40,        // px of travel before spawning a new point
        connectionDistance: 120,  // max distance to connect to nearby points
        maxConnectionsPerNode: 3, // 1 to 3 connections
        lineDrawDuration: 600,    // ms to draw hairline
        nodeLifespan: 6000,       // ms to live before fading out
        nodeFadeTime: 1000,       // ms to linearly fade out
        nodeFadeInTime: 400,      // ms to fade in new points
        dotSize: 3,               // radius of points
        baseDotAlpha: 0.15,       // 15% alabaster
        baseLineAlpha: 0.10,      // 10% alabaster
        color: '242, 240, 230',   // Alabaster-ish white (rgb)
    };

    const createNode = useCallback((x, y) => {
        return {
            id: ++nodeIdCounter.current,
            x,
            y,
            born: performance.now(),
            alpha: 0,
            fadingOut: false,
            fadeStart: 0,
            connections: 0
        };
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        let destroyed = false;

        const resize = () => {
            const rect = container.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener('resize', resize);

        const onMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const now = performance.now();

            if (lastSpawnPos.current.x < 0) {
                lastSpawnPos.current = { x, y };
                return;
            }

            const dx = x - lastSpawnPos.current.x;
            const dy = y - lastSpawnPos.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist >= CONFIG.spawnDistance) {
                // Spawn a new node
                const newNode = createNode(x, y);

                // Find nearby nodes to connect to
                const nearby = [];
                for (const node of nodesRef.current) {
                    if (node.fadingOut) continue;
                    const ndx = node.x - x;
                    const ndy = node.y - y;
                    const ndistSq = ndx * ndx + ndy * ndy;
                    if (ndistSq <= CONFIG.connectionDistance * CONFIG.connectionDistance) {
                        nearby.push({ node, distSq: ndistSq });
                    }
                }

                // Sort by distance and pick up to maxConnectionsPerNode
                nearby.sort((a, b) => a.distSq - b.distSq);
                const connectionsToMake = Math.min(
                    CONFIG.maxConnectionsPerNode,
                    Math.max(1, Math.floor(Math.random() * CONFIG.maxConnectionsPerNode) + 1),
                    nearby.length
                );

                for (let i = 0; i < connectionsToMake; i++) {
                    const targetNode = nearby[i].node;
                    newNode.connections++;
                    targetNode.connections++;
                    connectionsRef.current.push({
                        a: newNode.id,
                        b: targetNode.id,
                        born: now
                    });
                }

                nodesRef.current.push(newNode);
                lastSpawnPos.current = { x, y };

                // Cap nodes
                const activeNodes = nodesRef.current.filter(n => !n.fadingOut);
                if (activeNodes.length > CONFIG.maxNodes) {
                    // Find oldest active node
                    const oldest = activeNodes[0];
                    if (oldest) {
                        oldest.fadingOut = true;
                        oldest.fadeStart = now;
                    }
                }
            }
        };

        const onMouseLeave = () => {
            lastSpawnPos.current = { x: -9999, y: -9999 };
        };

        window.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseleave', onMouseLeave);

        const render = () => {
            if (destroyed) return;
            const now = performance.now();
            const rect = container.getBoundingClientRect();
            ctx.clearRect(0, 0, rect.width, rect.height);

            const nodes = nodesRef.current;
            const connections = connectionsRef.current;

            // Process nodes
            for (let i = nodes.length - 1; i >= 0; i--) {
                const n = nodes[i];
                const age = now - n.born;

                if (n.fadingOut) {
                    const fadeProgress = (now - n.fadeStart) / CONFIG.nodeFadeTime;
                    if (fadeProgress >= 1) {
                        // Remove node and its connections
                        nodes.splice(i, 1);
                        for (let c = connections.length - 1; c >= 0; c--) {
                            if (connections[c].a === n.id || connections[c].b === n.id) {
                                connections.splice(c, 1);
                            }
                        }
                        continue;
                    }
                    n.alpha = CONFIG.baseDotAlpha * (1 - fadeProgress);
                } else {
                    if (age >= CONFIG.nodeLifespan) {
                        n.fadingOut = true;
                        n.fadeStart = now;
                    } else if (age < CONFIG.nodeFadeInTime) {
                        n.alpha = CONFIG.baseDotAlpha * (age / CONFIG.nodeFadeInTime);
                    } else {
                        n.alpha = CONFIG.baseDotAlpha;
                    }
                }
            }

            // Draw connections
            // Create a lookup for active nodes
            const nodeMap = new Map();
            for (const n of nodes) nodeMap.set(n.id, n);

            for (const conn of connections) {
                const a = nodeMap.get(conn.a);
                const b = nodeMap.get(conn.b);
                if (!a || !b) continue;

                const age = now - conn.born;
                let drawProgress = Math.min(1, age / CONFIG.lineDrawDuration);
                // Ease out cubic
                drawProgress = 1 - Math.pow(1 - drawProgress, 3);

                const lineAlpha = Math.min(a.alpha, b.alpha) * (CONFIG.baseLineAlpha / CONFIG.baseDotAlpha);

                if (lineAlpha > 0.005) {
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    // Draw line partially based on progress
                    const currentX = a.x + (b.x - a.x) * drawProgress;
                    const currentY = a.y + (b.y - a.y) * drawProgress;

                    ctx.lineTo(currentX, currentY);
                    ctx.strokeStyle = `rgba(${CONFIG.color}, ${lineAlpha.toFixed(3)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            // Draw nodes
            for (const n of nodes) {
                if (n.alpha < 0.005) continue;
                ctx.beginPath();
                ctx.arc(n.x, n.y, CONFIG.dotSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${CONFIG.color}, ${n.alpha.toFixed(3)})`;
                ctx.fill();
            }

            animRef.current = requestAnimationFrame(render);
        };

        animRef.current = requestAnimationFrame(render);

        return () => {
            destroyed = true;
            if (animRef.current) cancelAnimationFrame(animRef.current);
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseleave', onMouseLeave);
            window.removeEventListener('resize', resize);
        };
    }, [mounted, createNode]);

    if (!mounted) return null;

    return (
        <div ref={containerRef} className="absolute inset-0 z-0">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full block"
            />
        </div>
    );
};

export default ContactNextBackground;
