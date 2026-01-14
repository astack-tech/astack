'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Data Flow Canvas Animation
 *
 * Visualizes AStack's core concept: data flowing through connected components
 * Features:
 * - Component nodes (representing AStack components)
 * - Data packets flowing between nodes (representing port-to-port data flow)
 * - Connection lines showing the pipeline structure
 * - Responsive and performant
 *
 * Design: Reflects AStack's port-based composition and data flow paradigm
 */

// Type definitions
interface Node {
  x: number;
  y: number;
  radius: number;
  label: string;
  connections: number[]; // Indices of connected nodes
}

interface DataPacket {
  fromNode: number;
  toNode: number;
  progress: number; // 0 to 1
  speed: number;
  size: number;
}

// Configuration
const CONFIG = {
  // Node settings
  nodeCount: 6,
  nodeRadius: 8,
  nodeColor: '0, 240, 255',
  nodeOpacity: 0.6,

  // Data packet settings
  packetCount: 12,
  packetSize: 3,
  packetSpeed: 0.008,
  packetColor: '0, 240, 255',
  packetOpacity: 0.9,

  // Connection settings
  connectionOpacity: 0.15,
  connectionWidth: 1,

  // Layout
  padding: 100,
} as const;

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const packetsRef = useRef<DataPacket[]>([]);
  const animationFrameRef = useRef<number>(0);

  /**
   * Initialize nodes in a distributed layout
   */
  const initNodes = useCallback((width: number, height: number) => {
    const nodes: Node[] = [];
    const centerX = width / 2;
    const centerY = height / 2;

    // Scale radius based on screen size for better coverage
    const baseRadius = Math.min(width, height) / 2.5;
    const radius = Math.max(baseRadius, 250); // Minimum radius for small screens

    // Create nodes in a circular layout
    for (let i = 0; i < CONFIG.nodeCount; i++) {
      const angle = (i / CONFIG.nodeCount) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Each node connects to 1-2 nearby nodes (creating a pipeline structure)
      const connections: number[] = [];
      connections.push((i + 1) % CONFIG.nodeCount); // Connect to next node
      if (Math.random() > 0.5) {
        connections.push((i + 2) % CONFIG.nodeCount); // Sometimes skip one
      }

      nodes.push({
        x,
        y,
        radius: CONFIG.nodeRadius,
        label: `C${i + 1}`,
        connections,
      });
    }

    nodesRef.current = nodes;
  }, []);

  /**
   * Initialize data packets
   */
  const initPackets = useCallback(() => {
    const packets: DataPacket[] = [];
    const nodes = nodesRef.current;

    for (let i = 0; i < CONFIG.packetCount; i++) {
      // Random starting node
      const fromNode = Math.floor(Math.random() * nodes.length);
      const node = nodes[fromNode];

      // Pick a random connection from this node
      if (node.connections.length > 0) {
        const toNode = node.connections[Math.floor(Math.random() * node.connections.length)];

        packets.push({
          fromNode,
          toNode,
          progress: Math.random(), // Random starting position
          speed: CONFIG.packetSpeed * (0.8 + Math.random() * 0.4), // Varied speed
          size: CONFIG.packetSize,
        });
      }
    }

    packetsRef.current = packets;
  }, []);

  /**
   * Update data packet positions
   */
  const updatePackets = useCallback(() => {
    const packets = packetsRef.current;
    const nodes = nodesRef.current;

    packets.forEach((packet) => {
      // Move packet along the connection
      packet.progress += packet.speed;

      // When packet reaches destination, pick new route
      if (packet.progress >= 1) {
        packet.fromNode = packet.toNode;
        const fromNode = nodes[packet.fromNode];

        if (fromNode.connections.length > 0) {
          packet.toNode = fromNode.connections[Math.floor(Math.random() * fromNode.connections.length)];
        }

        packet.progress = 0;
      }
    });
  }, []);

  /**
   * Draw the visualization
   */
  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const nodes = nodesRef.current;
    const packets = packetsRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw connections (pipeline structure)
    nodes.forEach((node, i) => {
      node.connections.forEach((targetIdx) => {
        const target = nodes[targetIdx];

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${CONFIG.nodeColor}, ${CONFIG.connectionOpacity})`;
        ctx.lineWidth = CONFIG.connectionWidth;
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();

        // Draw arrow to show direction
        const angle = Math.atan2(target.y - node.y, target.x - node.x);
        const arrowSize = 6;
        const arrowPos = 0.7; // Position along the line
        const arrowX = node.x + (target.x - node.x) * arrowPos;
        const arrowY = node.y + (target.y - node.y) * arrowPos;

        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(
          arrowX - arrowSize * Math.cos(angle - Math.PI / 6),
          arrowY - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          arrowX - arrowSize * Math.cos(angle + Math.PI / 6),
          arrowY - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = `rgba(${CONFIG.nodeColor}, ${CONFIG.connectionOpacity * 1.5})`;
        ctx.fill();
      });
    });

    // Draw nodes (components)
    nodes.forEach((node) => {
      // Node glow
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.nodeColor}, ${CONFIG.nodeOpacity * 0.2})`;
      ctx.fill();

      // Node core
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.nodeColor}, ${CONFIG.nodeOpacity})`;
      ctx.fill();

      // Node border
      ctx.strokeStyle = `rgba(${CONFIG.nodeColor}, ${CONFIG.nodeOpacity + 0.2})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Draw data packets (flowing data)
    packets.forEach((packet) => {
      const fromNode = nodes[packet.fromNode];
      const toNode = nodes[packet.toNode];

      // Calculate current position using easing
      const easeProgress = packet.progress < 0.5
        ? 2 * packet.progress * packet.progress
        : 1 - Math.pow(-2 * packet.progress + 2, 2) / 2;

      const x = fromNode.x + (toNode.x - fromNode.x) * easeProgress;
      const y = fromNode.y + (toNode.y - fromNode.y) * easeProgress;

      // Packet glow
      ctx.beginPath();
      ctx.arc(x, y, packet.size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.packetColor}, ${CONFIG.packetOpacity * 0.3})`;
      ctx.fill();

      // Packet core
      ctx.beginPath();
      ctx.arc(x, y, packet.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.packetColor}, ${CONFIG.packetOpacity})`;
      ctx.fill();

      // Packet trail
      const trailLength = 0.1;
      const trailProgress = Math.max(0, easeProgress - trailLength);
      const trailX = fromNode.x + (toNode.x - fromNode.x) * trailProgress;
      const trailY = fromNode.y + (toNode.y - fromNode.y) * trailProgress;

      const gradient = ctx.createLinearGradient(trailX, trailY, x, y);
      gradient.addColorStop(0, `rgba(${CONFIG.packetColor}, 0)`);
      gradient.addColorStop(1, `rgba(${CONFIG.packetColor}, ${CONFIG.packetOpacity * 0.5})`);

      ctx.beginPath();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = packet.size * 1.5;
      ctx.lineCap = 'round';
      ctx.moveTo(trailX, trailY);
      ctx.lineTo(x, y);
      ctx.stroke();
    });
  }, []);

  /**
   * Animation loop
   */
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    updatePackets();
    draw(ctx, width, height);

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [updatePackets, draw]);

  /**
   * Handle canvas resize
   */
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    initNodes(rect.width, rect.height);
    initPackets();
  }, [initNodes, initPackets]);

  // Setup and cleanup
  useEffect(() => {
    handleResize();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
