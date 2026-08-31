"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type CarVisualPreviewProps = {
  imageSrc: string | null;
};

function drawContainedImage(ctx: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number) {
  const scale = Math.min(width / image.width, height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(image, x, y, drawWidth, drawHeight);
}

function createPlaceholderTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 620;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#fcbb13");
    gradient.addColorStop(0.58, "#f97316");
    gradient.addColorStop(1, "#111827");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = 0.92;
    ctx.fillRect(90, 140, 1020, 205);

    ctx.globalAlpha = 1;
    ctx.fillStyle = "#111827";
    ctx.font = "700 88px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("ADS MY RIDE", canvas.width / 2, 244);

    ctx.globalAlpha = 0.16;
    ctx.fillStyle = "#ffffff";
    for (let x = -canvas.height; x < canvas.width; x += 140) {
      ctx.beginPath();
      ctx.moveTo(x, canvas.height);
      ctx.lineTo(x + 76, canvas.height);
      ctx.lineTo(x + canvas.height + 76, 0);
      ctx.lineTo(x + canvas.height, 0);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 12;
  texture.needsUpdate = true;
  return texture;
}

function createImageTexture(imageSrc: string | null) {
  if (!imageSrc) return Promise.resolve(createPlaceholderTexture());

  return new Promise<THREE.CanvasTexture>((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 620;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        drawContainedImage(ctx, image, canvas.width, canvas.height);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 12;
      texture.needsUpdate = true;
      resolve(texture);
    };
    image.onerror = () => resolve(createPlaceholderTexture());
    image.src = imageSrc;
  });
}

function createBodyGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(-2.55, 0.28);
  shape.bezierCurveTo(-2.35, 0.18, -2.06, 0.14, -1.64, 0.14);
  shape.lineTo(1.68, 0.14);
  shape.bezierCurveTo(2.18, 0.14, 2.48, 0.27, 2.64, 0.54);
  shape.bezierCurveTo(2.42, 0.72, 2.07, 0.83, 1.64, 0.88);
  shape.bezierCurveTo(1.17, 1.38, 0.58, 1.68, -0.36, 1.69);
  shape.bezierCurveTo(-1.1, 1.67, -1.5, 1.37, -1.93, 0.91);
  shape.bezierCurveTo(-2.34, 0.84, -2.58, 0.63, -2.55, 0.28);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 1.42,
    bevelEnabled: true,
    bevelSize: 0.08,
    bevelThickness: 0.08,
    bevelSegments: 8,
    curveSegments: 18,
  });
  geometry.center();
  geometry.translate(0, 0.86, 0);
  return geometry;
}

function addRoundedBox(
  parent: THREE.Group | THREE.Scene,
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material,
  radius = 0.04
) {
  const shape = new THREE.Shape();
  const [width, height, depth] = size;
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: radius * 0.35,
    bevelThickness: radius * 0.35,
    bevelSegments: 5,
  });
  geometry.center();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addWheel(parent: THREE.Group, x: number, z: number, tireMaterial: THREE.Material, rimMaterial: THREE.Material) {
  const wheel = new THREE.Group();
  wheel.position.set(x, 0.42, z);
  parent.add(wheel);

  const tire = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.12, 18, 56), tireMaterial);
  tire.castShadow = true;
  tire.receiveShadow = true;
  wheel.add(tire);

  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 40), rimMaterial);
  rim.rotation.x = Math.PI / 2;
  rim.castShadow = true;
  wheel.add(rim);

  for (let i = 0; i < 6; i += 1) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.19, 0.035), rimMaterial);
    spoke.rotation.z = (Math.PI / 6) * i;
    wheel.add(spoke);
  }
}

function addSidePlane(
  parent: THREE.Group,
  size: [number, number],
  position: [number, number, number],
  rotationY: number,
  material: THREE.Material
) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(...size), material);
  mesh.position.set(...position);
  mesh.rotation.y = rotationY;
  parent.add(mesh);
  return mesh;
}

