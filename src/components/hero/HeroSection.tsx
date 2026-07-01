import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const OG = "#C9883A";
const C2 = "#cc785c";

const HOME_CASCADE_A = [
  "Enterprise AI Platform","Cloud Architecture","DevSecOps Pipelines",
  "AI-Powered ERP","Intelligent Automation","Data Analytics",
  "Cybersecurity","ML Operations","Digital Transformation","Quantum Computing",
];
const HOME_CASCADE_B = [
  "Reduced Operational Cost","Zero-Downtime Deployment","Accelerated Innovation",
  "Compliance & Security","Scalable Infrastructure","Real-Time Insights",
  "Future-Proof Systems","Intelligent Automation","Enterprise-Grade Security",
];

const CYCLE_WORDS = [
  "AI-Powered ERP","DevSecOps Pipelines","Cloud Infrastructure",
  "AI Training & Consulting","Quantum Computing","Intelligent Automation",
  "Data Analytics","Cybersecurity","Digital Transformation",
];

const FULL_TEXT = "Enterprise AI";
const HUB = { cx: 260, cy: 222, r: 44 };

const NET_NODES = [
  { id:"fin",   cx:98,  cy:82,  r:24, label:"Finance",   color:"#F5A623", glow:"rgba(245,166,35,0.28)"  },
  { id:"cloud", cx:402, cy:68,  r:24, label:"Cloud",     color:"#6B3FA0", glow:"rgba(107,63,160,0.28)"  },
  { id:"hr",    cx:456, cy:215, r:22, label:"HR",        color:"#E8733A", glow:"rgba(232,115,58,0.28)"  },
  { id:"crm",   cx:402, cy:358, r:22, label:"CRM",       color:"#C4842A", glow:"rgba(196,132,42,0.28)"  },
  { id:"ai",    cx:260, cy:408, r:26, label:"AI/ML",     color:"#8B5CF6", glow:"rgba(139,92,246,0.28)"  },
  { id:"dev",   cx:78,  cy:330, r:22, label:"DevSecOps", color:"#D46A1A", glow:"rgba(212,106,26,0.28)"  },
];

// ── Dark atmospheric cascade ──────────────────────────────────────────────────
const DarkCascade = ({ prefersReduced }: { prefersReduced: boolean }) => {
  if (prefersReduced) return null;
  const a = [...HOME_CASCADE_A, ...HOME_CASCADE_A];
  const b = [...HOME_CASCADE_B, ...HOME_CASCADE_B];
  const t: React.CSSProperties = {
    fontFamily: "'Cormorant Garamond',Garamond,serif",
    fontSize: "clamp(14px,1.8vw,22px)",
    fontWeight: 600, whiteSpace: "nowrap",
    letterSpacing: "0.01em", lineHeight: 1,
  };
  return (
    <div aria-hidden="true" style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
      <div style={{ position:"absolute", left:"2%", top:0, bottom:0, overflow:"hidden" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:28, animation:"xzCreamScrollA 58s linear infinite", willChange:"transform" }}>
          {a.map((m,i) => <span key={i} style={{ ...t, color:"rgba(201,136,58,0.09)" }}>{m}</span>)}
        </div>
      </div>
      <div className="xz-cream-cascade-b" style={{ position:"absolute", right:"1%", top:0, bottom:0, overflow:"hidden" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:28, transform:"translateY(-12%)", animation:"xzCreamScrollB 74s linear infinite", willChange:"transform" }}>
          {b.map((m,i) => <span key={i} style={{ ...t, color:"rgba(204,120,92,0.07)" }}>{m}</span>)}
        </div>
      </div>
    </div>
  );
};

