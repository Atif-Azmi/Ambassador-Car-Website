import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dashboardImg from "../assets/dashboard.png";

export default function DesignSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".design-detail",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: elementsRef.current,
            start: "top 80%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-12 lg:px-24 bg-background relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="w-12 h-[1px] bg-primary" />
          <h2 className="font-sans text-sm uppercase tracking-[0.2em] text-primary" data-testid="text-section-title-design">The Design</h2>
          <div className="w-12 h-[1px] bg-primary" />
        </div>

        <div className="text-center mb-24">
          <h3 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-6" data-testid="text-design-headline">
            Unmistakably Curves
          </h3>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground font-sans" data-testid="text-design-subhead">
            Defying the sharp angles of modern aerodynamics, the Ambassador embraced a bulbous, maternal geometry that felt protective and grand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12" ref={elementsRef}>
          <div className="design-detail flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center text-primary text-2xl font-serif">I</div>
            <h4 className="text-xl font-serif text-foreground">The Chrome Grille</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">A confident, toothy smile that commanded respect on chaotic streets, reflecting the world back at itself.</p>
          </div>
          
          <div className="design-detail flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center text-primary text-2xl font-serif">II</div>
            <h4 className="text-xl font-serif text-foreground">The Flowing Fenders</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">Generous, sculpted curves that created a wide, stable stance, anchoring the vehicle to the ground like a monument.</p>
          </div>

          <div className="design-detail flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center text-primary text-2xl font-serif">III</div>
            <h4 className="text-xl font-serif text-foreground">The Sofa Backseat</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">Not bucket seats, but a sprawling lounge designed for sprawling families, diplomats, and endless conversations.</p>
          </div>
        </div>

        <div className="mt-32 w-full h-[50vh] relative rounded-xl overflow-hidden shadow-[0_0_40px_rgba(201,162,39,0.1)]">
           <img 
            src={dashboardImg} 
            alt="Ambassador Dashboard" 
            className="w-full h-full object-cover"
            data-testid="img-dashboard"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-center">
            <p className="font-serif text-2xl text-foreground italic">"Tactile, mechanical, honest."</p>
          </div>
        </div>
      </div>
    </section>
  );
}
