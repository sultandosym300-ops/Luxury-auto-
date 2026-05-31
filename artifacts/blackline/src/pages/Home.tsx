import { motion } from "framer-motion";
import { Link } from "wouter";

import heroImg from "@/assets/hero.png";
import port1 from "@/assets/portfolio-1.png";
import port2 from "@/assets/portfolio-2.png";
import port3 from "@/assets/portfolio-3.png";
import port4 from "@/assets/portfolio-4.png";
import ctaImg from "@/assets/cta.png";

const services = [
  {
    name: "Paint Protection Film (PPF)",
    desc: "Full-body armor against chips, scratches, and road debris.",
    benefits: ["Self-healing technology", "10-year warranty", "Invisible finish"],
    price: "$2,500",
    duration: "3-5 days"
  },
  {
    name: "Ceramic Coating",
    desc: "Permanent hydrophobic protection with mirror-like gloss.",
    benefits: ["Extreme gloss", "Chemical resistance", "UV protection"],
    price: "$1,200",
    duration: "1-2 days"
  },
  {
    name: "Paint Correction",
    desc: "Multi-stage swirl removal and paint restoration to showroom perfection.",
    benefits: ["Removes 95%+ of defects", "Restores clarity", "Prepares for coating"],
    price: "$800",
    duration: "1-3 days"
  },
  {
    name: "Window Tint",
    desc: "Premium automotive film for privacy, UV rejection, and heat reduction.",
    benefits: ["99% UV rejection", "Heat reduction", "Enhanced privacy"],
    price: "$350",
    duration: "4-6 hours"
  },
  {
    name: "Full Detail",
    desc: "A complete interior/exterior restoration. Every surface.",
    benefits: ["Deep clean exterior", "Interior revitalization", "Engine bay detail"],
    price: "$450",
    duration: "6-8 hours"
  },
  {
    name: "Interior Restoration",
    desc: "Complete interior revitalization — leather conditioning, steam cleaning, panel restoration.",
    benefits: ["Leather treatment", "Odor removal", "Stain extraction"],
    price: "$600",
    duration: "1 day"
  }
];

const portfolio = [
  { img: port1, name: "McLaren 720S", service: "Full Body PPF", year: "2023" },
  { img: port2, name: "Lamborghini Huracan", service: "Ceramic Coating", year: "2024" },
  { img: port3, name: "Rolls Royce Ghost", service: "Interior Restoration", year: "2022" },
  { img: port4, name: "Ferrari Roma", service: "Paint Correction", year: "2023" },
];

