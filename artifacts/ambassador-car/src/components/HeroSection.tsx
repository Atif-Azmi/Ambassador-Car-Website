import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroImg from "../assets/hero-ambassador.png";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          pin: true,
        }
      });

      tl.to(overlayRef.current, { opacity: 0.8, duration: 1 }, 0)
        .to(imageRef.current, { scale: 1.1, filter: "blur(2px)", duration: 1 }, 0)
        .to(headlineRef.current, { y: -50, opacity: 0, duration: 0.8 }, 0.2)
        .to(badgeRef.current, { y: -30, opacity: 0, duration: 0.8 }, 0.1);

      // Initial load animation
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out", delay: 0.8 }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-background flex flex-col items-center justify-center text-foreground">
      <div className="absolute inset-0 z-0">
        <img
          ref={imageRef}
          src={heroImg}
          alt="Ambassador Car Silhouette"
          className="w-full h-full object-cover object-center"
          data-testid="img-hero-ambassador"
        />
        <div ref={overlayRef} className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background z-10" />
      </div>

      <div className="relative z-20 flex flex-col items-center text-center px-6 mt-20">
        <div ref={badgeRef} className="mb-6 tracking-[0.3em] text-primary uppercase text-sm font-semibold" data-testid="text-hero-badge">
          Hindustan Motors
        </div>
        <h1
          ref={headlineRef}
          className="font-serif text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight text-foreground leading-tight max-w-5xl"
          data-testid="text-hero-headline"
        >
          The King of<br />Indian Roads
        </h1>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce">
        <span className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Scroll to explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
}
