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
        spawnDistance: 40,        // px of travel before spawning a new point
        connectionDistance: 120,  // max distance to connect to nearby points
        maxConnectionsPerNode: 3, // 1 to 3 connections
        lineDrawDuration: 600,    // ms to draw hairline
        nodeFadeInTime: 400,      // ms to fade in new points
        dotSize: 3,               // radius of points
        baseDotAlpha: 0.5,       // 15% alabaster
        baseLineAlpha: 0.20,      // 10% alabaster
        color: '242, 240, 230',   // Alabaster-ish white (rgb)
    };

    const createNode = useCallback((x, y) => {
        return {
            id: ++nodeIdCounter.current,
            x,
            y,
            born: performance.now(),
            baked: false,
        };
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        // Finished points and lines are drawn once onto this layer and stay there permanently
        const bakeCanvas = document.createElement('canvas');
        const bakeCtx = bakeCanvas.getContext('2d');
        const nodeMap = new Map(nodesRef.current.map((n) => [n.id, n]));
        let width = 0;
        let height = 0;
        let destroyed = false;

        const drawLine = (c, a, b, progress, alpha) => {
            c.beginPath();
            c.moveTo(a.x, a.y);
            c.lineTo(a.x + (b.x - a.x) * progress, a.y + (b.y - a.y) * progress);
            c.strokeStyle = `rgba(${CONFIG.color}, ${alpha.toFixed(3)})`;
            c.lineWidth = 1;
            c.stroke();
        };

        const drawDot = (c, n, alpha) => {
            c.beginPath();
            c.arc(n.x, n.y, CONFIG.dotSize, 0, Math.PI * 2);
            c.fillStyle = `rgba(${CONFIG.color}, ${alpha.toFixed(3)})`;
            c.fill();
        };

        const rebake = () => {
            bakeCtx.clearRect(0, 0, width, height);
            for (const conn of connectionsRef.current) {
                if (conn.baked) drawLine(bakeCtx, nodeMap.get(conn.a), nodeMap.get(conn.b), 1, CONFIG.baseLineAlpha);
            }
            for (const n of nodesRef.current) {
                if (n.baked) drawDot(bakeCtx, n, CONFIG.baseDotAlpha);
            }
        };

        const resize = () => {
            const rect = container.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            height = rect.height;
            for (const [c, context] of [[canvas, ctx], [bakeCanvas, bakeCtx]]) {
                c.width = width * dpr;
                c.height = height * dpr;
                context.setTransform(dpr, 0, 0, dpr, 0, 0);
            }
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            rebake();
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
                    connectionsRef.current.push({
                        a: newNode.id,
                        b: nearby[i].node.id,
                        born: now,
                        baked: false,
                    });
                }

                nodesRef.current.push(newNode);
                nodeMap.set(newNode.id, newNode);
                lastSpawnPos.current = { x, y };
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
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(bakeCanvas, 0, 0, width, height);

            // Lines still drawing in; bake them once complete
            for (const conn of connectionsRef.current) {
                if (conn.baked) continue;
                const a = nodeMap.get(conn.a);
                const b = nodeMap.get(conn.b);
                const t = Math.min(1, (now - conn.born) / CONFIG.lineDrawDuration);
                if (t >= 1) {
                    conn.baked = true;
                    drawLine(bakeCtx, a, b, 1, CONFIG.baseLineAlpha);
                    drawLine(ctx, a, b, 1, CONFIG.baseLineAlpha);
                    continue;
                }
                // Ease out cubic
                drawLine(ctx, a, b, 1 - Math.pow(1 - t, 3), CONFIG.baseLineAlpha);
            }

            // Points still fading in; bake them once fully visible
            for (const n of nodesRef.current) {
                if (n.baked) continue;
                const t = Math.min(1, (now - n.born) / CONFIG.nodeFadeInTime);
                if (t >= 1) {
                    n.baked = true;
                    drawDot(bakeCtx, n, CONFIG.baseDotAlpha);
                }
                drawDot(ctx, n, CONFIG.baseDotAlpha * t);
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
