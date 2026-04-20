import React from "react";

export default function Footer() {
  return (
    <footer className="py-20 bg-zinc-950 flex flex-col items-center justify-center text-center px-6">
      <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-primary font-bold mb-12 italic" data-testid="text-footer-closing">
        "Some cars are made.<br />The Ambassador was born."
      </h2>
      
      <div className="flex gap-8 mb-12">
        {/* Social placeholders */}
        {['History', 'Legacy', 'Archive', 'Tribute'].map(link => (
          <a key={link} href="#" className="font-sans text-sm tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">
            {link}
          </a>
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground/50 font-sans tracking-wider" data-testid="text-footer-copyright">
        © {new Date().getFullYear()} A TRIBUTE TO THE KING OF INDIAN ROADS.
      </p>
    </footer>
  );
}
