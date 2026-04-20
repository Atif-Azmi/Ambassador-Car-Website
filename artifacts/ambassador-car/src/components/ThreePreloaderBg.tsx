import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreePreloaderBg() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── WebGL support check ────────────────────────────────────────────────
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return; // graceful fallback — CSS animations still run

    // ── Renderer ──────────────────────────────────────────────────────────
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 8;

    // ── Particles ─────────────────────────────────────────────────────────
    const COUNT = 5500;
    const pos   = new Float32Array(COUNT * 3);
    const col   = new Float32Array(COUNT * 3);
    const amber = new THREE.Color("#C9A227");
    const white = new THREE.Color("#ffffff");

    for (let i = 0; i < COUNT; i++) {
      const r     = 9 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = Math.random() > 0.35 ? white : amber;
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute("color",    new THREE.BufferAttribute(col, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.045, vertexColors: true, transparent: true, opacity: 0.6, depthWrite: false, sizeAttenuation: true });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // ── Wireframe icosahedron ─────────────────────────────────────────────
    const icoGeo = new THREE.IcosahedronGeometry(2.3, 2);
    const icoMat = new THREE.MeshBasicMaterial({ color: 0xC9A227, wireframe: true, transparent: true, opacity: 0.14 });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);

    // ── Wireframe torus ───────────────────────────────────────────────────
    const torGeo = new THREE.TorusGeometry(1.4, 0.04, 16, 90);
    const torMat = new THREE.MeshBasicMaterial({ color: 0xC9A227, transparent: true, opacity: 0.07 });
    const torus = new THREE.Mesh(torGeo, torMat);
    torus.position.set(3.5, -1.5, -4);
    scene.add(torus);

    // ── Wireframe octahedron ──────────────────────────────────────────────
    const octGeo = new THREE.OctahedronGeometry(1.0, 0);
    const octMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.04 });
    const octa = new THREE.Mesh(octGeo, octMat);
    octa.position.set(-4.5, 2.5, -6);
    scene.add(octa);

    // ── Stream lines ──────────────────────────────────────────────────────
    const lineCount = 100;
    const linePts: number[] = [];
    for (let i = 0; i < lineCount; i++) {
      const x = (Math.random() - 0.5) * 18;
      const y = (Math.random() - 0.5) * 18;
      const z = (Math.random() - 0.5) * 8;
      const l = Math.random() * 1.4 + 0.3;
      linePts.push(x, y, z, x + (Math.random() - 0.5) * l, y + l, z);
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePts), 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0xC9A227, transparent: true, opacity: 0.06 });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // ── Mouse parallax ────────────────────────────────────────────────────
    let mx = 0, my = 0, lx = 0, ly = 0;
    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - 0.5);
      my = (e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove);

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ────────────────────────────────────────────────────
    let rafId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      lx += (mx - lx) * 0.04;
      ly += (my - ly) * 0.04;
      camera.position.x = lx * 0.8;
      camera.position.y = -ly * 0.5;
      camera.lookAt(0, 0, 0);

      points.rotation.y = t * 0.022;
      points.rotation.x = t * 0.008;

      ico.rotation.x = t * 0.11;
      ico.rotation.y = t * 0.17;
      ico.rotation.z = t * 0.055;

      torus.rotation.x = t * 0.20 + 1;
      torus.rotation.z = t * 0.09;

      octa.rotation.y = t * 0.26;
      octa.rotation.x = t * 0.13;

      lines.rotation.z = t * 0.035;
      lineMat.opacity = 0.05 + Math.sin(t * 0.7) * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      icoGeo.dispose(); icoMat.dispose();
      torGeo.dispose(); torMat.dispose();
      octGeo.dispose(); octMat.dispose();
      pGeo.dispose();   pMat.dispose();
      lineGeo.dispose(); lineMat.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    />
  );
}
