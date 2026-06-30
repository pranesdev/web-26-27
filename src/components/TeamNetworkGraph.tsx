import { useEffect, useRef, useState } from 'react';

interface Member {
  name: string;
  role: string;
  domain: 'presidency' | 'technical' | 'creatives' | 'operations';
  image: string;
  github: string;
  linkedin: string;
  email: string;
}

interface Node {
  id: string;
  label: string;
  role: string;
  domain: 'presidency' | 'technical' | 'creatives' | 'operations';
  type: 'president' | 'hub' | 'member';
  image?: string;
  visible: boolean;
  expanded?: boolean;
  
  // Physics properties
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  
  // Member reference
  memberRef?: Member;
}

interface Link {
  source: string;
  target: string;
  visible: boolean;
}

const MEMBERS_DATA: Member[] = [
  {
    name: 'Karthik Rajan',
    role: 'President',
    domain: 'presidency',
    image: '/team/karthik-rajan.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'mailto:dsc.srmrmp@gmail.com',
  },
  {
    name: 'Aditya Kumar',
    role: 'Technical Lead',
    domain: 'technical',
    image: '/team/aditya-kumar.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'mailto:dsc.srmrmp@gmail.com',
  },
  {
    name: 'Deepika Menon',
    role: 'Creatives Lead',
    domain: 'creatives',
    image: '/team/deepika-menon.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'mailto:dsc.srmrmp@gmail.com',
  },
  {
    name: 'Sneha Patel',
    role: 'Operations Lead',
    domain: 'operations',
    image: '/team/sneha-patel.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'mailto:dsc.srmrmp@gmail.com',
  },
  {
    name: 'Rahul Anand',
    role: 'Machine Learning',
    domain: 'technical',
    image: '/team/rahul-anand.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'mailto:dsc.srmrmp@gmail.com',
  },
];

interface GraphProps {
  onSelectMember: (member: Member | null) => void;
}

