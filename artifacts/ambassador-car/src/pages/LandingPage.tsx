import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Preloader from "../components/Preloader";
import Grain from "../components/Grain";
import CustomCursor from "../components/CustomCursor";
import ThreePersistentBg from "../components/ThreePersistentBg";
import heroImg from "../assets/hero-ambassador.png";
import taxiImg from "../assets/kolkata-taxi.png";
import dashboardImg from "../assets/dashboard.png";

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = ["THE CAR", "THE BIRTH", "THE LEGACY", "THE FORM", "THE NUMBERS", "THE SILENCE"];
const MARQUEE_TEXT = "AMBASSADOR · KING OF INDIAN ROADS · 1958 · HINDUSTAN MOTORS · LEGEND · IMMORTAL · ";

// ─── Marquee strip ────────────────────────────────────────────────────────────
function MarqueeStrip({ reverse = false, dim = false, fast = false }: { reverse?: boolean; dim?: boolean; fast?: boolean }) {
  const text = Array(6).fill(MARQUEE_TEXT).join("");
  return (
    <div className="overflow-hidden w-full border-y border-white/[0.04] select-none" style={{ background: "rgba(0,0,0,0.97)" }}>
      <div className={reverse ? "animate-marquee-rev" : "animate-marquee"} style={fast ? { animationDuration: "14s" } : {}}>
        {[text, text].map((t, i) => (
          <span key={i} className="font-sans uppercase whitespace-nowrap" style={{
            fontSize: "9.5px", letterSpacing: "0.38em",
            color: dim ? "rgba(201,162,39,0.1)" : "rgba(255,255,255,0.07)",
            padding: "12px 0", display: "inline-block",
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Ambient dot grid ─────────────────────────────────────────────────────────
function DotGrid({ amber = false }: { amber?: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{
      backgroundImage: `radial-gradient(circle, ${amber ? "rgba(201,162,39,0.07)" : "rgba(255,255,255,0.035)"} 1px, transparent 1px)`,
      backgroundSize: "44px 44px",
      maskImage: "radial-gradient(ellipse 75% 75% at 50% 50%, black 0%, transparent 100%)",
    }} />
  );
}

// ─── Scanline overlay ─────────────────────────────────────────────────────────
function Scanlines() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{
      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
      zIndex: 2,
    }} />
  );
}

// ─── Floating ambient numbers ──────────────────────────────────────────────────
function FloatingNums() {
  const nums = ["1958", "4M+", "56yr", "1942", "2014", "I.N.D."];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {nums.map((n, i) => (
        <span key={i} className="floating-num font-serif text-amber-500/[0.04] absolute select-none" style={{
          fontSize: `${2 + i * 0.8}rem`,
          left: `${8 + i * 15}%`,
          top: `${10 + ((i * 37) % 80)}%`,
          animationDelay: `${i * 0.9}s`,
          animationDuration: `${6 + i * 1.2}s`,
        }}>{n}</span>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const c1Ref = useRef<HTMLDivElement>(null);
  const c2Ref = useRef<HTMLDivElement>(null);
  const c3Ref = useRef<HTMLDivElement>(null);
  const c4Ref = useRef<HTMLDivElement>(null);
  const c5Ref = useRef<HTMLDivElement>(null);
  const c6Ref = useRef<HTMLDivElement>(null);

  const handlePreloaderDone = useCallback(() => setPreloaderDone(true), []);

  useEffect(() => {
    if (!preloaderDone) return;
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {

      ScrollTrigger.create({
        start: "top top", end: "bottom bottom",
        onUpdate: (self) => {
          if (progressLineRef.current) progressLineRef.current.style.height = `${self.progress * 100}%`;
          setCurrentChapter(Math.min(CHAPTERS.length - 1, Math.floor(self.progress * CHAPTERS.length)));
        },
      });

      // ══ CH 1: THE CAR ═══════════════════════════════════════════════════════
      {
        const c1 = c1Ref.current!;
        const img    = c1.querySelector<HTMLElement>(".c1-img");
        const vig    = c1.querySelector<HTMLElement>(".c1-vig");
        const eye    = c1.querySelector<HTMLElement>(".c1-eye");
        const chars  = c1.querySelectorAll<HTMLElement>(".c1-char");
        const sub    = c1.querySelector<HTMLElement>(".c1-sub");
        const hint   = c1.querySelector<HTMLElement>(".c1-hint");
        const strips = c1.querySelectorAll<HTMLElement>(".c1-strip");

        // entrance
        const intro = gsap.timeline({ delay: 0.3 });
        intro
          .fromTo(strips, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, stagger: 0.08, duration: 0.9, ease: "expo.out" })
          .fromTo(eye,   { opacity: 0, y: 20, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out" }, "-=0.3")
          .fromTo(chars, { y: "115%", opacity: 0, rotateX: 45 }, { y: "0%", opacity: 1, rotateX: 0, stagger: 0.038, duration: 1.1, ease: "expo.out" }, "-=0.5")
          .fromTo(sub,   { opacity: 0, letterSpacing: "1.2em" }, { opacity: 1, letterSpacing: "0.5em", duration: 1.2, ease: "power3.out" }, "-=0.4")
          .fromTo(hint,  { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");

        // scroll exit
        gsap.timeline({ scrollTrigger: { trigger: c1, start: "top top", end: "+=190%", pin: true, scrub: 1.4 } })
          .to(img,   { scale: 1.18, ease: "none" }, 0)
          .to(vig,   { opacity: 0.95, ease: "none" }, 0)
          .to(chars, { y: "-115%", opacity: 0, rotateX: -45, stagger: 0.02, ease: "power2.in" }, 0.15)
          .to([eye, sub, hint], { opacity: 0, y: -30, ease: "power2.in" }, 0.18)
          .to(strips, { scaleX: 0, transformOrigin: "right", stagger: 0.05, ease: "expo.in" }, 0.3);
      }

      // ══ CH 2: THE BIRTH ═════════════════════════════════════════════════════
      {
        const c2 = c2Ref.current!;
        const bigY   = c2.querySelector<HTMLElement>(".c2-bigyear");
        const ghost  = c2.querySelector<HTMLElement>(".c2-ghost");
        const rule   = c2.querySelector<HTMLElement>(".c2-rule");
        const lines  = c2.querySelectorAll<HTMLElement>(".c2-line");
        const accent = c2.querySelector<HTMLElement>(".c2-accent");
        const stamp  = c2.querySelector<HTMLElement>(".c2-stamp");

        gsap.timeline({ scrollTrigger: { trigger: c2, start: "top top", end: "+=250%", pin: true, scrub: 1.6 } })
          .fromTo(ghost, { xPercent: 60, opacity: 0, filter: "blur(20px)" }, { xPercent: 0, opacity: 1, filter: "blur(0px)", ease: "expo.out" }, 0)
          .fromTo(bigY,  { xPercent: 55, opacity: 0, scale: 1.1 }, { xPercent: 0, opacity: 1, scale: 1, ease: "expo.out" }, 0)
          .fromTo(stamp, { opacity: 0, scale: 0.6, rotation: -15 }, { opacity: 1, scale: 1, rotation: 0, ease: "back.out(2)" }, 0.1)
          .fromTo(rule,  { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, ease: "expo.out" }, 0.15)
          .fromTo(lines, { opacity: 0, y: 45, filter: "blur(4px)" }, { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.1, ease: "power3.out" }, 0.2)
          .fromTo(accent, { opacity: 0, x: -20 }, { opacity: 1, x: 0, ease: "power2.out" }, 0.5)
          .to(bigY,  { xPercent: -60, opacity: 0, filter: "blur(10px)", ease: "expo.in" }, 0.78)
          .to([...Array.from(lines), rule, accent, stamp], { opacity: 0, y: -20, ease: "power2.in" }, 0.8);
      }

      // ══ CH 3: THE LEGACY ════════════════════════════════════════════════════
      {
        const c3 = c3Ref.current!;
        const img     = c3.querySelector<HTMLElement>(".c3-img");
        const overlay = c3.querySelector<HTMLElement>(".c3-overlay");
        const qchars  = c3.querySelectorAll<HTMLElement>(".c3-qchar");
        const caption = c3.querySelector<HTMLElement>(".c3-caption");
        const bullets = c3.querySelectorAll<HTMLElement>(".c3-bullet");
        const stats   = c3.querySelectorAll<HTMLElement>(".c3-stat");
        const hline   = c3.querySelector<HTMLElement>(".c3-hline");

        gsap.timeline({ scrollTrigger: { trigger: c3, start: "top top", end: "+=250%", pin: true, scrub: 1.5 } })
          .fromTo(img,     { scale: 1.12, opacity: 0, filter: "brightness(0.4) saturate(0)" }, { scale: 1, opacity: 1, filter: "brightness(0.6) saturate(0.4)", ease: "power2.out" }, 0)
          .fromTo(overlay, { opacity: 0 }, { opacity: 1, ease: "none" }, 0)
          .fromTo(hline,   { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, ease: "expo.out" }, 0.08)
          .fromTo(qchars,  { y: "110%", opacity: 0 }, { y: "0%", opacity: 1, stagger: 0.009, ease: "expo.out" }, 0.1)
          .fromTo(caption, { opacity: 0, x: -20, filter: "blur(4px)" }, { opacity: 1, x: 0, filter: "blur(0px)", ease: "power3.out" }, 0.42)
          .fromTo(bullets, { opacity: 0, x: -14 }, { opacity: 1, x: 0, stagger: 0.06, ease: "power2.out" }, 0.52)
          .fromTo(stats,   { opacity: 0, y: 20, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, stagger: 0.08, ease: "back.out(2)" }, 0.65)
          .to([img, overlay, hline], { opacity: 0, ease: "power2.in" }, 0.83)
          .to([...Array.from(qchars), caption, ...Array.from(bullets), ...Array.from(stats)], { opacity: 0, y: -15, ease: "power2.in" }, 0.83);
      }

      // ══ CH 4: THE FORM (horizontal wipe + clip) ══════════════════════════════
      {
        const c4 = c4Ref.current!;
        const clip     = c4.querySelector<HTMLElement>(".c4-clip");
        const overlay  = c4.querySelector<HTMLElement>(".c4-overlay");
        const headline = c4.querySelector<HTMLElement>(".c4-headline");
        const sub      = c4.querySelector<HTMLElement>(".c4-sub");
        const details  = c4.querySelectorAll<HTMLElement>(".c4-detail");
        const scanH    = c4.querySelector<HTMLElement>(".c4-scan");

        gsap.timeline({ scrollTrigger: { trigger: c4, start: "top top", end: "+=220%", pin: true, scrub: 1.5 } })
          .fromTo(clip,    { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", ease: "expo.inOut" }, 0)
          .fromTo(scanH,   { y: "-100%" }, { y: "100%", ease: "none" }, 0)
          .fromTo(overlay, { opacity: 0 }, { opacity: 1, ease: "none" }, 0.1)
          .fromTo(headline, { opacity: 0, y: 40, clipPath: "inset(0 0 100% 0)" }, { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", ease: "power3.out" }, 0.28)
          .fromTo(sub,      { opacity: 0, filter: "blur(6px)" }, { opacity: 1, filter: "blur(0px)", ease: "power2.out" }, 0.44)
          .fromTo(details,  { opacity: 0, y: 25, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, stagger: 0.1, ease: "back.out(1.5)" }, 0.55)
          .to([headline, sub, ...Array.from(details), overlay], { opacity: 0, ease: "power2.in" }, 0.84);
      }

      // ══ CH 5: THE NUMBERS ════════════════════════════════════════════════════
      {
        const c5 = c5Ref.current!;
        const title = c5.querySelector<HTMLElement>(".c5-title");
        const rows  = c5.querySelectorAll<HTMLElement>(".c5-row");
        const lines = c5.querySelectorAll<HTMLElement>(".c5-line");
        const bar   = c5.querySelector<HTMLElement>(".c5-bar");

        gsap.timeline({ scrollTrigger: { trigger: c5, start: "top top", end: "+=220%", pin: true, scrub: 1.5 } })
          .fromTo(bar,   { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, ease: "expo.out" }, 0)
          .fromTo(title, { opacity: 0, x: -30, filter: "blur(8px)" }, { opacity: 1, x: 0, filter: "blur(0px)", ease: "power3.out" }, 0.05)
          .fromTo(lines, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, stagger: 0.06, ease: "expo.out" }, 0.08)
          .fromTo(rows,  { opacity: 0, x: -35, filter: "blur(4px)" }, { opacity: 1, x: 0, filter: "blur(0px)", stagger: 0.07, ease: "power3.out" }, 0.12)
          .to([title, ...Array.from(rows)], { opacity: 0, x: 20, ease: "power2.in" }, 0.84);
      }

      // ══ CH 6: THE SILENCE ════════════════════════════════════════════════════
      {
        const c6 = c6Ref.current!;
        const year   = c6.querySelector<HTMLElement>(".c6-year");
        const l1     = c6.querySelector<HTMLElement>(".c6-l1");
        const l2     = c6.querySelector<HTMLElement>(".c6-l2");
        const rule   = c6.querySelector<HTMLElement>(".c6-rule");
        const quote  = c6.querySelector<HTMLElement>(".c6-quote");
        const credit = c6.querySelector<HTMLElement>(".c6-credit");
        const creator = c6.querySelector<HTMLElement>(".c6-creator");

        gsap.timeline({ scrollTrigger: { trigger: c6, start: "top top", end: "+=240%", pin: true, scrub: 1.5 } })
          .fromTo(year,  { opacity: 0, xPercent: -15, filter: "blur(12px)" }, { opacity: 1, xPercent: 0, filter: "blur(0px)", ease: "power3.out" }, 0)
          .fromTo(l1,    { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: "power2.out" }, 0.18)
          .fromTo(l2,    { opacity: 0, y: 25 }, { opacity: 1, y: 0, ease: "power2.out" }, 0.3)
          .fromTo(rule,  { scaleX: 0, transformOrigin: "center" }, { scaleX: 1, ease: "expo.out" }, 0.5)
          .fromTo(quote, { opacity: 0, y: 20, filter: "blur(4px)" }, { opacity: 1, y: 0, filter: "blur(0px)", ease: "power3.out" }, 0.62)
          .fromTo(credit, { opacity: 0 }, { opacity: 1, ease: "power2.out" }, 0.8)
          .fromTo(creator, { opacity: 0, y: 12 }, { opacity: 1, y: 0, ease: "power2.out" }, 0.9);
      }

    }, mainRef);

    return () => ctx.revert();
  }, [preloaderDone]);

  const cn = String(currentChapter + 1).padStart(2, "0");
  const cl = CHAPTERS[currentChapter];

  return (
    <>
      {!preloaderDone && <Preloader onComplete={handlePreloaderDone} />}

      {/* Three.js persistent universe — fixed behind everything */}
      {preloaderDone && <ThreePersistentBg />}

      <Grain />
      <CustomCursor />

      {/* ── Fixed chrome ───────────────────────────────────────────────────── */}
      {preloaderDone && (
        <>
          {/* Amber progress line */}
          <div className="fixed left-0 top-0 w-[2px] h-full z-40 bg-white/[0.03]" aria-hidden>
            <div ref={progressLineRef} style={{
              height: "0%",
              background: "linear-gradient(to bottom, transparent, rgba(201,162,39,0.85), rgba(201,162,39,0.3))",
              transition: "height 0.06s linear",
              boxShadow: "3px 0 16px rgba(201,162,39,0.35)",
            }} />
          </div>
          {/* Side label */}
          <div className="fixed left-5 top-1/2 z-40 -translate-y-1/2 pointer-events-none" aria-hidden>
            <span className="block font-sans uppercase text-white/12" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: "7.5px", letterSpacing: "0.38em" }}>
              Hindustan Motors &nbsp;·&nbsp; Since 1958
            </span>
          </div>
          {/* Chapter counter */}
          <div className="fixed bottom-8 right-8 z-40 text-right pointer-events-none" aria-hidden>
            <span className="block font-sans text-white/45" style={{ fontSize: "9.5px", letterSpacing: "0.22em" }}>{cn} / {String(CHAPTERS.length).padStart(2, "0")}</span>
            <span className="block font-sans text-white/18 uppercase mt-1" style={{ fontSize: "7px", letterSpacing: "0.4em" }}>{cl}</span>
          </div>
          {/* Wordmark */}
          <div className="fixed top-8 left-10 z-40 pointer-events-none" aria-hidden>
            <span className="font-serif text-white/22 uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.3em" }}>Ambassador</span>
          </div>
        </>
      )}

      <main
        ref={mainRef}
        className="w-full bg-black text-white selection:bg-amber-500/20 overflow-x-hidden"
        style={{ opacity: preloaderDone ? 1 : 0, transition: "opacity 0.7s ease", position: "relative", zIndex: 1 }}
      >

        {/* ═══ CH 1: THE CAR ══════════════════════════════════════════════════ */}
        <div ref={c1Ref} className="relative h-screen w-full overflow-hidden" data-testid="section-hero">
          <img className="c1-img absolute inset-0 w-full h-full object-cover object-center" src={heroImg} alt="Ambassador" data-testid="img-hero" />
          <div className="c1-vig absolute inset-0" style={{ opacity: 0.3, background: "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.98) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.85) 100%)" }} />
          <Scanlines />
          <DotGrid />
          <FloatingNums />

          {/* Decorative horizontal accent strips */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none" aria-hidden>
            <div className="c1-strip h-px bg-gradient-to-r from-transparent via-amber-500/25 to-transparent mb-[12vh]" style={{ transform: "scaleX(0)" }} />
            <div className="c1-strip h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" style={{ transform: "scaleX(0)" }} />
            <div className="c1-strip h-px bg-gradient-to-r from-transparent via-amber-500/12 to-transparent mt-[12vh]" style={{ transform: "scaleX(0)" }} />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center" style={{ perspective: "1200px" }}>
            <div className="c1-eye font-sans uppercase text-amber-400/55 mb-8" style={{ fontSize: "8.5px", letterSpacing: "0.65em" }} data-testid="text-hero-eyebrow">
              Hindustan Motors &nbsp;—&nbsp; India &nbsp;—&nbsp; Est. 1942
            </div>
            <h1 className="font-serif leading-none mb-7" style={{ fontSize: "clamp(3rem, 11.5vw, 10rem)", transformStyle: "preserve-3d" }} data-testid="text-hero-headline">
              {"The King of".split("").map((ch, i) => (
                <span key={`a${i}`} className="char-wrap"><span className="c1-char char-inner text-white">{ch === " " ? "\u00A0" : ch}</span></span>
              ))}
              <br />
              {"Indian Roads".split("").map((ch, i) => (
                <span key={`b${i}`} className="char-wrap"><span className="c1-char char-inner text-amber-400">{ch === " " ? "\u00A0" : ch}</span></span>
              ))}
            </h1>
            <div className="c1-sub font-sans text-white/22 uppercase" style={{ fontSize: "9px", letterSpacing: "0.5em" }} data-testid="text-hero-year">
              1958 &nbsp;—&nbsp; 2014
            </div>
          </div>

          <div className="c1-hint absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
            <span className="font-sans text-white/18 uppercase" style={{ fontSize: "7.5px", letterSpacing: "0.5em" }}>Scroll</span>
            <div className="w-px h-10 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/60 to-transparent" style={{ animation: "float-up 1.9s ease-in-out infinite" }} />
            </div>
          </div>
        </div>

        <MarqueeStrip fast />

        {/* ═══ CH 2: THE BIRTH ════════════════════════════════════════════════ */}
        <div ref={c2Ref} className="relative h-screen w-full overflow-hidden bg-black flex flex-col justify-center px-[9vw]" data-testid="section-birth">
          <DotGrid amber />
          <Scanlines />

          {/* Ghost watermark — large */}
          <div className="c2-ghost absolute right-[-8vw] top-1/2 -translate-y-1/2 font-serif text-amber-500/[0.03] leading-none select-none pointer-events-none" style={{ fontSize: "clamp(10rem, 40vw, 30rem)", opacity: 0 }} aria-hidden>
            1958
          </div>
          {/* Big bold year overlay */}
          <div className="c2-bigyear absolute right-[2vw] top-1/2 -translate-y-1/2 font-serif leading-none select-none pointer-events-none" style={{ fontSize: "clamp(6rem, 20vw, 16rem)", opacity: 0, color: "rgba(201,162,39,0.055)" }} aria-hidden>
            1958
          </div>

          {/* Stamp */}
          <div className="c2-stamp absolute top-12 right-[10vw] font-sans text-amber-500/25 border border-amber-500/15 px-4 py-2 uppercase" style={{ fontSize: "8px", letterSpacing: "0.35em", opacity: 0, transform: "rotate(-4deg)" }} aria-hidden>
            Made in India
          </div>

          <div className="relative z-10 max-w-[640px]">
            <div className="font-sans text-amber-500/45 uppercase mb-7" style={{ fontSize: "8.5px", letterSpacing: "0.55em" }} data-testid="text-birth-label">
              Chapter 02 &mdash; The Birth
            </div>
            <div className="c2-rule h-px bg-gradient-to-r from-amber-500/40 via-white/10 to-transparent w-full mb-11" style={{ transform: "scaleX(0)" }} />
            <p className="c2-line font-serif text-white/90 mb-7 leading-snug" style={{ fontSize: "clamp(1.35rem, 2.9vw, 2.5rem)", opacity: 0 }} data-testid="text-birth-line1">
              Born from the lineage of the British Morris Oxford,
              reimagined for a newly independent republic.
            </p>
            <p className="c2-line font-serif text-white/38 mb-8 leading-snug" style={{ fontSize: "clamp(1rem, 2vw, 1.65rem)", opacity: 0 }} data-testid="text-birth-line2">
              Hindustan Motors took a canvas and made it Indian —
              wider seats, slower pace, immeasurable presence.
            </p>
            <p className="c2-accent font-sans text-amber-500/60 italic" style={{ fontSize: "11px", letterSpacing: "0.18em", opacity: 0 }} data-testid="text-birth-accent">
              "It wasn't designed to be fast. It was designed to endure."
            </p>
          </div>
        </div>

        <MarqueeStrip reverse dim />

        {/* ═══ CH 3: THE LEGACY ═══════════════════════════════════════════════ */}
        <div ref={c3Ref} className="relative h-screen w-full overflow-hidden" data-testid="section-legacy">
          <img className="c3-img absolute inset-0 w-full h-full object-cover" src={taxiImg} alt="Kolkata Ambassador taxis" style={{ opacity: 0 }} data-testid="img-taxi" />
          <div className="c3-overlay absolute inset-0" style={{ opacity: 0, background: "linear-gradient(120deg, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.72) 55%, rgba(0,0,0,0.12) 100%)" }} />
          <Scanlines />

          <div className="relative z-10 flex items-center h-full px-[8vw]">
            <div className="max-w-[500px]">
              <div className="font-sans text-amber-500/45 uppercase mb-9" style={{ fontSize: "8.5px", letterSpacing: "0.55em" }} data-testid="text-legacy-label">
                Chapter 03 &mdash; The Legacy
              </div>
              <div className="c3-hline h-px mb-8 bg-gradient-to-r from-amber-500/35 to-transparent" style={{ transform: "scaleX(0)" }} />

              <blockquote className="font-serif leading-tight text-white mb-9" style={{ fontSize: "clamp(1.6rem, 3.6vw, 2.9rem)" }} data-testid="text-legacy-quote">
                {"You didn't just drive".split("").map((ch, i) => (
                  <span key={`q0${i}`} className="char-wrap" style={{ lineHeight: 1.1 }}>
                    <span className="c3-qchar char-inner">{ch === " " ? "\u00A0" : ch}</span>
                  </span>
                ))}
                <br />
                {"an Ambassador.".split("").map((ch, i) => (
                  <span key={`q1${i}`} className="char-wrap" style={{ lineHeight: 1.1 }}>
                    <span className="c3-qchar char-inner">{ch === " " ? "\u00A0" : ch}</span>
                  </span>
                ))}
                <br />
                <span className="text-amber-400">
                  {"You inhabited it.".split("").map((ch, i) => (
                    <span key={`q2${i}`} className="char-wrap" style={{ lineHeight: 1.1 }}>
                      <span className="c3-qchar char-inner">{ch === " " ? "\u00A0" : ch}</span>
                    </span>
                  ))}
                </span>
              </blockquote>

              <p className="c3-caption font-sans text-white/30 leading-relaxed mb-9 max-w-xs" style={{ fontSize: "12.5px", opacity: 0 }} data-testid="text-legacy-caption">
                Half a century of prime ministers, Kolkata taxis, and family pilgrimages. A car that carried the weight of a nation without complaint.
              </p>

              <div className="flex flex-col gap-3 mb-10">
                {["Official car of the Indian government, 1958–2002", "Kolkata's yellow taxi fleet — soul of the city", "56 years of uninterrupted production"].map((b, i) => (
                  <div key={i} className="c3-bullet flex items-center gap-3" style={{ opacity: 0 }} data-testid={`text-legacy-bullet-${i}`}>
                    <div className="w-1 h-1 rounded-full bg-amber-500/55 flex-shrink-0" />
                    <span className="font-sans text-white/28" style={{ fontSize: "11px" }}>{b}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-10">
                {[{ n: "56", l: "Years" }, { n: "4M+", l: "Units" }, { n: "1", l: "Legend" }].map((s, i) => (
                  <div key={i} className="c3-stat" style={{ opacity: 0 }} data-testid={`text-legacy-stat-${i}`}>
                    <div className="font-serif text-amber-400 leading-none" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>{s.n}</div>
                    <div className="font-sans text-white/22 uppercase mt-1" style={{ fontSize: "7.5px", letterSpacing: "0.38em" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <MarqueeStrip />

        {/* ═══ CH 4: THE FORM ═════════════════════════════════════════════════ */}
        <div ref={c4Ref} className="relative h-screen w-full overflow-hidden" data-testid="section-form">
          <div className="c4-clip absolute inset-0 overflow-hidden" style={{ clipPath: "inset(0 100% 0 0)" }}>
            <img className="c4-img absolute inset-0 w-full h-full object-cover object-bottom" src={dashboardImg} alt="Ambassador dashboard" data-testid="img-dashboard" />
          </div>
          {/* Scan line sweep */}
          <div className="c4-scan absolute inset-x-0 h-1 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, rgba(201,162,39,0.35), transparent)", top: 0, zIndex: 3 }} />
          <div className="c4-overlay absolute inset-0" style={{ opacity: 0, background: "linear-gradient(to top, rgba(0,0,0,0.99) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.02) 100%)" }} />
          <Scanlines />

          <div className="relative z-10 flex flex-col justify-end h-full px-[8vw] pb-14">
            <div className="font-sans text-amber-500/45 uppercase mb-5" style={{ fontSize: "8.5px", letterSpacing: "0.55em" }} data-testid="text-form-label">
              Chapter 04 &mdash; The Form
            </div>
            <h2 className="c4-headline font-serif text-white leading-tight mb-5" style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)", clipPath: "inset(0 0 100% 0)", opacity: 0 }} data-testid="text-form-headline">
              Unmistakably,<br /><span className="text-amber-400">Curve upon Curve.</span>
            </h2>
            <p className="c4-sub font-sans text-white/28 max-w-md mb-10" style={{ fontSize: "12.5px", opacity: 0 }} data-testid="text-form-sub">
              Defying the sharp angles of the modern age — a bulbous, protective geometry that felt like shelter.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl">
              {[
                { n: "I",   t: "The Chrome Grille",    d: "A confident, toothy smile commanding respect on chaotic streets." },
                { n: "II",  t: "The Flowing Fenders",  d: "Generous curves anchoring it to the earth like a monument." },
                { n: "III", t: "The Sofa Backseat",    d: "Not bucket seats — a sprawling lounge for generations of stories." },
              ].map((d, i) => (
                <div key={i} className="c4-detail border-l border-amber-500/14 pl-4" style={{ opacity: 0 }} data-testid={`text-form-detail-${i}`}>
                  <div className="font-sans text-amber-500/38 uppercase mb-1" style={{ fontSize: "7.5px", letterSpacing: "0.45em" }}>{d.n}</div>
                  <div className="font-serif text-white/65 mb-1" style={{ fontSize: "12.5px" }}>{d.t}</div>
                  <div className="font-sans text-white/22 leading-relaxed" style={{ fontSize: "10.5px" }}>{d.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <MarqueeStrip reverse fast />

        {/* ═══ CH 5: THE NUMBERS ══════════════════════════════════════════════ */}
        <div ref={c5Ref} className="relative h-screen w-full overflow-hidden bg-black flex flex-col justify-center px-[9vw]" data-testid="section-numbers">
          <DotGrid amber />
          <Scanlines />
          <div className="absolute right-[5vw] top-1/2 -translate-y-1/2 font-serif text-white/[0.022] leading-none select-none pointer-events-none" style={{ fontSize: "clamp(10rem, 34vw, 26rem)" }} aria-hidden>A</div>
          {/* Left vertical accent bar */}
          <div className="c5-bar absolute left-[7.5vw] top-[15%] bottom-[15%] w-[1px]" style={{ background: "linear-gradient(to bottom, transparent, rgba(201,162,39,0.25), transparent)", transform: "scaleY(0)" }} />

          <div className="relative z-10 max-w-2xl w-full">
            <div className="c5-title font-sans text-amber-500/45 uppercase mb-11" style={{ fontSize: "8.5px", letterSpacing: "0.55em", opacity: 0 }} data-testid="text-numbers-label">
              Chapter 05 &mdash; The Numbers
            </div>
            {[
              { label: "Production Run",  value: "1958 – 2014" },
              { label: "Engine",          value: "1.5L BMC B-Series I4" },
              { label: "Transmission",    value: "4-Speed · Column Shift" },
              { label: "Drive",           value: "Front-engine, Rear-wheel" },
              { label: "Kerb Weight",     value: "≈ 1,100 kg" },
              { label: "Top Speed",       value: "Unhurried. Dignified." },
            ].map((s, i) => (
              <div key={i} className="relative">
                <div className="c5-line absolute bottom-0 left-0 right-0 h-px bg-white/[0.06]" style={{ transform: "scaleX(0)" }} />
                <div className="c5-row flex justify-between items-baseline py-[18px]" style={{ opacity: 0 }} data-testid={`text-spec-row-${i}`}>
                  <span className="font-sans text-white/22 uppercase" style={{ fontSize: "8.5px", letterSpacing: "0.3em" }}>{s.label}</span>
                  <span className="font-serif text-white/72" style={{ fontSize: "clamp(1rem, 1.9vw, 1.45rem)" }}>{s.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ CH 6: THE SILENCE ══════════════════════════════════════════════ */}
        <div ref={c6Ref} className="relative h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center px-6 text-center" data-testid="section-silence">
          <DotGrid />
          <Scanlines />

          {/* Glitching 2014 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
            <div className="relative" style={{ fontSize: "clamp(9rem, 37vw, 28rem)" }}>
              <span className="c6-year font-serif text-white/[0.04] leading-none block" style={{ opacity: 0 }}>2014</span>
              <span className="glitch-layer font-serif leading-none">2014</span>
              <span className="glitch-layer-2 font-serif leading-none">2014</span>
            </div>
          </div>

          <div className="relative z-10 max-w-[520px]">
            <div className="font-sans text-amber-500/45 uppercase mb-9" style={{ fontSize: "8.5px", letterSpacing: "0.55em" }} data-testid="text-silence-label">
              Chapter 06 &mdash; The Silence
            </div>
            <p className="c6-l1 font-serif text-white/85 leading-snug mb-5" style={{ fontSize: "clamp(1.35rem, 2.7vw, 2.2rem)", opacity: 0 }} data-testid="text-silence-line1">
              On May 24, 2014, the last Ambassador rolled off the line in Uttarpara.
            </p>
            <p className="c6-l2 font-sans text-white/28 leading-relaxed mb-12 max-w-sm mx-auto" style={{ fontSize: "12.5px", opacity: 0 }} data-testid="text-silence-line2">
              The brand was acquired by Peugeot in 2017. Whispers of an electric revival linger. Whether it returns or remains in memory — it already achieved something rare. It became immortal.
            </p>
            <div className="c6-rule h-px w-16 mx-auto mb-11" style={{ background: "linear-gradient(to right, transparent, rgba(201,162,39,0.65), transparent)", transform: "scaleX(0)" }} />
            <blockquote className="c6-quote font-serif italic text-amber-400 mb-16 leading-snug" style={{ fontSize: "clamp(1.15rem, 2.3vw, 1.85rem)", opacity: 0 }} data-testid="text-silence-quote">
              "Some cars are made.<br />The Ambassador was born."
            </blockquote>

            <div className="c6-credit mb-5" style={{ opacity: 0 }}>
              <div className="flex items-center gap-4 justify-center mb-5">
                <div className="h-px w-10 bg-white/8" />
                <div className="w-1 h-1 rounded-full bg-amber-500/35" />
                <div className="h-px w-10 bg-white/8" />
              </div>
              <p className="font-sans text-white/14 uppercase" style={{ fontSize: "7.5px", letterSpacing: "0.42em" }} data-testid="text-silence-credit">
                A Tribute to the King of Indian Roads &nbsp;·&nbsp; {new Date().getFullYear()}
              </p>
            </div>

            <div className="c6-creator" style={{ opacity: 0 }} data-testid="text-creator-credit">
              <div className="h-px w-full bg-white/[0.045] mb-5" />
              <p className="font-sans text-amber-500/38 uppercase" style={{ fontSize: "7.5px", letterSpacing: "0.38em" }}>Created by</p>
              <p className="font-serif text-white/50 mt-1" style={{ fontSize: "clamp(1rem, 1.9vw, 1.4rem)" }}>Atif Azmi</p>
              <a href="mailto:atifazmi2005@gmail.com" className="font-sans text-amber-500/28 hover:text-amber-400/60 transition-colors mt-1 inline-block" style={{ fontSize: "10px", letterSpacing: "0.12em" }} data-testid="link-creator-email">
                atifazmi2005@gmail.com
              </a>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}
