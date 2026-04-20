import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function OriginStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      textRefs.current.forEach((el, index) => {
        if (!el) return;
        
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play reverse play reverse",
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-12 lg:px-24 bg-background relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-[1px] bg-primary" />
          <h2 className="font-sans text-sm uppercase tracking-[0.2em] text-primary" data-testid="text-section-title-origin">Origin Story</h2>
        </div>

        <div className="space-y-24 font-serif text-2xl md:text-4xl lg:text-5xl leading-snug text-foreground/90">
          <p ref={el => textRefs.current[0] = el} data-testid="text-origin-p1">
            Born in 1958 from the lineage of the British Morris Oxford, it was reimagined for a young republic.
          </p>
          
          <p ref={el => textRefs.current[1] = el} data-testid="text-origin-p2">
            Hindustan Motors forged it in steel, but India gave it a soul.
          </p>

          <p ref={el => textRefs.current[2] = el} className="text-primary italic" data-testid="text-origin-p3">
            It wasn't designed to be fast. It was designed to endure.
          </p>
        </div>
      </div>
    </section>
  );
}
