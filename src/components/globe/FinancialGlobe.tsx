/**
 * FINANCIAL IMMUNE SYSTEM - SIGNATURE 3D GLOBAL ECOSYSTEM
 * Section 15: Global Globe Foundation
 * Section 16: Login Experience Around the Globe
 * 
 * Principle:
 * GLOBAL GLOBE = SYSTEM MAP = SHARED DOMAIN GRAPH
 * 
 * Powered by Three.js with hardware-accelerated WebGL.
 * Direct projection of authoritative Institution & Dependency entities.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Institution, Dependency, DataProvider, InfrastructureNode } from '@shared/types/domain';
import { SYSTEM_STATUS_MAP } from '@shared/constants/status';

interface FinancialGlobeProps {
  institutions: Institution[];
  dependencies: Dependency[];
  dataProviders?: DataProvider[];
  infrastructureNodes?: InfrastructureNode[];
  selectedEntityId?: string | null;
  onSelectEntity?: (entityId: string) => void;
  interactive?: boolean;
  autoRotateSpeed?: number;
  className?: string;
}

// Convert geographic coordinates to 3D Cartesian coordinates on sphere
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export const FinancialGlobe: React.FC<FinancialGlobeProps> = ({
  institutions,
  dependencies,
  dataProviders = [],
  infrastructureNodes = [],
  selectedEntityId,
  onSelectEntity,
  interactive = true,
  autoRotateSpeed = 0.0015,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<{ id: string; name: string; status: string; x: number; y: number } | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070b12, 0.0018);

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(0, 50, 260);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Main Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const GLOBE_RADIUS = 80;

    // 1. Globe Base Core Sphere
    const coreGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: 0x0a1322,
      emissive: 0x050a14,
      specular: 0x1e3a8a,
      shininess: 25,
      transparent: true,
      opacity: 0.95,
      wireframe: false
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    globeGroup.add(coreMesh);

    // 2. Graticule / Systemic Lat-Long Grid
    const gridGeometry = new THREE.SphereGeometry(GLOBE_RADIUS + 0.2, 36, 18);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x1e2d4a,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    globeGroup.add(gridMesh);

    // 3. Atmosphere Glow Halo
    const haloGeometry = new THREE.SphereGeometry(GLOBE_RADIUS + 4, 32, 32);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0x2563eb,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide
    });
    const haloMesh = new THREE.Mesh(haloGeometry, haloMaterial);
    globeGroup.add(haloMesh);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x475569, 1.2);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0x60a5fa, 2.0);
    directionalLight1.position.set(150, 100, 150);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x1e3a8a, 1.0);
    directionalLight2.position.set(-150, -50, -150);
    scene.add(directionalLight2);

    // 5. Systemic Nodes (Institutions, Data Providers, Infrastructure Nodes)
    interface PlottedNode {
      id: string;
      name: string;
      status: string;
      lat: number;
      lng: number;
      isProvider?: boolean;
      isInfra?: boolean;
    }

    const allPlottedNodes: PlottedNode[] = [];

    institutions.forEach((i) => {
      allPlottedNodes.push({ id: i.institution_id, name: i.name, status: i.status, lat: i.location.lat, lng: i.location.lng });
    });

    dataProviders.forEach((p) => {
      if (p.location) {
        allPlottedNodes.push({ id: p.provider_id, name: p.name, status: p.status, lat: p.location.lat, lng: p.location.lng, isProvider: true });
      }
    });

    infrastructureNodes.forEach((n) => {
      if (n.location) {
        allPlottedNodes.push({ id: n.node_id, name: n.name, status: n.status, lat: n.location.lat, lng: n.location.lng, isInfra: true });
      }
    });

    const nodeMeshes: { mesh: THREE.Mesh; node: PlottedNode }[] = [];
    const nodeGroup = new THREE.Group();
    globeGroup.add(nodeGroup);

    allPlottedNodes.forEach((node) => {
      const pos = latLngToVector3(node.lat, node.lng, GLOBE_RADIUS + 0.8);

      let colorHex = 0x10b981; // STABLE emerald
      if (node.status === 'DEGRADING' || node.status === 'RESIDUAL_RISK') colorHex = 0xf59e0b; // Amber
      if (node.status === 'CRITICAL' || node.status === 'COMPROMISED' || node.status === 'COLLAPSING') colorHex = 0xef4444; // Red
      if (node.status === 'RECOVERING') colorHex = 0x3b82f6; // Blue

      // Node core geometry (Data Providers are slightly larger with diamond/octahedron accents)
      const coreRadius = node.isProvider ? 3.4 : node.isInfra ? 2.8 : 2.4;
      const nodeGeo = node.isProvider 
        ? new THREE.OctahedronGeometry(coreRadius, 0)
        : new THREE.SphereGeometry(coreRadius, 16, 16);

      const nodeMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: node.status === 'COMPROMISED' || node.status === 'CRITICAL' ? 1.2 : 0.8,
        roughness: 0.2,
        metalness: 0.8
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      nodeMesh.userData = { id: node.id, nodeData: node };
      nodeGroup.add(nodeMesh);
      nodeMeshes.push({ mesh: nodeMesh, node });

      // Pulsing outer beacon ring
      const ringRadius = coreRadius + 1.2;
      const beaconGeo = new THREE.RingGeometry(ringRadius, ringRadius + 1.4, 24);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: node.status === 'COMPROMISED' || node.status === 'CRITICAL' ? 0.8 : 0.45,
        side: THREE.DoubleSide
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.copy(pos);
      beaconMesh.lookAt(new THREE.Vector3(0, 0, 0));
      nodeGroup.add(beaconMesh);
    });

    // 6. Systemic Dependencies Arcs
    const arcGroup = new THREE.Group();
    globeGroup.add(arcGroup);

    const getEntityLocation = (id: string) => {
      const inst = institutions.find(i => i.institution_id === id);
      if (inst?.location) return inst.location;
      const prov = dataProviders.find(p => p.provider_id === id);
      if (prov?.location) return prov.location;
      const infra = infrastructureNodes.find(n => n.node_id === id);
      if (infra?.location) return infra.location;
      return null;
    };

    dependencies.forEach((dep) => {
      const loc1 = getEntityLocation(dep.source_id);
      const loc2 = getEntityLocation(dep.target_id);
      if (!loc1 || !loc2) return;

      const v1 = latLngToVector3(loc1.lat, loc1.lng, GLOBE_RADIUS + 0.8);
      const v2 = latLngToVector3(loc2.lat, loc2.lng, GLOBE_RADIUS + 0.8);

      // Midpoint pulled outward from globe to form a 3D bezier arc
      const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
      const distance = v1.distanceTo(v2);
      const arcHeight = Math.min(distance * 0.35, 45);
      const normal = mid.clone().normalize();
      const controlPoint = mid.clone().add(normal.multiplyScalar(arcHeight));

      const curve = new THREE.QuadraticBezierCurve3(v1, controlPoint, v2);
      const points = curve.getPoints(40);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

      let arcColor = 0x3b82f6; // default cobalt
      if (dep.status === 'DEGRADING' || dep.status === 'RESIDUAL_RISK') arcColor = 0xf59e0b;
      if (dep.status === 'CRITICAL' || dep.status === 'COMPROMISED') arcColor = 0xef4444;

      const curveMat = new THREE.LineBasicMaterial({
        color: arcColor,
        transparent: true,
        opacity: dep.is_chokepoint ? 0.85 : 0.45,
        linewidth: dep.is_chokepoint ? 2 : 1
      });

      const line = new THREE.Line(curveGeo, curveMat);
      arcGroup.add(line);
    });

    // Interaction & Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-100, -100);
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging && interactive) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        globeGroup.rotation.y += deltaX * 0.005;
        globeGroup.rotation.x += deltaY * 0.005;

        // Clamp x rotation to avoid upside-down flip
        globeGroup.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, globeGroup.rotation.x));
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }

      // Raycast test against nodes
      if (interactive) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh));
        if (intersects.length > 0) {
          const hit = intersects[0].object;
          const nodeData = hit.userData.nodeData;
          if (nodeData) {
            setHoveredNode({
              id: nodeData.id,
              name: nodeData.name,
              status: nodeData.status,
              x: e.clientX - rect.left,
              y: e.clientY - rect.top
            });
            renderer.domElement.style.cursor = 'pointer';
          }
        } else {
          setHoveredNode(null);
          renderer.domElement.style.cursor = isDragging ? 'grabbing' : 'default';
        }
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (!isDragging && interactive) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh));
        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (hit.userData.id && onSelectEntity) {
            onSelectEntity(hit.userData.id);
          }
        }
      }
      isDragging = false;
      renderer.domElement.style.cursor = 'default';
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();

      // Smooth auto rotation when not dragging
      if (!isDragging && autoRotateSpeed > 0) {
        globeGroup.rotation.y += autoRotateSpeed;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 500;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
      renderer.dispose();
    };
  }, [institutions, dependencies, dataProviders, infrastructureNodes, interactive, autoRotateSpeed, onSelectEntity]);

  return (
    <div className={`relative w-full h-full min-h-[420px] select-none ${className}`} ref={mountRef}>
      {/* Hover tooltip for selected financial node */}
      {hoveredNode && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-1.5 bg-slate-900/95 border border-blue-500/60 rounded shadow-xl backdrop-blur-md"
          style={{ left: `${hoveredNode.x}px`, top: `${hoveredNode.y}px` }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white">{hoveredNode.name}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                hoveredNode.status === 'CRITICAL'
                  ? 'bg-red-950 text-red-400'
                  : hoveredNode.status === 'DEGRADING'
                  ? 'bg-amber-950 text-amber-400'
                  : 'bg-emerald-950 text-emerald-400'
              }`}
            >
              {hoveredNode.status}
            </span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">Click to inspect entity context</div>
        </div>
      )}

      {/* Subtle Globe Overlay Info */}
      <div className="absolute bottom-4 left-4 pointer-events-none text-xs font-mono text-slate-500 bg-slate-950/70 p-2 rounded border border-slate-800">
        <div>PROJECTION: WGS-84 TOPOLOGICAL SPHERE</div>
        <div className="text-slate-400">HUBS: {institutions.length} | CHANNELS: {dependencies.length}</div>
      </div>
    </div>
  );
};
