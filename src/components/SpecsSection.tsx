import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SpecsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".spec-row",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 bg-zinc-950 border-y border-white/5">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-sans text-sm uppercase tracking-[0.2em] text-primary mb-16 text-center" data-testid="text-section-title-specs">Heritage Specifications</h2>
        
        <div className="space-y-6 font-serif">
          {[
            { label: "Production Run", value: "1958 – 2014" },
            { label: "Engine (Classic)", value: "1.5L BMC B-Series I4" },
            { label: "Transmission", value: "4-Speed Manual (Column Shift)" },
            { label: "Layout", value: "Front-engine, Rear-wheel drive" },
            { label: "Kerb Weight", value: "1,100 kg (approx)" },
            { label: "Top Speed", value: "A stately, unhurried pace." },
          ].map((spec, i) => (
            <div key={i} className="spec-row flex flex-col md:flex-row md:items-baseline justify-between border-b border-white/10 pb-6 group hover:border-primary/50 transition-colors duration-500">
              <span className="text-xl text-muted-foreground group-hover:text-foreground transition-colors duration-500 mb-2 md:mb-0">{spec.label}</span>
              <span className="text-2xl text-foreground text-right">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
