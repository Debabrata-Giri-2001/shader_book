import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as Tweakpane from "tweakpane";

import image from "./assets/Sarazanmai.jpg";
import flower22 from "./assets/flower22.png";

import s1 from "./assets/s1.jpeg";
import s2 from "./assets/s2.jpeg";
import s3 from "./assets/s3.jpeg";
import s4 from "./assets/s4.jpeg";
import s5 from "./assets/s5.jpeg";

import fragmentShader1 from "./shaders/project1/fragmentShader.glsl?raw";
import vertexShader1 from "./shaders/project1/vertexShader.glsl?raw";
import fragmentShader2 from "./shaders/project2/fragmentShader.glsl?raw";
import vertexShader2 from "./shaders/project2/vertexShader.glsl?raw";
import fragmentShader3 from "./shaders/project3/fragmentShader.glsl?raw";
import vertexShader3 from "./shaders/project3/vertexShader.glsl?raw";
import fragmentShader4 from "./shaders/project4/fragmentShader.glsl?raw";
import vertexShader4 from "./shaders/project4/vertexShader.glsl?raw";
import fragmentShader5 from "./shaders/project5/fragmentShader.glsl?raw";
import vertexShader5 from "./shaders/project5/vertexShader.glsl?raw";

import type { ShaderItem, TweakpaneInstance } from "./types";
import { computeUVScaleForCover } from "./utils/computeUVScaleForCover";


// ----------------------
// Texture loader
// ----------------------
const textureLoader = new THREE.TextureLoader();
const scale = new THREE.Vector2();
const texture = textureLoader.load(flower22, (tex) => {
  const img = tex.image;
  const uvScale = computeUVScaleForCover(
    img.width,
    img.height,
    window.innerWidth,
    window.innerHeight
  );
  scale.set(uvScale.x, uvScale.y);
});


// ----------------------
// Shader definitions
// ----------------------
const shaderData: ShaderItem[] = [
  {
    name: "Noise Wave",
    fragmentShader: fragmentShader1,
    vertexShader: vertexShader1,
    geometryType: "Sphere",
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(122 / 255, 158 / 255, 113 / 255) },
      uColor2: { value: new THREE.Color(0, 0, 0) },
      uColor3: { value: new THREE.Color(224 / 255, 148 / 255, 66 / 255) },
    },
    setupControls: (pane, uniforms) => {
      pane.addBinding(uniforms.uColor1, "value", { label: "Color1" });
      pane.addBinding(uniforms.uColor2, "value", { label: "Color2" });
      pane.addBinding(uniforms.uColor3, "value", { label: "Color3" });
    },
    imageUrl: s1,
  },

  {
    name: "Water Orb (Sphere)",
    fragmentShader: fragmentShader2,
    vertexShader: vertexShader2,
    geometryType: "Plane",
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uDistortion: { value: 0.02 },
      uScale: { value: new THREE.Vector2(1, 1) || scale },
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0, 0) }
    },
    setupControls: (pane, uniforms) => {
      pane.addBinding(uniforms.uDistortion, "value", {
        label: "Distort",
        min: 0.0,
        max: 0.5,
        step: 0.01
      });

    },
    imageUrl: s2,
  },

  {
    name: "Sun",
    fragmentShader: fragmentShader3,
    vertexShader: vertexShader3,
    geometryType: "Sphere",
    uniforms: {
      uTime: { value: 0 },
      uDistortion: { value: 0.1 },
      uOpacity: { value: 0.8 },
    },
    setupControls: () => { },
    imageUrl: s3,
    transparent: true
  },
  {
    name: "Oval Raymarch",
    fragmentShader: fragmentShader4,
    vertexShader: vertexShader4,
    geometryType: "Plane",
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    },
    setupControls: () => { },
    imageUrl: s4,
    transparent: true
  },
  {
    name: "Fun Ball",
    fragmentShader: fragmentShader5,
    vertexShader: vertexShader5,
    geometryType: "Sphere",
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uSkyColor: { value: new THREE.Vector3(1.000, 1.000, 0.547) },
      uGroundColor: { value: new THREE.Vector3(0.562, 0.275, 0.111) },
    },
    setupControls: (pane, uniforms) => {
      pane.addBinding(uniforms.uSkyColor, "value", { label: "Sky Color" });
      pane.addBinding(uniforms.uGroundColor, "value", { label: "Ground Color" });
    },
    imageUrl: s5,
    transparent: true
  },


];


// ----------------------
// Geometry Factory
// ----------------------
const createGeometry = (type: ShaderItem["geometryType"]): THREE.BufferGeometry => {
  switch (type) {
    case "Sphere":
      return new THREE.SphereGeometry(1, 164, 164);
    case "Box":
      return new THREE.BoxGeometry(1.5, 1.5, 1.5, 32, 32, 32);
    case "Torus":
      return new THREE.TorusGeometry(1.0, 0.4, 64, 100);
    case "Plane":
    default:
      return new THREE.PlaneGeometry(2.0, 2.0, 32, 32);
  }
};