// ── AI Network Visualization (3D tilt + SVG network) ─────────────────────────
const RADAIVisualization = ({ prefersReduced }: { prefersReduced: boolean }) => {
  const [time,     setTime    ] = useState(new Date());
  const [mounted,  setMounted ] = useState(false);
  const [counts,   setCounts  ] = useState({ uptime:0, models:0, clients:0 });
  const [flashIdx, setFlashIdx] = useState(-1);
  const floatRef = useRef<HTMLDivElement>(null);
  const cardRef  = useRef<HTMLDivElement>(null);
  const hlRef    = useRef<HTMLDivElement>(null);
  const flashTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardLeaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id); }, []);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 120); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (prefersReduced) { setCounts({ uptime:999, models:247, clients:120 }); return; }
    const start = Date.now(), dur = 2200;
    const id = setInterval(() => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const e = 1 - Math.pow(2, -10 * p);
      setCounts({ uptime:Math.round(999*e), models:Math.round(247*e), clients:Math.round(120*e) });
      if (p === 1) clearInterval(id);
    }, 33);
    return () => clearInterval(id);
  }, [prefersReduced]);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => {
      setFlashIdx(Math.floor(Math.random() * 3));
      flashTimerRef.current = setTimeout(() => setFlashIdx(-1), 800);
    }, 3500);
    return () => { clearInterval(id); if (flashTimerRef.current) clearTimeout(flashTimerRef.current); };
  }, [prefersReduced]);

  const onCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const el = cardRef.current; const hl = hlRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top)  / rect.height;
    const rotY = (x - 0.5) * 22, rotX = (0.5 - y) * 14;
    el.style.transition = "transform 0.08s linear,box-shadow 0.08s linear";
    el.style.transform  = `perspective(1100px) rotateX(${rotY}deg) rotateY(${rotX}deg) scale(1.02)`;
    el.style.boxShadow  = `${(-rotY*1.6).toFixed(1)}px ${(40+rotX).toFixed(1)}px 90px rgba(80,45,15,0.50),0 0 0 1px rgba(255,255,255,0.06) inset`;
    if (hl) {
      hl.style.opacity    = "1";
      hl.style.background = `radial-gradient(ellipse 55% 45% at ${(x*100).toFixed(1)}% ${(y*100).toFixed(1)}%,rgba(255,215,185,0.14) 0%,transparent 65%)`;
    }
  };
  const onCardEnter = () => { if (prefersReduced) return; if (floatRef.current) floatRef.current.style.animationPlayState = "paused"; };
  const onCardLeave = () => {
    if (prefersReduced) return;
    const el = cardRef.current;
    if (el) { el.style.transition = "transform 0.55s cubic-bezier(0.22,1,0.36,1),box-shadow 0.55s ease"; el.style.transform = ""; el.style.boxShadow = ""; }
    if (hlRef.current) hlRef.current.style.opacity = "0";
    if (cardLeaveTimerRef.current) clearTimeout(cardLeaveTimerRef.current);
    cardLeaveTimerRef.current = setTimeout(() => { if (floatRef.current) floatRef.current.style.animationPlayState = "running"; if (cardRef.current) cardRef.current.style.transition = ""; }, 560);
  };

  const timeStr = time.toLocaleTimeString("en-US", { hour12:false });
  const stats = [
    { label:"UPTIME",    val:`${(counts.uptime/10).toFixed(1)}%` },
    { label:"AI MODELS", val:`${counts.models}` },
    { label:"CLIENTS",   val:`${counts.clients}+` },
  ];

  return (
    <div ref={floatRef} style={{ animation: prefersReduced?"none":"xzCardFloat 7s ease-in-out 1.5s infinite", width:"100%", maxWidth:390 }}>
      <div
        ref={cardRef}
        onMouseMove={onCardMove} onMouseEnter={onCardEnter} onMouseLeave={onCardLeave}
        style={{
          position:"relative", width:"100%",
          /* slightly warmer/lighter than section bg so card lifts from darkness */
          background:"linear-gradient(145deg,#231c0e 0%,#1e1509 100%)",
          border:"1px solid rgba(180,140,100,0.22)",
          borderRadius:20,
          padding:"16px 16px 12px",
          boxShadow:"0 40px 90px rgba(80,45,15,0.45),0 0 0 1px rgba(255,255,255,0.05) inset,inset 0 1px 0 rgba(201,136,58,0.10)",
          animation: prefersReduced?"none":"xzCardSlideRight 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s both",
          transformStyle:"preserve-3d", willChange:"transform",
        }}
      >
        {/* Specular highlight */}
        <div ref={hlRef} aria-hidden="true" style={{ position:"absolute", inset:0, borderRadius:20, pointerEvents:"none", opacity:0, transition:"background 0.12s ease,opacity 0.25s ease", zIndex:10 }} />
        {/* Inner warm glow */}
        <div aria-hidden="true" style={{ position:"absolute", inset:0, borderRadius:20, pointerEvents:"none", background:"radial-gradient(ellipse 80% 40% at 50% 0%,rgba(201,136,58,0.13) 0%,transparent 70%)" }} />

        {/* Top bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, position:"relative", zIndex:2, transform:"translateZ(14px)" }}>
          <span style={{ fontFamily:"'Courier New',monospace", fontSize:9, fontWeight:700, letterSpacing:"0.22em", color:"rgba(180,140,100,0.5)", textTransform:"uppercase" }}>AI NETWORK</span>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", flexShrink:0, background:"#4ade80", boxShadow:"0 0 7px #4ade80,0 0 14px rgba(74,222,128,0.4)", animation: prefersReduced?"none":"xzLivePulse 1.8s ease-in-out infinite" }} />
              <span style={{ fontFamily:"'Courier New',monospace", fontSize:8, fontWeight:700, letterSpacing:"0.12em", color:"#4ade80" }}>LIVE</span>
            </div>
            <span style={{ fontFamily:"'Courier New',monospace", fontSize:11, color:C2, letterSpacing:"0.05em" }}>{timeStr}</span>
          </div>
        </div>

        {/* SVG Network */}
        <div style={{ position:"relative", zIndex:2, transform:"translateZ(22px)" }}>
          <svg viewBox="0 0 520 500" width="100%" style={{ overflow:"visible", display:"block" }} aria-label="XERXEZ AI module network">
            <defs>
              <pattern id="xzDotGrid" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
                <circle cx="0.5" cy="0.5" r="0.5" fill="rgba(180,140,100,0.07)" />
              </pattern>
              <filter id="xzHubGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="9" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="xzTravGlow" x="-150%" y="-150%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="2.5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <radialGradient id="xzHubFill" cx="50%" cy="40%" r="50%">
                <stop offset="0%"   stopColor="rgba(204,120,92,0.28)"/>
                <stop offset="100%" stopColor="rgba(204,120,92,0.06)"/>
              </radialGradient>
            </defs>
            <rect width="520" height="458" fill="url(#xzDotGrid)"/>
            <text x="506" y="18"  textAnchor="end"   fill="rgba(180,140,100,0.11)" fontSize="8" fontFamily="'Courier New',monospace" letterSpacing="1.5">CLOUD</text>
            <text x="506" y="448" textAnchor="end"   fill="rgba(180,140,100,0.11)" fontSize="8" fontFamily="'Courier New',monospace" letterSpacing="1.5">CRM</text>
            <text x="14"  y="18"  textAnchor="start" fill="rgba(180,140,100,0.11)" fontSize="8" fontFamily="'Courier New',monospace" letterSpacing="1.5">FIN</text>
            <text x="14"  y="448" textAnchor="start" fill="rgba(180,140,100,0.11)" fontSize="8" fontFamily="'Courier New',monospace" letterSpacing="1.5">DEV</text>

            {NET_NODES.map((n,i) => {
              const dx=n.cx-HUB.cx, dy=n.cy-HUB.cy;
              const len=Math.ceil(Math.sqrt(dx*dx+dy*dy));
              return <line key={`l-${n.id}`} x1={HUB.cx} y1={HUB.cy} x2={n.cx} y2={n.cy} stroke={n.color} strokeWidth="1" strokeOpacity="0.22" strokeDasharray={len}
                style={{ strokeDashoffset: mounted&&!prefersReduced?0:len, transition: prefersReduced?"none":`stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1) ${0.35+i*0.1}s` }}/>;
            })}

            {NET_NODES.map((n,i) => (
              <circle key={`t-${n.id}`} r="2.8" fill={n.color} filter="url(#xzTravGlow)"
                opacity={mounted&&!prefersReduced?0.9:0} style={{ transition:`opacity 0.3s ease ${0.9+i*0.1}s` }}>
                {!prefersReduced && <animateMotion dur={`${2.6+i*0.38}s`} repeatCount="indefinite" path={`M ${HUB.cx},${HUB.cy} L ${n.cx},${n.cy}`}/>}
              </circle>
            ))}

            {NET_NODES.map((n,i) => (
              <g key={n.id} style={{ opacity: mounted?1:0, transition: prefersReduced?"none":`opacity 0.55s ease ${0.5+i*0.1}s` }}>
                <circle cx={n.cx} cy={n.cy} r={n.r+6} fill="none" stroke={n.color} strokeWidth="0.8">
                  <animate attributeName="r" values={`${n.r+3};${n.r+18};${n.r+3}`} dur={`${3.4+i*0.28}s`} repeatCount="indefinite"/>
                  <animate attributeName="stroke-opacity" values="0.45;0;0.45" dur={`${3.4+i*0.28}s`} repeatCount="indefinite"/>
                </circle>
                <circle cx={n.cx} cy={n.cy} r={n.r+3} fill={n.glow}/>
                <circle cx={n.cx} cy={n.cy} r={n.r+1} fill="none" stroke={n.color} strokeWidth="0.6" strokeOpacity="0.3"/>
                <circle cx={n.cx} cy={n.cy} r={n.r} fill="rgba(26,18,8,0.82)" stroke={n.color} strokeWidth="1.4" strokeOpacity="0.8"/>
                <circle cx={n.cx} cy={n.cy-n.r+7} r="2.8" fill={n.color} filter="url(#xzTravGlow)"/>
                <text x={n.cx} y={n.cy+5} textAnchor="middle" fill="rgba(255,255,255,0.78)" fontSize="9" fontFamily="'Inter',sans-serif" fontWeight="500">{n.label}</text>
              </g>
            ))}

            <circle cx={HUB.cx} cy={HUB.cy} r={HUB.r+36} fill="rgba(204,120,92,0.05)"/>
            <circle cx={HUB.cx} cy={HUB.cy} r={HUB.r+22} fill="rgba(204,120,92,0.08)"/>
            <circle cx={HUB.cx} cy={HUB.cy} r={HUB.r+15} fill="none" stroke={C2} strokeWidth="1.3" strokeDasharray="9 7" strokeOpacity="0.55">
              {!prefersReduced&&<animateTransform attributeName="transform" type="rotate" from={`0 ${HUB.cx} ${HUB.cy}`} to={`360 ${HUB.cx} ${HUB.cy}`} dur="14s" repeatCount="indefinite"/>}
            </circle>
            <circle cx={HUB.cx} cy={HUB.cy} r={HUB.r+8} fill="none" stroke={C2} strokeWidth="0.7" strokeDasharray="3 10" strokeOpacity="0.3">
              {!prefersReduced&&<animateTransform attributeName="transform" type="rotate" from={`360 ${HUB.cx} ${HUB.cy}`} to={`0 ${HUB.cx} ${HUB.cy}`} dur="20s" repeatCount="indefinite"/>}
            </circle>
            <circle cx={HUB.cx} cy={HUB.cy} r={HUB.r+2} fill="none" stroke={C2} strokeWidth="0.8" strokeOpacity="0.3"/>
            <circle cx={HUB.cx} cy={HUB.cy} r={HUB.r} fill="url(#xzHubFill)" stroke={C2} strokeWidth="1.8" strokeOpacity="0.92" filter="url(#xzHubGlow)"/>
            <circle cx={HUB.cx} cy={HUB.cy} r={HUB.r+4} fill="none" stroke={C2} strokeWidth="1.8">
              <animate attributeName="r" values={`${HUB.r+2};${HUB.r+26};${HUB.r+2}`} dur="3s" repeatCount="indefinite"/>
              <animate attributeName="stroke-opacity" values="0.55;0;0.55" dur="3s" repeatCount="indefinite"/>
            </circle>
            <text x={HUB.cx} y={HUB.cy-5} textAnchor="middle" fill="rgba(255,255,255,0.94)" fontSize="13.5" fontFamily="'Cormorant Garamond',Garamond,serif" fontWeight="600">XERXEZ</text>
            <text x={HUB.cx} y={HUB.cy+11} textAnchor="middle" fill="rgba(204,120,92,0.65)" fontSize="7" fontFamily="'Courier New',monospace" fontWeight="500" letterSpacing="2">AI PLATFORM</text>
          </svg>
        </div>

        {/* Stats row */}
        <div style={{ display:"flex", gap:6, position:"relative", zIndex:2, borderTop:"1px solid rgba(180,140,100,0.10)", paddingTop:13, marginTop:2, transform:"translateZ(8px)" }}>
          {stats.map((s,i) => (
            <div key={s.label} style={{
              flex:1, textAlign:"center",
              background: flashIdx===i?"rgba(204,120,92,0.12)":"rgba(255,255,255,0.025)",
              border:`1px solid ${flashIdx===i?"rgba(204,120,92,0.32)":"rgba(180,140,100,0.10)"}`,
              borderRadius:10, padding:"9px 4px",
              transition:"all 0.32s ease",
            }}>
              <div style={{ fontFamily:"'Inter',sans-serif", fontSize:16, fontWeight:700, color: flashIdx===i?C2:"rgba(255,255,255,0.83)", lineHeight:1, transition:"color 0.32s ease" }}>{s.val}</div>
              <div style={{ fontFamily:"'Inter',sans-serif", fontSize:7, color:"rgba(180,140,100,0.48)", letterSpacing:"0.1em", textTransform:"uppercase", marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Orbit rings — abstract tech geometry ─────────────────────────────────────
const OrbitRings = () => (
  <>
    <div aria-hidden="true" style={{
      position:"absolute", right:"-18%", top:"-5%",
      width:750, height:750, borderRadius:"50%",
      border:"1px solid rgba(201,136,58,0.07)",
      animation:"xzRingRotate 90s linear infinite",
      pointerEvents:"none", zIndex:0,
    }}/>
    <div aria-hidden="true" style={{
      position:"absolute", right:"-8%", top:"8%",
      width:560, height:560, borderRadius:"50%",
      border:"1px dashed rgba(204,120,92,0.05)",
      animation:"xzRingRotate 130s linear infinite reverse",
      pointerEvents:"none", zIndex:0,
    }}/>
    <div aria-hidden="true" style={{
      position:"absolute", right:"5%", top:"20%",
      width:380, height:380, borderRadius:"50%",
      border:"1px solid rgba(139,92,246,0.04)",
      animation:"xzRingRotate 70s linear infinite",
      pointerEvents:"none", zIndex:0,
    }}/>
  </>
);

// ── Floating diamond particles ────────────────────────────────────────────────
const DIAMONDS = [
  { top:"20%", left:"50%",  size:9,  color:"rgba(201,136,58,0.22)", delay:"0s",  dur:"9s"  },
  { top:"58%", left:"43%",  size:6,  color:"rgba(204,120,92,0.28)", delay:"2.5s",dur:"12s" },
  { top:"34%", left:"63%",  size:7,  color:"rgba(201,136,58,0.18)", delay:"1s",  dur:"11s" },
  { top:"72%", right:"20%", size:11, color:"rgba(201,136,58,0.14)", delay:"3.5s",dur:"8s"  },
  { top:"12%", left:"58%",  size:5,  color:"rgba(204,120,92,0.20)", delay:"5s",  dur:"14s" },
];
const FloatingDiamonds = () => (
  <>
    {DIAMONDS.map((d,i) => (
      <div key={i} aria-hidden="true" style={{
        position:"absolute",
        top: d.top,
        left: "left" in d ? (d as { left: string } & typeof d).left : undefined,
        right: "right" in d ? (d as { right: string } & typeof d).right : undefined,
        width:d.size, height:d.size,
        background:d.color,
        transform:"rotate(45deg)",
        animation:`xzDiamondFloat ${d.dur} ease-in-out ${d.delay} infinite`,
        pointerEvents:"none", zIndex:0,
      }}/>
    ))}
  </>
);

// ── Main section ──────────────────────────────────────────────────────────────
const HeroSection = () => {
  const [prefersReduced] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion:reduce)").matches : false
  );
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const [wordIdx,  setWordIdx ] = useState(0);
  const [fadeIn,   setFadeIn  ] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const sectionRef  = useRef<HTMLElement>(null);
  const wordTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn, { passive:true });
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setFadeIn(false);
      wordTimerRef.current = setTimeout(() => { setWordIdx(i => (i+1) % CYCLE_WORDS.length); setFadeIn(true); }, 350);
    }, 2500);
    return () => { clearInterval(id); if (wordTimerRef.current) clearTimeout(wordTimerRef.current); };
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    const fn = () => { if (el) el.classList.toggle("xz-hero-paused", document.hidden); };
    document.addEventListener("visibilitychange", fn);
    return () => document.removeEventListener("visibilitychange", fn);
  }, []);

  const onBtnClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = btnRef.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement("span");
    Object.assign(ripple.style, {
      position:"absolute", left:`${e.clientX-rect.left}px`, top:`${e.clientY-rect.top}px`,
      width:"6px", height:"6px", background:"rgba(255,255,255,0.6)", borderRadius:"50%",
      transform:"translate(-50%,-50%) scale(0)", animation:"xzRipple 0.6s ease-out forwards",
      pointerEvents:"none",
    });
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 640);
  };

  return (
    <section ref={sectionRef} style={{
      background:"linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)",
      padding:"24px 0 72px",
      minHeight:"calc(100vh - 70px)",
      display:"flex", alignItems:"flex-start",
      position:"relative", overflow:"hidden",
    }}>

      {/* Atmospheric cascade */}
      <DarkCascade prefersReduced={prefersReduced}/>

      {/* Dot-grid texture */}
      <div aria-hidden="true" style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.025) 1px,transparent 1px)",
        backgroundSize:"30px 30px", zIndex:0,
      }}/>

      {/* ── Depth radial layers (create 3D spatial feel) ── */}
      {/* Primary warm bloom behind card area */}
      <div aria-hidden="true" style={{
        position:"absolute", top:"-10%", right:"-5%",
        width:700, height:700, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(201,136,58,0.17) 0%,rgba(204,120,92,0.09) 40%,transparent 70%)",
        filter:"blur(90px)",
        animation: prefersReduced?"none":"xzOrb1 22s ease-in-out infinite alternate",
        pointerEvents:"none", zIndex:0,
      }}/>
      {/* Coral warmth — left text side */}
      {!isMobile && <div aria-hidden="true" style={{
        position:"absolute", bottom:"5%", left:"-3%",
        width:420, height:420, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(204,120,92,0.12) 0%,transparent 70%)",
        filter:"blur(70px)",
        animation: prefersReduced?"none":"xzOrb2 28s ease-in-out infinite alternate",
        pointerEvents:"none", zIndex:0,
      }}/>}
      {/* Purple depth accent — center */}
      {!isMobile && <div aria-hidden="true" style={{
        position:"absolute", top:"38%", right:"28%",
        width:300, height:300, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)",
        filter:"blur(60px)",
        animation: prefersReduced?"none":"xzOrb3 18s ease-in-out infinite alternate",
        pointerEvents:"none", zIndex:0,
      }}/>}

      {/* ── Orbit rings (desktop only) ── */}
      {!isMobile && !prefersReduced && <OrbitRings/>}

      {/* ── Floating diamond particles (desktop only) ── */}
      {!isMobile && !prefersReduced && <FloatingDiamonds/>}

      {/* ── Diagonal light rays ── */}
      {[0,1,2].map(i => (
        <div key={i} aria-hidden="true" style={{
          position:"absolute",
          width:"260%", height: i===0?"2px":"1px",
          background:`linear-gradient(90deg,transparent 0%,rgba(201,136,58,${i===0?0.10:0.07}) 30%,rgba(201,136,58,${i===0?0.16:0.11}) 50%,rgba(201,136,58,${i===0?0.10:0.07}) 70%,transparent 100%)`,
          top:`${20+i*26}%`, left:"-80%",
          transform:"rotate(-13deg)",
          animation: prefersReduced?"none":`xzRayDrift ${12+i*5}s ease-in-out ${i*2.8}s infinite alternate`,
          pointerEvents:"none", zIndex:0,
        }}/>
      ))}

      <div className="container" style={{ position:"relative", zIndex:1 }}>
        <div className="row g-5 align-items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="col-lg-6">

            {/* Badge */}
            <div style={{
              display:"inline-flex", alignItems:"center", gap:10,
              background:"rgba(201,136,58,0.10)",
              border:"1.5px solid rgba(201,136,58,0.28)",
              borderRadius:9999, padding:"7px 16px 7px 10px", marginBottom:36,
              boxShadow:"0 2px 12px rgba(100,60,20,0.22)",
              animation: prefersReduced?"none":"xzFadeUp 0.5s ease 0.05s both",
            }}>
              <span style={{ position:"relative", width:8, height:8, flexShrink:0 }}>
                <span style={{ position:"absolute", inset:0, borderRadius:"50%", background:OG, animation: prefersReduced?"none":"xzBadgePing 1.8s ease-in-out infinite" }}/>
                <span style={{ position:"absolute", inset:0, borderRadius:"50%", background:C2 }}/>
              </span>
              <span style={{ fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.10em", textTransform:"uppercase", color:"rgba(255,255,255,0.82)" }}>
                Enterprise AI Platform
              </span>
              <span style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.06em", color:"#ffffff", background:C2, borderRadius:100, padding:"2px 8px", lineHeight:1.6 }}>
                V2.0
              </span>
            </div>

            {/* Heading */}
            <h1 style={{ marginBottom:0, lineHeight:1.0 }}>
              <span style={{
                display:"block",
                fontFamily:"'Cormorant Garamond',Garamond,serif",
                fontWeight:400, fontSize:"clamp(36px,4.2vw,56px)",
                color:"rgba(255,255,255,0.42)", letterSpacing:"-0.01em",
                lineHeight:1.1, marginBottom:2,
                animation: prefersReduced?"none":"xzSlideBlur 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both",
              }}>
                The Future of
              </span>

              {/* Per-letter animated "Enterprise AI" */}
              <span style={{
                display:"block",
                fontFamily:"'Cormorant Garamond',Garamond,serif",
                fontWeight:700, fontStyle:"italic",
                fontSize:"clamp(50px,7.5vw,96px)",
                color:C2,
                letterSpacing:"-0.03em", lineHeight:0.92, marginBottom:8,
                minHeight:"1em",
                animation: prefersReduced?"none":"xzHeadingGlow 5s ease-in-out 3s infinite",
              }}>
                {FULL_TEXT.split("").map((char,i) => (
                  <span key={i} style={{
                    display:"inline-block",
                    animation: prefersReduced?"none":"xzLetterIn 0.55s cubic-bezier(0.22,1,0.36,1) both",
                    animationDelay:`${0.35+i*0.045}s`,
                  }}>
                    {char===" "?" ":char}
                  </span>
                ))}
              </span>

              <span style={{
                display:"block",
                fontFamily:"'Cormorant Garamond',Garamond,serif",
                fontWeight:400, fontSize:"clamp(24px,3.2vw,44px)",
                color:"rgba(255,255,255,0.90)", letterSpacing:"-0.015em", lineHeight:1.14,
                animation: prefersReduced?"none":"xzFadeUp 0.65s ease 0.8s both",
              }}>
                is here —{" "}
                <em style={{ color:OG, fontStyle:"italic" }}>built for yours.</em>
              </span>
            </h1>

            {/* Cycling services */}
            <div style={{
              display:"flex", alignItems:"center", gap:8, flexWrap:"wrap",
              marginTop:28, marginBottom:24,
              animation: prefersReduced?"none":"xzFadeIn 0.5s ease 1.0s both",
            }}>
              <span style={{ fontFamily:"'Inter',sans-serif", fontSize:14, fontWeight:500, color:"rgba(255,255,255,0.42)", whiteSpace:"nowrap" }}>Delivering:</span>
              <span style={{
                fontFamily:"'Inter',sans-serif", fontSize:14, fontWeight:600, color:C2,
                opacity: fadeIn?1:0, transition:"opacity 0.3s ease",
                minWidth:"min(230px,55vw)", display:"inline-block",
              }}>
                {CYCLE_WORDS[wordIdx]}
              </span>
              <span aria-hidden="true" style={{
                width:2, height:17, background:C2,
                display:"inline-block", borderRadius:1, flexShrink:0,
                animation:"xzCursor 1s step-end infinite",
              }}/>
            </div>

            {/* Description */}
            <p style={{
              fontFamily:"'Inter',sans-serif", fontSize:16, lineHeight:1.68,
              color:"rgba(255,255,255,0.58)", maxWidth:500, marginBottom:40,
              animation: prefersReduced?"none":"xzFadeUp 0.5s ease 1.1s both",
            }}>
              XERXEZ delivers intelligent ERP, DevSecOps pipelines, and cloud
              infrastructure that transform how enterprises operate at scale.
            </p>

            {/* CTAs */}
            <div style={{
              display:"flex", alignItems:"center", gap:14, flexWrap:"wrap",
              animation: prefersReduced?"none":"xzFadeUp 0.5s ease 1.25s both",
            }}>
              {/* Primary */}
              <Link
                to="/contact"
                ref={btnRef}
                onClick={onBtnClick}
                className="xz-btn-shimmer"
                style={{
                  display:"inline-flex", alignItems:"center", gap:8,
                  background:C2, color:"#ffffff",
                  fontFamily:"'Inter',sans-serif", fontSize:14, fontWeight:500, lineHeight:1,
                  padding:"13px 24px", borderRadius:8,
                  textDecoration:"none", position:"relative", overflow:"hidden",
                  transition:"background 150ms ease,transform 0.15s ease",
                  boxShadow:"0 4px 0 rgba(140,60,30,0.45),0 6px 22px rgba(204,120,92,0.32)",
                  cursor:"pointer",
                }}
                onMouseOver={e => { e.currentTarget.style.background="#a9583e"; e.currentTarget.style.transform="translateY(-1px)"; }}
                onMouseOut={ e => { e.currentTarget.style.background=C2;        e.currentTarget.style.transform="translateY(0)"; }}
              >
                <span style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:8 }}>
                  Get Started
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <path d="M2 6.5h9M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </Link>

              {/* Secondary */}
              <Link
                to="/service"
                style={{
                  display:"inline-flex", alignItems:"center", gap:8,
                  background:"rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.90)",
                  fontFamily:"'Inter',sans-serif", fontSize:14, fontWeight:500, lineHeight:1,
                  padding:"13px 24px", borderRadius:8,
                  border:"1px solid rgba(255,255,255,0.18)", textDecoration:"none",
                  position:"relative",
                  transition:"border-color 150ms ease,background 150ms ease,transform 0.15s ease",
                  cursor:"pointer",
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor="rgba(201,136,58,0.50)";
                  e.currentTarget.style.background="rgba(201,136,58,0.12)";
                  e.currentTarget.style.transform="translateY(-1px)";
                  const line = e.currentTarget.querySelector(".xz-uline") as HTMLElement|null;
                  if (line) line.style.transform="scaleX(1)";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor="rgba(255,255,255,0.18)";
                  e.currentTarget.style.background="rgba(255,255,255,0.07)";
                  e.currentTarget.style.transform="translateY(0)";
                  const line = e.currentTarget.querySelector(".xz-uline") as HTMLElement|null;
                  if (line) line.style.transform="scaleX(0)";
                }}
              >
                Explore Services
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                  <path d="M2 6.5h9M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="xz-uline" style={{
                  position:"absolute", bottom:7, left:24, right:40, height:1,
                  background:C2, borderRadius:1,
                  transform:"scaleX(0)", transformOrigin:"left",
                  transition:"transform 0.32s cubic-bezier(0.22,1,0.36,1)",
                }}/>
              </Link>
            </div>

            {/* Trust metrics */}
            <div style={{
              display:"flex", alignItems:"center", gap:0,
              marginTop:40, flexWrap:"wrap",
              animation: prefersReduced?"none":"xzFadeUp 0.5s ease 1.4s both",
            }}>
              {[
                { val:"120+",  label:"Enterprise clients" },
                { val:"15+",   label:"Countries served"  },
                { val:"99.8%", label:"Platform uptime"   },
                { val:"5 yrs", label:"In operation"      },
              ].map((m,i) => (
                <div key={m.label} style={{
                  display:"flex", flexDirection:"column", gap:2,
                  padding:"0 20px",
                  borderLeft: i>0?"1px solid rgba(255,255,255,0.10)":"none",
                }}>
                  <span style={{ fontFamily:"'Cormorant Garamond',Garamond,serif", fontSize:22, fontWeight:700, color:"rgba(255,255,255,0.92)", lineHeight:1, letterSpacing:"-0.02em" }}>{m.val}</span>
                  <span style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:500, color:"rgba(255,255,255,0.38)", letterSpacing:"0.04em", textTransform:"uppercase", lineHeight:1 }}>{m.label}</span>
                </div>
              ))}
            </div>

            {/* Scroll indicator */}
            <div style={{
              display:"flex", alignItems:"center", gap:10, marginTop:36,
              opacity: scrolled?0:0.42, transition:"opacity 0.4s ease",
              pointerEvents:"none",
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"
                style={{ animation: prefersReduced?"none":"xzBounce 1.6s ease-in-out infinite" }}>
                <path d="M10 3v14M3.5 10.5l6.5 6.5 6.5-6.5" stroke="rgba(255,255,255,0.60)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily:"'Inter',sans-serif", fontSize:9, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.45)" }}>SCROLL</span>
            </div>
          </div>

          {/* ── RIGHT COLUMN: RADAI Network ── */}
          <div className="col-lg-6 d-none d-lg-flex align-items-start justify-content-end" style={{ paddingTop:60, paddingRight:48 }}>
            <RADAIVisualization prefersReduced={prefersReduced}/>
          </div>

        </div>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        .xz-hero-paused *, .xz-hero-paused *::before, .xz-hero-paused *::after { animation-play-state: paused !important; }
        @keyframes xzBadgePing { 0%{transform:scale(1);opacity:0.8} 70%{transform:scale(2.4);opacity:0} 100%{transform:scale(1);opacity:0} }
        @keyframes xzCursor { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes xzBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(7px)} }
        @keyframes xzRipple { 0%{transform:translate(-50%,-50%) scale(0);opacity:1} 100%{transform:translate(-50%,-50%) scale(45);opacity:0} }
        @keyframes xzFadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes xzFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes xzSlideBlur {
          from{opacity:0;transform:translateX(-28px);filter:blur(10px)}
          to{opacity:1;transform:translateX(0);filter:blur(0)}
        }
        @keyframes xzLetterIn {
          from{opacity:0;transform:translateY(22px);filter:blur(5px)}
          to{opacity:1;transform:translateY(0);filter:blur(0)}
        }
        @keyframes xzCardSlideRight {
          from{opacity:0;transform:translateX(40px)}
          to{opacity:1;transform:translateX(0)}
        }
        @keyframes xzLivePulse {
          0%,100%{box-shadow:0 0 7px #4ade80,0 0 14px rgba(74,222,128,.45)}
          50%{box-shadow:0 0 3px #4ade80,0 0 5px rgba(74,222,128,.15)}
        }
        @keyframes xzRayDrift {
          from{transform:rotate(-13deg) translateY(0px)}
          to{transform:rotate(-13deg) translateY(32px)}
        }
        @keyframes xzCardFloat {
          0%  {transform:translateY(0px) rotate(0deg)}
          35% {transform:translateY(-11px) rotate(-0.3deg)}
          65% {transform:translateY(-6px) rotate(0.2deg)}
          100%{transform:translateY(-4px) rotate(0.1deg)}
        }
        @keyframes xzOrb1 {
          from{transform:translate(0,0) scale(1)}
          to{transform:translate(-38px,48px) scale(1.12)}
        }
        @keyframes xzOrb2 {
          from{transform:translate(0,0) scale(1)}
          to{transform:translate(46px,-36px) scale(0.92)}
        }
        @keyframes xzOrb3 {
          from{transform:translate(0,0) scale(1)}
          to{transform:translate(28px,32px) scale(1.1)}
        }
        /* "Enterprise AI" coral glow — more dramatic on dark bg */
        @keyframes xzHeadingGlow {
          0%,100%{text-shadow:none}
          50%{text-shadow:0 0 50px rgba(204,120,92,0.50),0 0 100px rgba(204,120,92,0.25),0 0 200px rgba(204,120,92,0.10)}
        }
        /* Orbit rings */
        @keyframes xzRingRotate {
          from{transform:rotate(0deg)}
          to{transform:rotate(360deg)}
        }
        /* Diamond particle float */
        @keyframes xzDiamondFloat {
          0%,100%{transform:rotate(45deg) translateY(0);opacity:1}
          50%{transform:rotate(45deg) translateY(-14px);opacity:0.6}
        }
        /* Shimmer on primary CTA */
        .xz-btn-shimmer::before {
          content:'';
          position:absolute;top:0;left:0;right:0;bottom:0;
          background:linear-gradient(105deg,transparent 38%,rgba(255,255,255,0.26) 50%,transparent 62%);
          transform:translateX(-100%) skewX(-15deg);
          animation:xzShimmer 3.5s ease-in-out 1.5s infinite;
        }
        @keyframes xzShimmer {
          0%{transform:translateX(-100%) skewX(-15deg)}
          30%,100%{transform:translateX(220%) skewX(-15deg)}
        }
        /* Cascade keyframes */
        @keyframes xzCreamScrollA {
          from{transform:translateY(0)}
          to{transform:translateY(-50%)}
        }
        @keyframes xzCreamScrollB {
          from{transform:translateY(-12%)}
          to{transform:translateY(-62%)}
        }
        @media (max-width:767px) {
          .xz-cream-cascade-b{display:none!important}
        }
        @media (prefers-reduced-motion:reduce) {
          *{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important}
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