export default function Home() {
  return (
    <div className="bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Hero Section */}
      <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="Porsche 911 Detail" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-6 text-center mt-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-primary tracking-[0.3em] text-sm md:text-base font-medium mb-6 uppercase"
          >
            Obsessive Craftsmanship
          </motion.h2>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-white tracking-widest mb-10 leading-none"
          >
            BLACKLINE
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/quote" className="bg-primary text-primary-foreground px-10 py-4 text-sm font-medium tracking-wider hover:bg-white hover:text-background transition-colors w-full sm:w-auto">
              REQUEST A QUOTE
            </Link>
            <a href="#portfolio" className="border border-border bg-transparent text-white px-10 py-4 text-sm font-medium tracking-wider hover:border-primary hover:text-primary transition-colors w-full sm:w-auto">
              VIEW PORTFOLIO
            </a>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-12 left-0 right-0 z-10"
        >
          <div className="container mx-auto px-6 grid grid-cols-3 gap-4 border-t border-border/50 pt-8 max-w-4xl">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-serif text-white mb-1">500+</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Vehicles Protected</p>
            </div>
            <div className="text-center border-l border-r border-border/50">
              <p className="text-2xl md:text-3xl font-serif text-white mb-1">12</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Years of Mastery</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-serif text-white mb-1">100%</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Satisfaction</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 md:py-48 px-6 border-b border-border">
        <div className="container mx-auto">
          <div className="mb-24 md:flex justify-between items-end">
            <div className="max-w-2xl">
              <h2 className="text-primary tracking-[0.2em] text-sm uppercase mb-4">Our Services</h2>
              <h3 className="font-serif text-4xl md:text-6xl text-white">Engineered Beauty.</h3>
            </div>
            <p className="text-muted-foreground max-w-md mt-6 md:mt-0 text-sm md:text-base">
              We do not compromise. Every service is executed with absolute precision, utilizing the world's most advanced chemical and physical protection systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <motion.div 
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-card border border-border p-10 hover:border-primary/50 transition-colors group cursor-pointer"
              >
                <h4 className="font-serif text-2xl text-white mb-4 group-hover:text-primary transition-colors">{service.name}</h4>
                <p className="text-muted-foreground text-sm mb-8 h-10">{service.desc}</p>
                <ul className="space-y-3 mb-10 border-t border-border pt-6">
                  {service.benefits.map((benefit, i) => (
                    <li key={i} className="text-sm text-foreground flex items-center gap-3">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-end mt-auto">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Starting At</p>
                    <p className="font-serif text-xl text-white">{service.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Duration</p>
                    <p className="text-sm text-white">{service.duration}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-32 md:py-48 px-6 bg-[#0a0a0a]">
        <div className="container mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-primary tracking-[0.2em] text-sm uppercase mb-4">The Gallery</h2>
            <h3 className="font-serif text-4xl md:text-6xl text-white">Museum Quality.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {portfolio.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group relative overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden bg-card">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent">
                  <p className="text-primary text-xs tracking-widest uppercase mb-2">{item.service} &bull; {item.year}</p>
                  <h4 className="font-serif text-3xl text-white">{item.name}</h4>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <Link href="/booking" className="inline-block border-b border-primary text-primary pb-1 tracking-widest uppercase text-sm hover:text-white hover:border-white transition-colors">
              Book Your Vehicle
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 md:py-48 px-6 border-y border-border relative overflow-hidden">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-primary tracking-[0.2em] text-sm uppercase mb-4">The Standard</h2>
              <h3 className="font-serif text-4xl md:text-6xl text-white mb-10 leading-tight">Precision that takes 72 hours.</h3>
              <p className="text-muted-foreground mb-8 text-lg font-light leading-relaxed">
                We do not rush. We do not cut corners. A true paint correction and protection process is a labor-intensive operation that requires specialized environments, lighting, and decades of combined experience.
              </p>
              <div className="space-y-6">
                <div className="border-l border-primary pl-6">
                  <h5 className="text-white font-serif text-xl mb-2">XPEL & 3M Certified</h5>
                  <p className="text-muted-foreground text-sm">Exclusive access to the highest tier of automotive films, applied by factory-trained artisans.</p>
                </div>
                <div className="border-l border-primary pl-6">
                  <h5 className="text-white font-serif text-xl mb-2">Concierge Logistics</h5>
                  <p className="text-muted-foreground text-sm">Enclosed, insured transport available for pickup and delivery to your residence or facility.</p>
                </div>
                <div className="border-l border-primary pl-6">
                  <h5 className="text-white font-serif text-xl mb-2">Climate Controlled Studio</h5>
                  <p className="text-muted-foreground text-sm">ISO-certified clean room environments ensure flawless ceramic and film applications without contamination.</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              {/* Abstract luxury shapes or just large typography */}
              <div className="w-full h-full min-h-[500px] border border-border p-12 flex flex-col justify-between">
                <div className="text-8xl font-serif text-border opacity-50">&ldquo;</div>
                <p className="text-2xl font-serif text-white leading-relaxed italic relative z-10">
                  When I purchased my GT3 RS, I didn't want just anyone touching the paint. Blackline treated the car with more respect than the dealership did. The PPF is completely invisible.
                </p>
                <div className="mt-8">
                  <p className="text-primary tracking-widest uppercase text-sm mb-1">David K.</p>
                  <p className="text-muted-foreground text-xs">2024 Porsche 911 GT3 RS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote CTA */}
      <section className="relative py-48 px-6 flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <img src={ctaImg} alt="Luxury Detailing" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-background/80"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="font-serif text-5xl md:text-7xl text-white mb-8">Your vehicle deserves perfection.</h2>
          <p className="text-muted-foreground text-lg mb-12">Configure your custom protection package and receive an instant estimate.</p>
          <Link href="/quote" className="bg-primary text-primary-foreground px-12 py-5 text-sm font-medium tracking-widest hover:bg-white hover:text-background transition-all inline-block">
            BUILD YOUR PACKAGE
          </Link>
        </div>
      </section>
    </div>
  );
}