// ===========================================================
// MAIN APP
// ===========================================================
export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const paneRef = useRef<Tweakpane.Pane | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);


  // -------------------------
  // Setup tweakpane
  // -------------------------
  const setupTweakpane = useCallback(
    (uniforms: { [key: string]: THREE.IUniform }, setupFn: Function) => {
      if (paneRef.current) {
        paneRef.current.dispose();
        paneRef.current = null;
      }

      const pane = new Tweakpane.Pane({
        title: "CONTROLS",
        container: document.getElementById("controls-panel")!,
      }) as TweakpaneInstance;

      paneRef.current = pane;

      setupFn(pane, uniforms);
      pane.refresh();
    },
    []
  );


  // ===========================================================
  // INITIAL SCENE SETUP (Runs once)
  // ===========================================================
  useEffect(() => {
    const canvas = canvasRef.current!;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#2A2B30");

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 2);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    // Create initial shader
    const shader = shaderData[activeIndex];
    const geometry = createGeometry(shader.geometryType);
    const uniforms = { ...shader.uniforms };

    const material = new THREE.ShaderMaterial({
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      side: THREE.DoubleSide,
      uniforms,
      transparent: shader.transparent ?? false
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    setupTweakpane(uniforms, shader.setupControls);

    const clock = new THREE.Clock();


    // --------------------------
    // MOUSE MOVE FIX
    // --------------------------
    const handleMouseMove = (e: MouseEvent) => {
      const mat = meshRef.current?.material as THREE.ShaderMaterial;
      if (!mat?.uniforms?.uMouse) return;

      mat.uniforms.uMouse.value.set(
        (e.clientX / window.innerWidth) * 2.0 - 1.0,
        -(e.clientY / window.innerHeight) * 2.0 + 1.0
      );
    };


    // --------------------------
    // RESIZE FIX (updates uScale)
    // --------------------------
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      const mat = meshRef.current?.material as THREE.ShaderMaterial;
      if (mat?.uniforms?.uTexture && mat?.uniforms?.uScale) {
        const tex = mat.uniforms.uTexture.value;
        const img = tex.image;

        if (img) {
          const uvScale = computeUVScaleForCover(
            img.width,
            img.height,
            window.innerWidth,
            window.innerHeight
          );
          mat.uniforms.uScale.value.set(uvScale.x, uvScale.y);
        }
      }
    };


    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);


    // --------------------------
    // ANIMATION LOOP
    // --------------------------
    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Update uTime safely
      const mat = meshRef.current?.material as THREE.ShaderMaterial;
      if (mat?.uniforms?.uTime) mat.uniforms.uTime.value = elapsed;

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();


    // --------------------------
    // CLEANUP
    // --------------------------
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();

      if (paneRef.current) {
        paneRef.current.dispose();
        paneRef.current = null;
      }
    };
  }, [setupTweakpane]);



  // ===========================================================
  // Shader Switcher
  // ===========================================================
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const shader = shaderData[activeIndex];

    // Update geometry
    mesh.geometry.dispose();
    mesh.geometry = createGeometry(shader.geometryType);

    // Deep copy uniforms
    const uniforms = { ...shader.uniforms };

    // Create new shader material with FIXED transparency
    const newMaterial = new THREE.ShaderMaterial({
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      side: THREE.DoubleSide,
      uniforms,
      transparent: shader.transparent ?? false
    });

    (mesh.material as THREE.Material).dispose();
    mesh.material = newMaterial;

    setupTweakpane(uniforms, shader.setupControls);
  }, [activeIndex, setupTweakpane]);



  // ===========================================================
  // JSX
  // ===========================================================
  return (
    <>
      <canvas ref={canvasRef} />

      {/* Tweakpane panel */}
      <div id="controls-panel" className="panel_control" />

      {/* Title */}
      <div className="telun">
        <p>Books of Shaders</p>
      </div>

      {/* Shader selector */}
      <div className="shader_selector">
        {shaderData.map((shader, index) => (
          <button
            key={shader.name}
            onClick={() => setActiveIndex(index)}
            className="shader_selector_btn"
            style={{
              border: index === activeIndex ? "2px solid #00FFFF" : "1px solid #555",
              backgroundColor: index === activeIndex ? "#111" : "#333",
            }}
          >
            <img
              src={shader.imageUrl || image}
              alt={shader.name}
              className="shader_selector_img"
            />
            <span
              className="shader_selector_text"
              style={{ fontWeight: index === activeIndex ? "bold" : "normal" }}
            >
              {shader.name}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
