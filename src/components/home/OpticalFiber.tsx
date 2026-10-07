"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type OpticalFiberProps = {
  className?: string;
  /** Scales the 3D scene inside the canvas without changing container size. */
  contentScale?: number;
  /** Half-arc as a fraction of π (0.5 = 180° semicircle). */
  fanSpread?: number;
  /** Multiplier for how far fibers extend from the origin. */
  fanReach?: number;
  /** Camera field of view - wider helps fit a broad arc. */
  fov?: number;
  /** Compresses vertical reach without affecting horizontal spread. */
  fanHeight?: number;
  /** Shifts the fan horizontally inside the canvas. */
  fanOffsetX?: number;
  /** Fiber line and glow color (hex). */
  color?: string;
  /** Enable bottom-center origin glow (3D sprites + CSS halo). */
  originGlow?: boolean;
  /** Fade in the CSS halo - used by home intro on dark hero. */
  glowVisible?: boolean;
  /** Bloom the fan open like a flower as the section scrolls into view. */
  bloomOnScroll?: boolean;
  /** Show a white radial gradient behind the fan that grows with the bloom. */
  bloomGlow?: boolean;
  /** Color theme for lines, dots, and point. */
  theme?: "sunrise" | "daytime" | "sunset";
};

const THEME_HEX = {
  daytime: {

    lineStart: "#374F68",
    lineEnd: "#4B6681",
    dots: "#374F68",
    point: "#954729",
  },
  sunrise: {
    lineStart: "#18293A",
    lineEnd: "#4B6681",
    dots: "#18293A",
    point: "#954729",
  },
  sunset: {
    lineStart: "#263B50",
    lineEnd: "#4B6681",
    dots: "#263B50",
    point: "#954729",
  },
} as const;

type ThemeName = keyof typeof THEME_HEX;

function buildThemes() {
  const out = {} as Record<ThemeName, { lineStart: THREE.Color; lineEnd: THREE.Color; dots: THREE.Color; point: THREE.Color }>;
  for (const key of Object.keys(THEME_HEX) as ThemeName[]) {
    out[key] = {
      lineStart: new THREE.Color(THEME_HEX[key].lineStart),
      lineEnd: new THREE.Color(THEME_HEX[key].lineEnd),
      dots: new THREE.Color(THEME_HEX[key].dots),
      point: new THREE.Color(THEME_HEX[key].point),
    };
  }
  return out;
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const num = parseInt(normalized, 16);
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255,
  };
}

function hexToThreeColor(hex: string) {
  return parseInt(hex.replace("#", ""), 16);
}

function hexToRgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
}