export default function TeamNetworkGraph({ onSelectMember }: GraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  
  // Pre-load images to draw on canvas
  const imagesCache = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    // Pre-cache member profile images
    MEMBERS_DATA.forEach(m => {
      if (m.image) {
        const img = new Image();
        img.src = m.image;
        img.onload = () => {
          imagesCache.current[m.name] = img;
        };
      }
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = containerRef.current?.clientWidth || 800);
    let height = (canvas.height = 550);

    // Initial domain colors
    const colors = {
      presidency: '#1dd1a1', // Mint Green
      technical: '#eab308',   // Gold
      operations: '#00f2fe',  // Cyan
      creatives: '#c084fc',   // Purple
    };

    // Construct the nodes list
    let nodes: Node[] = [
      // President
      {
        id: 'president',
        label: 'Karthik Rajan',
        role: 'President',
        domain: 'presidency',
        type: 'president',
        visible: true,
        x: width / 2,
        y: height / 2 - 40,
        vx: 0,
        vy: 0,
        radius: 40,
        color: colors.presidency,
        memberRef: MEMBERS_DATA[0],
      },
      // Domain Hubs
      {
        id: 'technical_hub',
        label: 'Technical',
        role: 'Domain Hub',
        domain: 'technical',
        type: 'hub',
        visible: true,
        expanded: false,
        x: width / 2 - 180,
        y: height / 2 + 80,
        vx: 0,
        vy: 0,
        radius: 36,
        color: colors.technical,
      },
      {
        id: 'operations_hub',
        label: 'Operations',
        role: 'Domain Hub',
        domain: 'operations',
        type: 'hub',
        visible: true,
        expanded: false,
        x: width / 2 + 180,
        y: height / 2 + 80,
        vx: 0,
        vy: 0,
        radius: 36,
        color: colors.operations,
      },
      {
        id: 'creatives_hub',
        label: 'Creatives',
        role: 'Domain Hub',
        domain: 'creatives',
        type: 'hub',
        visible: true,
        expanded: false,
        x: width / 2,
        y: height / 2 - 190,
        vx: 0,
        vy: 0,
        radius: 36,
        color: colors.creatives,
      },
      // Members (Visible only when respective Hub is expanded)
      {
        id: 'aditya',
        label: 'Aditya Kumar',
        role: 'Technical Lead',
        domain: 'technical',
        type: 'member',
        visible: false,
        x: width / 2 - 250,
        y: height / 2 + 120,
        vx: 0,
        vy: 0,
        radius: 28,
        color: colors.technical,
        memberRef: MEMBERS_DATA[1],
      },
      {
        id: 'deepika',
        label: 'Deepika Menon',
        role: 'Creatives Lead',
        domain: 'creatives',
        type: 'member',
        visible: false,
        x: width / 2 + 80,
        y: height / 2 - 240,
        vx: 0,
        vy: 0,
        radius: 28,
        color: colors.creatives,
        memberRef: MEMBERS_DATA[2],
      },
      {
        id: 'sneha',
        label: 'Sneha Patel',
        role: 'Operations Lead',
        domain: 'operations',
        type: 'member',
        visible: false,
        x: width / 2 + 250,
        y: height / 2 + 120,
        vx: 0,
        vy: 0,
        radius: 28,
        color: colors.operations,
        memberRef: MEMBERS_DATA[3],
      },
      {
        id: 'rahul',
        label: 'Rahul Anand',
        role: 'Machine Learning',
        domain: 'technical',
        type: 'member',
        visible: false,
        x: width / 2 - 180,
        y: height / 2 + 190,
        vx: 0,
        vy: 0,
        radius: 28,
        color: colors.technical,
        memberRef: MEMBERS_DATA[4],
      },
    ];

    // Connective Links list
    let links: Link[] = [
      { source: 'president', target: 'technical_hub', visible: true },
      { source: 'president', target: 'operations_hub', visible: true },
      { source: 'president', target: 'creatives_hub', visible: true },
      { source: 'technical_hub', target: 'aditya', visible: false },
      { source: 'technical_hub', target: 'rahul', visible: false },
      { source: 'creatives_hub', target: 'deepika', visible: false },
      { source: 'operations_hub', target: 'sneha', visible: false },
    ];

    // Interaction variables
    let draggedNode: Node | null = null;
    let mouseOffset = { x: 0, y: 0 };
    let hoverNode: Node | null = null;

    // Track frame ticks to animate connecting laser data pulses
    let pulseProgress = 0;

    const resizeCanvas = () => {
      if (!containerRef.current) return;
      width = canvas.width = containerRef.current.clientWidth;
      height = canvas.height = 550;
    };

    window.addEventListener('resize', resizeCanvas);

    // Toggle branches on hub clicks
    const toggleHubBranch = (hubNode: Node) => {
      const isExpanding = !hubNode.expanded;
      hubNode.expanded = isExpanding;

      // Toggle linked members visibility
      nodes.forEach(n => {
        if (n.type === 'member' && n.domain === hubNode.domain) {
          n.visible = isExpanding;
          if (isExpanding) {
            // Explode particles outwards from hub coordinate location
            n.x = hubNode.x + (Math.random() - 0.5) * 20;
            n.y = hubNode.y + (Math.random() - 0.5) * 20;
            n.vx = (Math.random() - 0.5) * 8;
            n.vy = (Math.random() - 0.5) * 8;
          }
        }
      });

      links.forEach(l => {
        const srcNode = nodes.find(n => n.id === l.source);
        const tgtNode = nodes.find(n => n.id === l.target);
        if (srcNode && tgtNode) {
          l.visible = srcNode.visible && tgtNode.visible;
        }
      });
    };

    // Handle mouse drag / click triggers
    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const clicked = nodes.find(n => {
        if (!n.visible) return false;
        const dx = mx - n.x;
        const dy = my - n.y;
        return Math.sqrt(dx * dx + dy * dy) < n.radius;
      });

      if (clicked) {
        draggedNode = clicked;
        mouseOffset = { x: clicked.x - mx, y: clicked.y - my };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (draggedNode) {
        draggedNode.x = mx + mouseOffset.x;
        draggedNode.y = my + mouseOffset.y;
        draggedNode.vx = 0;
        draggedNode.vy = 0;
      } else {
        // Find hover node
        const match = nodes.find(n => {
          if (!n.visible) return false;
          const dx = mx - n.x;
          const dy = my - n.y;
          return Math.sqrt(dx * dx + dy * dy) < n.radius;
        });

        if (match !== hoverNode) {
          hoverNode = match || null;
          setHoveredNode(hoverNode);
          canvas.style.cursor = match ? 'pointer' : 'default';
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (draggedNode) {
        // Click action (if not dragged far)
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const dx = mx - (draggedNode.x - mouseOffset.x);
        const dy = my - (draggedNode.y - mouseOffset.y);
        const dragDist = Math.sqrt(dx * dx + dy * dy);

        if (dragDist < 5) {
          if (draggedNode.type === 'hub') {
            toggleHubBranch(draggedNode);
            onSelectMember(null);
          } else if (draggedNode.memberRef) {
            onSelectMember(draggedNode.memberRef);
          }
        }
        draggedNode = null;
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Physics parameters
    const stiffness = 0.015; // spring strength
    const restLength = 110;  // ideal link length
    const repulsionStrength = 2200; // coulomb repulsion
    const damping = 0.88; // friction / deceleration damping

    const updatePhysics = () => {
      const activeNodes = nodes.filter(n => n.visible);

      // 1. Repulsion between all nodes
      for (let i = 0; i < activeNodes.length; i++) {
        const n1 = activeNodes[i];
        for (let j = i + 1; j < activeNodes.length; j++) {
          const n2 = activeNodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          // Increase repulsion if they are too close to prevent overlap
          const force = repulsionStrength / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (n1 !== draggedNode) {
            n1.vx += fx;
            n1.vy += fy;
          }
          if (n2 !== draggedNode) {
            n2.vx -= fx;
            n2.vy -= fy;
          }
        }
      }

      // 2. Attraction along connected link lines (Hooke's Law)
      links.forEach(link => {
        if (!link.visible) return;
        const n1 = nodes.find(n => n.id === link.source)!;
        const n2 = nodes.find(n => n.id === link.target)!;

        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const extension = dist - restLength;
        const force = extension * stiffness;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (n1 !== draggedNode) {
          n1.vx -= fx;
          n1.vy -= fy;
        }
        if (n2 !== draggedNode) {
          n2.vx += fx;
          n2.vy += fy;
        }
      });

      // 3. Central gravity constraint (prevents drifting off screen)
      activeNodes.forEach(n => {
        if (n === draggedNode) return;

        const cx = width / 2;
        const cy = height / 2;
        const dx = cx - n.x;
        const dy = cy - n.y;
        
        n.vx += dx * 0.0006;
        n.vy += dy * 0.0006;

        // Apply friction and move
        n.vx *= damping;
        n.vy *= damping;
        n.x += n.vx;
        n.y += n.vy;

        // Bounding box screen limits
        const margin = n.radius + 15;
        if (n.x < margin) { n.x = margin; n.vx *= -0.2; }
        if (n.x > width - margin) { n.x = width - margin; n.vx *= -0.2; }
        if (n.y < margin) { n.y = margin; n.vy *= -0.2; }
        if (n.y > height - margin) { n.y = height - margin; n.vy *= -0.2; }
      });
    };

    // Render loop
    const render = () => {
      updatePhysics();
      ctx.clearRect(0, 0, width, height);

      // Increment signal pulse progress animation
      pulseProgress = (pulseProgress + 0.008) % 1;

      // 1. Draw Connective Link Lines
      links.forEach(l => {
        if (!l.visible) return;
        const n1 = nodes.find(n => n.id === l.source)!;
        const n2 = nodes.find(n => n.id === l.target)!;

        // Base links line
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = 'rgba(232, 237, 233, 0.06)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Glowing animated pulse dot along link
        const px = n1.x + (n2.x - n1.x) * pulseProgress;
        const py = n1.y + (n2.y - n1.y) * pulseProgress;

        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = n2.color;
        ctx.shadowColor = n2.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow
      });

      // 2. Draw Nodes
      nodes.forEach(n => {
        if (!n.visible) return;

        ctx.save();

        // Hover enlarges card visually
        const scale = hoverNode?.id === n.id ? 1.08 : 1.0;
        const r = n.radius * scale;

        // Draw shadow glow circle behind the node
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(8, 13, 11, 0.9)';
        ctx.shadowColor = n.color;
        ctx.shadowBlur = hoverNode?.id === n.id ? 15 : 6;
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Draw border ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = n.color;
        ctx.lineWidth = n.type === 'hub' ? 3 : 2;
        ctx.stroke();

        // Draw node content
        if (n.type === 'hub') {
          // Draw Domain Hub node
          ctx.beginPath();
          ctx.arc(n.x, n.y, r - 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(17, 23, 20, 0.85)';
          ctx.fill();

          // Hub Label text
          ctx.fillStyle = '#ffffff';
          ctx.font = '600 11.5px Inter';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(n.label.toUpperCase(), n.x, n.y - 2);

          // Subtitle (Click to expand/collapse indicator)
          ctx.fillStyle = n.color;
          ctx.font = '500 8.5px Inter';
          ctx.fillText(n.expanded ? 'COLLAPSE' : 'EXPAND', n.x, n.y + 11);
        } else {
          // Draw Profile Circle Image
          const img = imagesCache.current[n.label];
          if (img) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, r - 1.5, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(img, n.x - r, n.y - r, r * 2, r * 2);
          } else {
            // Fallback flat color placeholder
            ctx.beginPath();
            ctx.arc(n.x, n.y, r - 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(232, 237, 233, 0.1)';
            ctx.fill();
          }
        }

        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationId);
    };
  }, [onSelectMember]);

  return (
    <div ref={containerRef} className="network-graph-container">
      {/* Node Hover HTML Tooltip */}
      {hoveredNode && (
        <div
          className="graph-node-tooltip"
          style={{
            position: 'absolute',
            left: `${hoveredNode.x}px`,
            top: `${hoveredNode.y - hoveredNode.radius - 40}px`,
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
        >
          <div className="tooltip-inner" style={{ borderColor: hoveredNode.color }}>
            <div className="tooltip-name">{hoveredNode.label}</div>
            <div className="tooltip-role" style={{ color: hoveredNode.color }}>
              {hoveredNode.role}
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="network-graph-canvas" />

      <style>{`
        .network-graph-container {
          position: relative;
          width: 100%;
          background: rgba(17, 23, 20, 0.45);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
          margin-bottom: 40px;
          box-shadow: inset 0 4px 30px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(16px);
        }

        .network-graph-canvas {
          display: block;
          width: 100%;
          height: 550px;
          background: transparent;
        }

        /* Node Tooltips */
        .graph-node-tooltip {
          z-index: 100;
          animation: tooltipFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .tooltip-inner {
          background: rgba(8, 13, 11, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 8px 14px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
          text-align: center;
          white-space: nowrap;
        }

        .tooltip-name {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #e8ede9;
          margin-bottom: 2px;
        }

        .tooltip-role {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @keyframes tooltipFadeIn {
          0% { opacity: 0; transform: translateX(-50%) translateY(8px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
