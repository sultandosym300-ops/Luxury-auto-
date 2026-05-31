import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-24 pb-12">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-2">
            <Link href="/" className="font-serif text-3xl tracking-[0.2em] text-primary uppercase block mb-6">
              Blackline
            </Link>
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
              Where obsessive craftsmanship meets automotive perfection. The premier destination for luxury and exotic vehicle detailing, paint correction, and protection.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg text-foreground mb-6">Services</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/quote" className="hover:text-primary transition-colors">Paint Protection Film</Link></li>
              <li><Link href="/quote" className="hover:text-primary transition-colors">Ceramic Coating</Link></li>
              <li><Link href="/quote" className="hover:text-primary transition-colors">Paint Correction</Link></li>
              <li><Link href="/quote" className="hover:text-primary transition-colors">Full Detail</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-lg text-foreground mb-6">Studio</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>100 Prestige Way</li>
              <li>Los Angeles, CA 90001</li>
              <li className="pt-2">concierge@blacklinestudio.com</li>
              <li>(310) 555-0199</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Blackline Auto Studio. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
