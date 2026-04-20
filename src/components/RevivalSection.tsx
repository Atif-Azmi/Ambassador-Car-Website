import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function RevivalSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-40 bg-background relative flex items-center justify-center px-6">
      <div ref={textRef} className="max-w-3xl text-center">
        <h2 className="font-serif text-4xl md:text-6xl text-foreground mb-8 leading-tight" data-testid="text-revival-headline">
          An Interrupted Silence
        </h2>
        <p className="font-sans text-xl text-muted-foreground leading-relaxed mb-12" data-testid="text-revival-body">
          In 2014, the final Ambassador rolled off the line in Uttarpara. The brand was later acquired by Peugeot, sparking whispers of an electric revival. But whether it returns to the roads or remains in memory, the Ambassador achieved something few objects do: it became immortal.
        </p>
        <div className="w-24 h-[1px] bg-primary mx-auto" />
      </div>
    </section>
  );
}