export default function OpticalFiber({
  className = "",
  contentScale = 1,
  fanSpread = 0.45,
  fanReach = 1,
  fov = 75,
  fanHeight = 1,
  fanOffsetX = 0,
  color = "#ffffff",
  originGlow = false,
  glowVisible = true,
  bloomOnScroll = false,
  bloomGlow = false,
  theme = "sunrise",
}: OpticalFiberProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const whiteGlowRef = useRef<HTMLDivElement>(null);

  const themeRef = useRef(theme);
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
    camera.position.set(0, 7 / contentScale, 12 / contentScale);

    const ORIGIN = new THREE.Vector3(0, -2.5, 0);
    const content = new THREE.Group();
    content.position.x = fanOffsetX;
    scene.add(content);

    const LINE_COUNT = 160;
    const MIN_LEN = 4 * fanReach;
    const MAX_LEN = 13 * fanReach;
    const halfSpread = Math.PI * fanSpread;

    const SWIVEL_RADIUS = 6.8;
    const SWIVEL_STRENGTH = 1.25;
    const AMBIENT_SWIVEL = 0.38;
    const AMBIENT_Z_SWIVEL = 0.22;
    const AMBIENT_SPEED = 0.85;
    const Z_SWIVEL_STRENGTH = 0.55;
    const SWIVEL_FOLLOW = 0.34;
    const SWIVEL_RETURN = 0.13;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const swivelStrength = reducedMotion ? 0 : SWIVEL_STRENGTH;
    const ambientSwivel = reducedMotion ? 0 : AMBIENT_SWIVEL;
    const ambientZSwivel = reducedMotion ? 0 : AMBIENT_Z_SWIVEL;
    const zSwivelStrength = reducedMotion ? 0 : Z_SWIVEL_STRENGTH;

    const mouse = new THREE.Vector2(0, 0);
    const mouseWorld = new THREE.Vector3();
    const smoothMouse = new THREE.Vector3(0, ORIGIN.y, 0);
    let mouseActive = false;
    const mouseLocal = new THREE.Vector3();
    const prevMouseLocal = new THREE.Vector3();
    const mouseVel = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const hitPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const updateMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const snapMouseToPointer = () => {
      raycaster.setFromCamera(mouse, camera);
      if (!raycaster.ray.intersectPlane(hitPlane, mouseWorld)) return;
      smoothMouse.copy(mouseWorld);
    };

    const onMouseMove = (e: MouseEvent) => {
      updateMouse(e);
      if (!mouseActive) {
        mouseActive = true;
        snapMouseToPointer();
        return;
      }
      mouseActive = true;
    };

    const onMouseEnter = (e: MouseEvent) => {
      updateMouse(e);
      mouseActive = true;
      snapMouseToPointer();
    };

    const onMouseLeave = () => {
      mouseActive = false;
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);

    const fibers: {
      line: THREE.Line;
      restEnd: THREE.Vector3;
      restLen: number;
      restZ: number;
      perpX: number;
      perpY: number;
      midX: number;
      midY: number;
      lengthT: number;
      phase: number;
      smoothOffX: number;
      smoothOffY: number;
      smoothOffZ: number;
      closedX: number;
      closedY: number;
    }[] = [];

    const fiberColor = hexToThreeColor(color);
    const { r: fiberR, g: fiberG, b: fiberB } = hexToRgb(color);

    for (let i = 0; i < LINE_COUNT; i++) {
      const baseAngle =
        LINE_COUNT > 1 ? -halfSpread + (i / (LINE_COUNT - 1)) * 2 * halfSpread : 0;
      const angleJitter = (Math.random() - 0.5) * ((halfSpread * 2) / LINE_COUNT) * 0.85;
      const angle = baseAngle + angleJitter;
      const length = MIN_LEN + Math.random() * (MAX_LEN - MIN_LEN);
      const zJitter = (Math.random() - 0.5) * 0.15;

      const end = new THREE.Vector3(
        Math.sin(angle) * length,
        ORIGIN.y + Math.cos(angle) * length * fanHeight,
        zJitter,
      );

      const dirX = end.x;
      const dirY = end.y - ORIGIN.y;
      const invLen = 1 / Math.hypot(dirX, dirY);
      const perpX = -dirY * invLen;
      const perpY = dirX * invLen;

      const t = (length - MIN_LEN) / (MAX_LEN - MIN_LEN);
      const opacity = THREE.MathUtils.lerp(0.55, 0.1, t);
      const phase = Math.random() * Math.PI * 2;

      // Collapsed "bud" position: short and nearly vertical so the fan can
      // bloom open like a flower as the bloom progress goes 0 → 1.
      const closedAngle = angle * 0.16;
      const closedLen = length * 0.08;
      const closedX = Math.sin(closedAngle) * closedLen;
      const closedY = ORIGIN.y + Math.cos(closedAngle) * closedLen * fanHeight;

      const geo = new THREE.BufferGeometry().setFromPoints([ORIGIN.clone(), end.clone()]);
      const colors = new Float32Array(6);
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const mat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        linewidth: 1.3,
        opacity,
        blending: THREE.NormalBlending,
        depthWrite: false,
      });
      const line = new THREE.Line(geo, mat);
      content.add(line);

      fibers.push({
        line,
        restEnd: end.clone(),
        restLen: length,
        restZ: zJitter,
        perpX,
        perpY,
        midX: end.x * 0.5,
        midY: (ORIGIN.y + end.y) * 0.5,
        lengthT: t,
        phase,
        smoothOffX: 0,
        smoothOffY: 0,
        smoothOffZ: 0,
        closedX,
        closedY,
      });
    }

    const dotPositions = new Float32Array(LINE_COUNT * 3);
    const dotColors = new Float32Array(LINE_COUNT * 3);

    for (let i = 0; i < LINE_COUNT; i++) {
      const ep = fibers[i].restEnd;
      const dist = ep.distanceTo(ORIGIN);
      const t = THREE.MathUtils.clamp((dist - MIN_LEN) / (MAX_LEN - MIN_LEN), 0, 1);

      dotPositions[i * 3] = ep.x;
      dotPositions[i * 3 + 1] = ep.y;
      dotPositions[i * 3 + 2] = ep.z;

      const fade = THREE.MathUtils.lerp(1.0, 0.65, t);

      dotColors[i * 3] = fiberR * fade;
      dotColors[i * 3 + 1] = fiberG * fade;
      dotColors[i * 3 + 2] = fiberB * fade;
    }

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
    dotGeo.setAttribute("color", new THREE.BufferAttribute(dotColors, 3));

    const buildCircleTexture = () => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const ctx = c.getContext("2d")!;
      ctx.beginPath();
      ctx.arc(32, 32, 30, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      return new THREE.CanvasTexture(c);
    };

    const dotMat = new THREE.PointsMaterial({
      size: 0.2,
      map: buildCircleTexture(),
      alphaTest: 0.01,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.NormalBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    content.add(new THREE.Points(dotGeo, dotMat));

    let glowSprite: THREE.Sprite | null = null;
    let innerSprite: THREE.Sprite | null = null;

    if (originGlow) {
      const buildGlowTexture = (size = 256) => {
        const c = document.createElement("canvas");
        c.width = c.height = size;
        const ctx = c.getContext("2d")!;
        const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0.0, "rgba(255,255,255, 1.0)");
        grad.addColorStop(0.1, "rgba(255,255,255, 0.85)");
        grad.addColorStop(0.35, "rgba(255,255,255, 0.35)");
        grad.addColorStop(0.7, "rgba(255,255,255, 0.1)");
        grad.addColorStop(1.0, "rgba(0,0,0,0.00)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
        return new THREE.CanvasTexture(c);
      };

      glowSprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: buildGlowTexture(512),
          color: new THREE.Color(),
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          opacity: 1.0,
        }),
      );
      glowSprite.scale.set(5, 5, 1);
      glowSprite.position.copy(ORIGIN);
      content.add(glowSprite);

      innerSprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: buildGlowTexture(256),
          color: new THREE.Color(),
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          opacity: 1.0,
        }),
      );
      innerSprite.scale.set(1.4, 1.4, 1);
      innerSprite.position.copy(ORIGIN);
      content.add(innerSprite);
    }

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const clock = new THREE.Clock();
    let animId = 0;
    let visible = true;
    // Bloom 0 = closed bud, 1 = fully open flower.
    let bloom = bloomOnScroll && !reducedMotion ? 0 : 1;

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    visibilityObserver.observe(container);

    const _end = new THREE.Vector3();

    const THEMES = buildThemes();
    const currentColors = {
      lineStart: THEMES[themeRef.current || "sunrise"].lineStart.clone(),
      lineEnd: THEMES[themeRef.current || "sunrise"].lineEnd.clone(),
      dots: THEMES[themeRef.current || "sunrise"].dots.clone(),
      point: THEMES[themeRef.current || "sunrise"].point.clone(),
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!visible) return;

      const targetTheme = THEMES[themeRef.current || "sunrise"];
      currentColors.lineStart.lerp(targetTheme.lineStart, 0.12);
      currentColors.lineEnd.lerp(targetTheme.lineEnd, 0.12);
      currentColors.dots.lerp(targetTheme.dots, 0.12);
      currentColors.point.lerp(targetTheme.point, 0.12);

      const delta = clock.getDelta();
      const t = clock.getElapsedTime();

      if (bloomOnScroll && !reducedMotion) {
        const rect = container.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // 0 as the fan enters from the bottom, 1 once it has risen ~35% up.
        const raw = (vh - rect.top) / (vh * 0.6);
        const target = THREE.MathUtils.clamp(raw, 0, 1);
        bloom += (target - bloom) * Math.min(1, delta * 6);
      }

      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(hitPlane, mouseWorld);
      if (mouseActive) {
        const mouseGap = smoothMouse.distanceTo(mouseWorld);
        smoothMouse.lerp(mouseWorld, mouseGap > 5 ? 0.4 : 0.22);
      }

      mouseLocal.set(smoothMouse.x - fanOffsetX, smoothMouse.y, smoothMouse.z);
      mouseVel.subVectors(mouseLocal, prevMouseLocal);
      prevMouseLocal.copy(mouseLocal);
      const moveBoost = 1 + Math.min(mouseVel.length() * 0.55, 1.35);

      for (let i = 0; i < LINE_COUNT; i++) {
        const fiber = fibers[i];
        const { line, restEnd, restLen, restZ, perpX, perpY, midX, midY, lengthT, phase } = fiber;
        const posAttr = line.geometry.attributes.position as THREE.BufferAttribute;

        const ambient = ambientSwivel * Math.sin(t * AMBIENT_SPEED + phase);
        const ambientZ = ambientZSwivel * Math.sin(t * AMBIENT_SPEED * 0.82 + phase * 1.65);
        let targetOffX = perpX * ambient;
        let targetOffY = perpY * ambient;
        let targetOffZ = ambientZ;

        if (mouseActive && swivelStrength > 0) {
          const dx = midX - mouseLocal.x;
          const dy = midY - mouseLocal.y;
          const dist2 = dx * dx + dy * dy;
          const dist = Math.sqrt(dist2) || 0.0001;
          const influence = Math.exp(-dist2 / (SWIVEL_RADIUS * SWIVEL_RADIUS));
          const lengthBoost = 0.7 + lengthT * 0.85;
          const push = swivelStrength * influence * lengthBoost * moveBoost;
          targetOffX += (dx / dist) * push;
          targetOffY += (dy / dist) * push;
          if (zSwivelStrength > 0) {
            const depthPush = zSwivelStrength * influence * lengthBoost * moveBoost;
            const verticalBias = THREE.MathUtils.clamp((mouseLocal.y - midY) * 0.22, -1, 1);
            targetOffZ += depthPush * (0.45 + verticalBias * 0.55);
          }
        }

        const pullMag = Math.hypot(
          targetOffX - perpX * ambient,
          targetOffY - perpY * ambient,
          targetOffZ - ambientZ,
        );
        const smoothMag = Math.hypot(fiber.smoothOffX, fiber.smoothOffY, fiber.smoothOffZ);
        const offsetLerp = pullMag > smoothMag ? SWIVEL_FOLLOW : SWIVEL_RETURN;

        fiber.smoothOffX += (targetOffX - fiber.smoothOffX) * offsetLerp;
        fiber.smoothOffY += (targetOffY - fiber.smoothOffY) * offsetLerp;
        fiber.smoothOffZ += (targetOffZ - fiber.smoothOffZ) * offsetLerp;

        // Lerp the fiber base between its closed (bud) and open (rest) state.
        const baseX = fiber.closedX + (restEnd.x - fiber.closedX) * bloom;
        const baseY = fiber.closedY + (restEnd.y - fiber.closedY) * bloom;
        const effLen = restLen * (0.1 + 0.9 * bloom);

        const tipX = baseX + fiber.smoothOffX;
        const tipY = baseY + fiber.smoothOffY;
        const tipZ = restZ + fiber.smoothOffZ;
        const dirX = tipX - ORIGIN.x;
        const dirY = tipY - ORIGIN.y;
        const dirZ = tipZ - ORIGIN.z;
        const dirLen = Math.hypot(dirX, dirY, dirZ) || restLen;

        _end.set(
          ORIGIN.x + (dirX / dirLen) * effLen,
          ORIGIN.y + (dirY / dirLen) * effLen,
          ORIGIN.z + (dirZ / dirLen) * effLen,
        );

        posAttr.setXYZ(0, ORIGIN.x, ORIGIN.y, ORIGIN.z);
        posAttr.setXYZ(1, _end.x, _end.y, _end.z);
        posAttr.needsUpdate = true;

        const colorAttr = fiber.line.geometry.attributes.color as THREE.BufferAttribute;
        colorAttr.setXYZ(0, currentColors.lineStart.r, currentColors.lineStart.g, currentColors.lineStart.b);
        colorAttr.setXYZ(1, currentColors.lineEnd.r, currentColors.lineEnd.g, currentColors.lineEnd.b);
        colorAttr.needsUpdate = true;

        dotPositions[i * 3] = _end.x;
        dotPositions[i * 3 + 1] = _end.y;
        dotPositions[i * 3 + 2] = _end.z;

        const fade = THREE.MathUtils.lerp(1.0, 0.65, fiber.lengthT);
        dotColors[i * 3] = currentColors.dots.r * fade;
        dotColors[i * 3 + 1] = currentColors.dots.g * fade;
        dotColors[i * 3 + 2] = currentColors.dots.b * fade;
      }

      dotGeo.attributes.position.needsUpdate = true;
      dotGeo.attributes.color.needsUpdate = true;

      if (originGlow && glowSprite && innerSprite) {
        const pulse = 0.9 + Math.sin(t * 1.4) * 0.1;
        glowSprite.scale.set(5 * pulse, 5 * pulse, 1);
        glowSprite.material.color.copy(currentColors.point);
        innerSprite.material.opacity = 0.85 + Math.sin(t * 2.1) * 0.15;
        innerSprite.material.color.copy(currentColors.point);
      }

      if (bloomGlow && whiteGlowRef.current) {
        const scale = 0.55 + bloom * 0.55;
        whiteGlowRef.current.style.opacity = String(bloom * 0.85);
        whiteGlowRef.current.style.transform = `translate(-50%, 35%) scale(${scale})`;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      renderer.dispose();
    };
  }, [contentScale, fanSpread, fanReach, fov, fanHeight, fanOffsetX, color, originGlow, bloomOnScroll, bloomGlow]);

  return (
    <div ref={containerRef} className={`relative h-full w-full overflow-hidden ${className}`}>
      {bloomGlow ? (
        <div
          ref={whiteGlowRef}
          className="pointer-events-none absolute bottom-0 left-1/2 z-0 aspect-square w-[min(72%,560px)] rounded-full blur-[3.5rem] md:blur-[4.5rem]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 28%, rgba(255,255,255,0.16) 52%, rgba(255,255,255,0) 72%)",
            opacity: 0,
            transform: "translate(-50%, 35%) scale(0.55)",
          }}
          aria-hidden
        />
      ) : null}
      {originGlow ? (
        <div
          className={`pointer-events-none absolute bottom-0 left-1/2 z-0 aspect-square w-[min(50%,320px)] -translate-x-1/2 translate-y-[42%] rounded-full blur-[4.5rem] transition-all duration-700 ease-out md:w-[min(44%,380px)] md:blur-[5.5rem] ${glowVisible ? "opacity-90" : "opacity-0"
            }`}
          style={{
            background: `radial-gradient(circle, ${THEME_HEX[theme || "sunrise"].point} 0%, ${THEME_HEX[theme || "sunrise"].point}b8 28%, ${THEME_HEX[theme || "sunrise"].point}47 52%, transparent 72%)`,
          }}
          aria-hidden
        />
      ) : null}
      <canvas ref={canvasRef} className="relative z-10 block h-full w-full" aria-hidden />
    </div>
  );
}
