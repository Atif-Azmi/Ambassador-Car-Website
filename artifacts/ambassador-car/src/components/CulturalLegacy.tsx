import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import taxiImg from "../assets/kolkata-taxi.png";

export default function CulturalLegacy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        }
      });

      tl.fromTo(imageRef.current, { y: -50 }, { y: 50, ease: "none" }, 0);
      
      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: -50 },
        { 
          opacity: 1, x: 0, duration: 1.5, ease: "power2.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 75%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden bg-zinc-950">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={textRef} className="order-2 lg:order-1 z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-primary" />
            <h2 className="font-sans text-sm uppercase tracking-[0.2em] text-primary" data-testid="text-section-title-cultural">Cultural Legacy</h2>
          </div>
          
          <h3 className="font-serif text-4xl lg:text-6xl mb-8 leading-tight text-foreground" data-testid="text-cultural-headline">
            The Chariot of the Nation
          </h3>
          
          <div className="space-y-6 text-lg text-muted-foreground font-sans leading-relaxed">
            <p data-testid="text-cultural-p1">
              For half a century, it was the definitive symbol of state power. White Ambassadors with red beacons ferried prime ministers, bureaucrats, and diplomats—a visual shorthand for authority.
            </p>
            <p data-testid="text-cultural-p2">
              Yet, it was equally the car of the people. As the iconic yellow taxis of Kolkata, it pulsed through the arteries of the city, carrying generations of stories, heartbreak, and triumph in its spacious, sofa-like backseats.
            </p>
          </div>
          
          <blockquote className="mt-12 border-l-2 border-primary pl-6 font-serif text-2xl italic text-foreground/80" data-testid="text-cultural-quote">
            "You didn't just drive an Ambassador. You inhabited it."
          </blockquote>
        </div>

        <div className="order-1 lg:order-2 h-[60vh] lg:h-[80vh] relative rounded-lg overflow-hidden shadow-2xl">
          <img 
            ref={imageRef}
            src={taxiImg} 
            alt="Kolkata Yellow Taxi Ambassador" 
            className="w-full h-[120%] object-cover object-center absolute -top-[10%]"
            data-testid="img-kolkata-taxi"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>
    </section>
  );
}
