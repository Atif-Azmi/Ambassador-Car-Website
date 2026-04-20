import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 6500;

export default function ThreePersistentBg() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── WebGL support check ────────────────────────────────────────────────
    const testCanvas = document.createElement("canvas");
    const glTest = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
    if (!glTest) return; // graceful fallback when GPU unavailable

    // ── Renderer ──────────────────────────────────────────────────────────
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, mount.clientWidth / mount.clientHeight, 0.1, 120);
    camera.position.z = 9;

    // ── Particle universe ─────────────────────────────────────────────────
    const pos   = new Float32Array(PARTICLE_COUNT * 3);
    const col   = new Float32Array(PARTICLE_COUNT * 3);
    const amber = new THREE.Color("#C9A227");
    const white = new THREE.Color("#ffffff");
    const faint = new THREE.Color("#8a6b00");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r     = 7 + Math.random() * 13;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) * 0.55;
      const pick = Math.random();
      const c = pick < 0.48 ? white : pick < 0.72 ? amber : faint;
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute("color",    new THREE.BufferAttribute(col, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.042, vertexColors: true, transparent: true,
      opacity: 0.52, depthWrite: false, sizeAttenuation: true,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // ── Wireframe icosahedron ─────────────────────────────────────────────
    const icoGeo = new THREE.IcosahedronGeometry(2.1, 1);
    const icoMat = new THREE.MeshBasicMaterial({ color: 0xC9A227, wireframe: true, transparent: true, opacity: 0.065 });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);

    // ── Wireframe torus ───────────────────────────────────────────────────
    const torGeo = new THREE.TorusGeometry(1.6, 0.5, 7, 40);
    const torMat = new THREE.MeshBasicMaterial({ color: 0xC9A227, wireframe: true, transparent: true, opacity: 0.038 });
    const torus = new THREE.Mesh(torGeo, torMat);
    torus.position.set(5, -2.5, -5);
    scene.add(torus);

    // ── Wireframe dodecahedron ────────────────────────────────────────────
    const dodGeo = new THREE.DodecahedronGeometry(1.7, 0);
    const dodMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.025 });
    const dod = new THREE.Mesh(dodGeo, dodMat);
    dod.position.set(-5.5, 3.5, -7);
    scene.add(dod);

    // ── Ambient ring grid ─────────────────────────────────────────────────
    for (let i = 0; i < 3; i++) {
      const rGeo = new THREE.TorusGeometry(2.5 + i * 1.8, 0.008, 8, 80);
      const rMat = new THREE.MeshBasicMaterial({ color: 0xC9A227, transparent: true, opacity: 0.025 - i * 0.007 });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.rotation.x = Math.PI / 2 + i * 0.3;
      ring.userData.speed = 0.012 + i * 0.006;
      scene.add(ring);
    }

    // ── Mouse + scroll tracking ───────────────────────────────────────────
    let mx = 0, my = 0, lx = 0, ly = 0;
    let scrollY = 0;

    const onMove   = (e: MouseEvent) => { mx = (e.clientX / window.innerWidth - 0.5); my = -(e.clientY / window.innerHeight - 0.5); };
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll",   onScroll, { passive: true });

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
      const s = scrollY * 0.001;

      // Smooth camera parallax
      lx += (mx - lx) * 0.032;
      ly += (my - ly) * 0.032;
      camera.position.x = lx * 1.4;
      camera.position.y = ly * 0.9 + s * -0.5;
      camera.lookAt(0, s * -0.5, 0);

      // Particles rotation
      points.rotation.y = t * 0.016 + s * 0.0007;
      points.rotation.x = t * 0.006 + s * 0.0003;

      // Geometry animations
      ico.rotation.x = t * 0.085 + s;
      ico.rotation.y = t * 0.13 + s * 0.5;
      ico.position.y = Math.sin(t * 0.28) * 0.25 - s * 1.8;

      torus.rotation.x = -t * 0.12;
      torus.rotation.z = t * 0.075 + s * 0.6;
      torus.position.y = Math.cos(t * 0.22) * 0.35 - s * 1.4;

      dod.rotation.y = t * 0.19 + s;
      dod.rotation.x = t * 0.065;
      dod.position.y = Math.sin(t * 0.35 + 1) * 0.28 - s * 1.1;

      // Ring rotations
      scene.children.forEach(obj => {
        if (obj.userData.speed) obj.rotation.y += obj.userData.speed;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll",   onScroll);
      window.removeEventListener("resize",   onResize);
      renderer.dispose();
      pGeo.dispose();   pMat.dispose();
      icoGeo.dispose(); icoMat.dispose();
      torGeo.dispose(); torMat.dispose();
      dodGeo.dispose(); dodMat.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    />
  );
}
