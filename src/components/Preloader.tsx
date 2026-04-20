import { useEffect, useRef } from "react";
import gsap from "gsap";
import ThreePreloaderBg from "./ThreePreloaderBg";

interface PreloaderProps {
  onComplete: () => void;
}

const TITLE = "AMBASSADOR";

export default function Preloader({ onComplete }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const brandRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const chars = charRefs.current.filter(Boolean);

      gsap.set(chars, { y: "110%", opacity: 0 });
      gsap.set([brandRef.current, yearRef.current, skipRef.current], { opacity: 0 });
      gsap.set(counterRef.current, { opacity: 0 });
      gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: "left center" });

      const counter = { val: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(rootRef.current, {
            opacity: 0,
            duration: 1.2,
            ease: "power2.inOut",
            onComplete,
          });
        },
      });

      // Line draws in
      tl.fromTo(lineRef.current,
        { scaleY: 0, transformOrigin: "top center" },
        { scaleY: 1, duration: 2, ease: "expo.inOut" }, 0)
        .to(glowRef.current, { opacity: 1, duration: 0.8 }, 0.4)
        // Brand + counter fade in
        .to(brandRef.current, { opacity: 1, duration: 0.6 }, 0.6)
        .to(counterRef.current, { opacity: 1, duration: 0.4 }, 0.7)
        // Counter ticks up
        .to(counter, {
          val: 100,
          duration: 2.2,
          ease: "power1.inOut",
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(Math.round(counter.val)).padStart(3, "0");
            }
          },
        }, 0.5)
        .to(progressBarRef.current, { scaleX: 1, duration: 2.2, ease: "power1.inOut" }, 0.5)
        // Characters animate in staggered
        .to(chars, { y: "0%", opacity: 1, stagger: 0.055, duration: 0.8, ease: "power3.out" }, 1.2)
        .to(yearRef.current, { opacity: 1, duration: 0.6, ease: "power2.out" }, 1.9)
        .to(skipRef.current, { opacity: 1, duration: 0.4 }, 2.0)
        // Hold
        .to({}, { duration: 1.4 });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handleSkip = () => {
    gsap.to(rootRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete,
    });
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden"
      data-testid="preloader"
    >
      {/* Three.js particle universe + wireframe behind preloader */}
      <ThreePreloaderBg />
      {/* Decorative top/bottom lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      {/* Vertical center line */}
      <div className="absolute inset-x-0 top-0 bottom-0 flex justify-center pointer-events-none">
        <div className="relative w-px h-full">
          <div
            ref={lineRef}
            className="absolute inset-0 w-full h-full"
            style={{
              background: "linear-gradient(to bottom, transparent 0%, rgba(201,162,39,0.2) 10%, rgba(201,162,39,0.7) 50%, rgba(201,162,39,0.2) 90%, transparent 100%)",
            }}
          />
          <div
            ref={glowRef}
            className="absolute inset-0 opacity-0"
            style={{
              background: "rgba(201,162,39,0.25)",
              filter: "blur(6px)",
              width: "7px",
              left: "-3px",
            }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center select-none">
        <div
          ref={brandRef}
          className="font-sans text-[9px] tracking-[0.65em] text-amber-500/40 uppercase mb-10"
          data-testid="text-preloader-brand"
        >
          Hindustan Motors &nbsp;·&nbsp; Est. 1942
        </div>

        {/* Character-split headline */}
        <h1
          className="font-serif leading-none"
          style={{ fontSize: "clamp(3rem, 11vw, 8.5rem)", letterSpacing: "0.04em" }}
          data-testid="text-preloader-title"
        >
          {TITLE.split("").map((char, i) => (
            <span key={i} className="char-wrap">
              <span
                ref={(el) => { charRefs.current[i] = el; }}
                className="char-inner text-white"
              >
                {char}
              </span>
            </span>
          ))}
        </h1>

        <div
          ref={yearRef}
          className="font-sans text-[9px] tracking-[0.55em] text-amber-500/35 uppercase mt-9"
          data-testid="text-preloader-year"
        >
          1958 &nbsp;—&nbsp; 2014 &nbsp;·&nbsp; King of Indian Roads
        </div>
      </div>

      {/* Bottom loading bar */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 w-48">
        <div
          ref={counterRef}
          className="font-sans text-[10px] tracking-[0.4em] text-white/20"
          data-testid="text-preloader-counter"
        >
          000
        </div>
        <div className="w-full h-px bg-white/8 overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full bg-amber-500/60"
          />
        </div>
      </div>

      {/* Skip button */}
      <button
        ref={skipRef}
        onClick={handleSkip}
        className="absolute bottom-10 right-10 flex items-center gap-3 text-white/25 hover:text-amber-400/70 text-[9px] font-sans tracking-[0.35em] uppercase transition-colors duration-400 opacity-0"
        data-testid="button-skip-intro"
      >
        Skip intro
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-current">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4H6.5M6.5 4L4.5 2M6.5 4L4.5 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </span>
      </button>

      {/* Top left corner label */}
      <div className="absolute top-8 left-10 font-sans text-[8px] tracking-[0.4em] text-white/15 uppercase" aria-hidden="true">
        A Tribute
      </div>
      <div className="absolute top-8 right-10 font-sans text-[8px] tracking-[0.4em] text-white/15 uppercase" aria-hidden="true">
        {new Date().getFullYear()}
      </div>
    </div>
  );
}