export default function CarVisualPreview({ imageSrc }: CarVisualPreviewProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let frameId = 0;
    let disposed = false;
    let isDragging = false;
    let previousPointerX = 0;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(4.2, 2.2, 6.4);
    camera.lookAt(0, 0.75, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.className = "h-full w-full cursor-grab";
    host.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xdbeafe, 2.7));

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(3.8, 5.2, 4.8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xfef3c7, 1.35);
    rimLight.position.set(-4, 2.6, -3.2);
    scene.add(rimLight);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(4.4, 96),
      new THREE.ShadowMaterial({ color: 0x111827, opacity: 0.16 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.02;
    floor.receiveShadow = true;
    scene.add(floor);

    const car = new THREE.Group();
    car.rotation.y = 0.28;
    scene.add(car);

    const paintMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.32,
      metalness: 0.38,
      clearcoat: 0.8,
      clearcoatRoughness: 0.22,
    });
    const trimMaterial = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.62, metalness: 0.25 });
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x172033,
      roughness: 0.08,
      metalness: 0.05,
      transparent: true,
      opacity: 0.78,
      transmission: 0.12,
    });
    const tireMaterial = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 });
    const rimMaterial = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.22, metalness: 0.74 });
    const headlightMaterial = new THREE.MeshStandardMaterial({ color: 0xfff7ed, roughness: 0.18, emissive: 0xfff1cc, emissiveIntensity: 0.38 });
    const tailLightMaterial = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.22, emissive: 0x7f1d1d, emissiveIntensity: 0.28 });
    const decalMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.42, metalness: 0.05, side: THREE.DoubleSide });

    const body = new THREE.Mesh(createBodyGeometry(), paintMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    car.add(body);

    addRoundedBox(car, [4.9, 0.18, 1.48], [0.08, 0.32, 0], trimMaterial, 0.08);
    addRoundedBox(car, [1.48, 0.48, 1.16], [-0.34, 1.5, 0], glassMaterial, 0.08);
    addRoundedBox(car, [0.76, 0.34, 1.12], [-1.18, 1.36, 0], glassMaterial, 0.07);
    addRoundedBox(car, [0.72, 0.28, 1.08], [0.9, 1.34, 0], glassMaterial, 0.07);
    addRoundedBox(car, [0.12, 0.5, 1.2], [-1.86, 0.98, 0], paintMaterial, 0.04);
    addRoundedBox(car, [0.12, 0.44, 1.1], [1.75, 0.98, 0], paintMaterial, 0.04);

    addSidePlane(car, [1.1, 0.57], [-0.67, 0.82, 0.745], 0, decalMaterial);
    addSidePlane(car, [1.1, 0.57], [0.55, 0.82, 0.745], 0, decalMaterial);
    addSidePlane(car, [1.1, 0.57], [-0.67, 0.82, -0.745], Math.PI, decalMaterial);
    addSidePlane(car, [1.1, 0.57], [0.55, 0.82, -0.745], Math.PI, decalMaterial);

    addRoundedBox(car, [0.08, 0.18, 0.36], [-0.98, 0.86, 0.762], trimMaterial, 0.025);
    addRoundedBox(car, [0.08, 0.18, 0.36], [0.22, 0.86, 0.762], trimMaterial, 0.025);
    addRoundedBox(car, [0.08, 0.18, 0.36], [-0.98, 0.86, -0.762], trimMaterial, 0.025);
    addRoundedBox(car, [0.08, 0.18, 0.36], [0.22, 0.86, -0.762], trimMaterial, 0.025);

    addRoundedBox(car, [0.18, 0.13, 0.18], [-1.25, 1.08, 0.88], trimMaterial, 0.04);
    addRoundedBox(car, [0.18, 0.13, 0.18], [-1.25, 1.08, -0.88], trimMaterial, 0.04);
    addRoundedBox(car, [0.1, 0.22, 0.72], [-2.48, 0.62, 0], headlightMaterial, 0.04);
    addRoundedBox(car, [0.1, 0.16, 0.64], [2.48, 0.62, 0], tailLightMaterial, 0.04);
    addRoundedBox(car, [0.08, 0.22, 0.64], [-2.56, 0.42, 0], trimMaterial, 0.03);
    addRoundedBox(car, [0.06, 0.14, 0.46], [2.58, 0.42, 0], trimMaterial, 0.025);

    addWheel(car, -1.58, 0.78, tireMaterial, rimMaterial);
    addWheel(car, 1.48, 0.78, tireMaterial, rimMaterial);
    addWheel(car, -1.58, -0.78, tireMaterial, rimMaterial);
    addWheel(car, 1.48, -0.78, tireMaterial, rimMaterial);

    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    const handlePointerDown = (event: PointerEvent) => {
      isDragging = true;
      previousPointerX = event.clientX;
      renderer.domElement.classList.remove("cursor-grab");
      renderer.domElement.classList.add("cursor-grabbing");
      renderer.domElement.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = event.clientX - previousPointerX;
      previousPointerX = event.clientX;
      car.rotation.y += deltaX * 0.01;
    };

    const handlePointerUp = (event: PointerEvent) => {
      isDragging = false;
      renderer.domElement.classList.add("cursor-grab");
      renderer.domElement.classList.remove("cursor-grabbing");
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    };

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerup", handlePointerUp);
    renderer.domElement.addEventListener("pointercancel", handlePointerUp);

    createImageTexture(imageSrc).then((texture) => {
      if (disposed) {
        texture.dispose();
        return;
      }

      decalMaterial.map?.dispose();
      decalMaterial.map = texture;
      decalMaterial.needsUpdate = true;
    });

    const animate = () => {
      if (!isDragging) car.rotation.y += 0.0032;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);
      renderer.domElement.removeEventListener("pointercancel", handlePointerUp);
      host.removeChild(renderer.domElement);

      const disposedGeometries = new Set<THREE.BufferGeometry>();
      const disposedMaterials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
          if (!disposedGeometries.has(object.geometry)) {
            disposedGeometries.add(object.geometry);
            object.geometry.dispose();
          }
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            if (disposedMaterials.has(material)) return;
            disposedMaterials.add(material);
            const mappedMaterial = material as THREE.Material & { map?: THREE.Texture | null };
            mappedMaterial.map?.dispose();
            material.dispose();
          });
        }
      });
      renderer.dispose();
    };
  }, [imageSrc]);

  return (
    <div
      ref={hostRef}
      className="h-[260px] sm:h-[320px] w-full overflow-hidden rounded-xl bg-gray-50"
      aria-label="Simulation 3D du visuel sur la voiture"
    />
  );
}
