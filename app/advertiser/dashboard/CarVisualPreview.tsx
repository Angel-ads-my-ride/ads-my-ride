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
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#fcbb13";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 330, canvas.width, 70);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 120, canvas.width, 130);
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = "#111827";
    for (let x = -canvas.height; x < canvas.width; x += 120) {
      ctx.beginPath();
      ctx.moveTo(x, canvas.height);
      ctx.lineTo(x + 70, canvas.height);
      ctx.lineTo(x + canvas.height + 70, 0);
      ctx.lineTo(x + canvas.height, 0);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function createImageTexture(imageSrc: string | null) {
  if (!imageSrc) return Promise.resolve(createPlaceholderTexture());

  return new Promise<THREE.CanvasTexture>((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        drawContainedImage(ctx, image, canvas.width, canvas.height);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      texture.needsUpdate = true;
      resolve(texture);
    };
    image.onerror = () => resolve(createPlaceholderTexture());
    image.src = imageSrc;
  });
}

function addBox(
  parent: THREE.Group,
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addDoorDecal(
  parent: THREE.Group,
  x: number,
  z: number,
  rotationY: number,
  material: THREE.Material,
  frameMaterial: THREE.Material
) {
  const decal = new THREE.Mesh(new THREE.PlaneGeometry(0.96, 0.56), material);
  decal.position.set(x, 0.7, z);
  decal.rotation.y = rotationY;
  parent.add(decal);

  const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(0.98, 0.58)), frameMaterial);
  frame.position.copy(decal.position);
  frame.rotation.copy(decal.rotation);
  parent.add(frame);
}

function addWheel(parent: THREE.Group, x: number, z: number, tireMaterial: THREE.Material, rimMaterial: THREE.Material) {
  const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.2, 40), tireMaterial);
  tire.rotation.x = Math.PI / 2;
  tire.position.set(x, 0.28, z);
  tire.castShadow = true;
  parent.add(tire);

  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.215, 32), rimMaterial);
  rim.rotation.x = Math.PI / 2;
  rim.position.copy(tire.position);
  parent.add(rim);
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

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(3.6, 2.15, 6.2);
    camera.lookAt(0, 0.65, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.domElement.className = "h-full w-full cursor-grab";
    host.appendChild(renderer.domElement);

    const ambient = new THREE.HemisphereLight(0xffffff, 0xcbd5e1, 2.3);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 7),
      new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 0.95 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const car = new THREE.Group();
    car.rotation.y = 0.16;
    scene.add(car);

    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5f4, roughness: 0.48, metalness: 0.18 });
    const lowerBodyMaterial = new THREE.MeshStandardMaterial({ color: 0x171717, roughness: 0.6, metalness: 0.1 });
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.18,
      metalness: 0.05,
      transparent: true,
      opacity: 0.72,
    });
    const tireMaterial = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.85 });
    const rimMaterial = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.28, metalness: 0.45 });
    const frameMaterial = new THREE.LineBasicMaterial({ color: 0x71717a });
    const decalMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });

    addBox(car, [4.35, 0.72, 1.48], [0, 0.56, 0], bodyMaterial);
    addBox(car, [4.55, 0.24, 1.54], [0, 0.27, 0], lowerBodyMaterial);
    addBox(car, [1.85, 0.58, 1.12], [-0.35, 1.08, 0], glassMaterial);
    addBox(car, [1.2, 0.24, 1.25], [1.55, 0.92, 0], bodyMaterial);
    addBox(car, [0.72, 0.22, 1.22], [-1.82, 0.88, 0], bodyMaterial);

    addDoorDecal(car, -0.56, 0.755, 0, decalMaterial, frameMaterial);
    addDoorDecal(car, 0.5, 0.755, 0, decalMaterial, frameMaterial);
    addDoorDecal(car, -0.56, -0.755, Math.PI, decalMaterial, frameMaterial);
    addDoorDecal(car, 0.5, -0.755, Math.PI, decalMaterial, frameMaterial);

    addWheel(car, -1.45, 0.78, tireMaterial, rimMaterial);
    addWheel(car, 1.45, 0.78, tireMaterial, rimMaterial);
    addWheel(car, -1.45, -0.78, tireMaterial, rimMaterial);
    addWheel(car, 1.45, -0.78, tireMaterial, rimMaterial);

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
      if (!isDragging) {
        car.rotation.y += 0.004;
      }
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
