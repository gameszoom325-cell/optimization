import { useEffect, useRef } from "react";
import { ScrollProgressBar } from "./effects/smoothScroll.js";
import CursorSpotlight from "./components/CursorSpotlight.jsx";
import MagneticButton from "./components/MagneticButton.jsx";
import TiltCard from "./components/TiltCard.jsx";
import TextScramble from "./components/TextScramble.jsx";
import ScrollReveal from "./components/ScrollReveal.jsx";
import AmbientParticles from "./components/AmbientParticles.jsx";

const projects = [
  {
    number: "01",
    type: "AI / GIS CONCEPT",
    name: "LANDWATCH",
    description: "An AI-powered land acquisition monitoring concept for spotting signals, visualizing risk, and supporting better-informed decisions.",
    tags: ["MACHINE LEARNING", "GIS", "SIH"],
    art: "landwatch"
  },
  {
    number: "02",
    type: "PERSONAL UNIVERSE",
    name: "KNOXXZONE",
    description: "An evolving home on the internet. Experiments in building a more personal kind of digital space.",
    tags: ["INTERACTIVE", "WEB"],
    art: "knoxxzone",
    href: "https://knoxxed1ts-website.vercel.app/"
  },
  {
    number: "03",
    type: "GAME WORLDS",
    name: "BLOCK BY BLOCK",
    description: "Server ideas, plugins, and custom touches for player-shaped worlds.",
    tags: ["MINECRAFT", "COMMUNITY"],
    art: "blocks"
  }
];

const tickerItems = ["KNOXXED1TS", "ANIME EDITOR", "AMV", "MOTION"];

function Marquee() {
  const repeatedItems = [...tickerItems, ...tickerItems];
  return (
    <div className="marquee-shell" aria-label="KNOXXED1TS, anime editor, AMV, motion">
      <div className="marquee-track" aria-hidden="true">
        {repeatedItems.map((item, index) => <span className="marquee-item" key={`${item}-${index}`}>{item}</span>)}
      </div>
    </div>
  );
}

function ProjectArt({ kind }) {
  return (
    <div className={`project-art project-art-${kind}`} aria-hidden="true">
      {kind === "landwatch" && <>
        <span className="map-orbit orbit-one" />
        <span className="map-orbit orbit-two" />
        <span className="map-orbit orbit-three" />
        <span className="map-signal" />
        <span className="art-coordinate coordinate-one">LAT 13.0827 / GIS NODE</span>
        <span className="art-coordinate coordinate-two">SIGNAL / ACTIVE</span>
      </>}
      {kind === "knoxxzone" && <>
        <span className="planet" />
        <span className="planet-orbit orbit-one" />
        <span className="planet-orbit orbit-two" />
        <span className="planet-moon" />
      </>}
      {kind === "blocks" && <div className="block-grid">{Array.from({ length: 25 }, (_, index) => <i key={index} />)}</div>}
      <span className="art-scanline" />
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <TiltCard
      as={project.href ? "a" : "article"}
      href={project.href}
      target={project.href ? "_blank" : undefined}
      rel={project.href ? "noreferrer" : undefined}
      className={`project-card project-card-${project.art}`}
      aria-label={project.href ? `${project.name}: ${project.description}` : undefined}
    >
      <div className="project-card-top">
        <span>{project.number} / {project.type}</span>
        <span className="project-arrow" aria-hidden="true">↗</span>
      </div>
      <ProjectArt kind={project.art} />
      <div className="project-copy">
        <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
      </div>
    </TiltCard>
  );
}

function SectionLabel({ number, children }) {
  return <p className="section-label"><span>{number}</span><i />{children}</p>;
}

export default function App() {
  const scrollFrame = useRef(0);

  useEffect(() => {
    const nav = document.querySelector(".site-nav");
    const updateScroll = () => {
      scrollFrame.current = 0;
      nav?.classList.toggle("site-nav-scrolled", window.scrollY > 36);
    };
    const scheduleUpdate = () => {
      if (!scrollFrame.current) scrollFrame.current = requestAnimationFrame(updateScroll);
    };
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    updateScroll();
    return () => {
      if (scrollFrame.current) cancelAnimationFrame(scrollFrame.current);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return (
    <>
      <ScrollProgressBar />
      <CursorSpotlight />
      <AmbientParticles />
      <header className="site-nav">
        <a className="brand-mark" href="#top" aria-label="KNOXXED1TS home"><span>K</span><b>KNOXXED1TS<sup>®</sup></b></a>
        <nav aria-label="Main navigation">
          <a href="#about">ABOUT</a>
          <a href="#work">SELECTED WORK</a>
          <a href="#contact">CONNECT</a>
        </nav>
        <span className="nav-status"><i /> OPEN TO BUILD</span>
      </header>
      <main id="top">
        <section className="hero-section">
          <div className="hero-mesh" aria-hidden="true" />
          <div className="page-shell hero-inner">
            <ScrollReveal className="hero-copy" delay={0}>
              <SectionLabel number="01">DIGITAL LIFEFORM / CHENNAI, INDIA</SectionLabel>
              <TextScramble as="h1" className="hero-heading" text="IDEAS INTO ORBITS." trigger="load" />
              <p className="hero-description">I’m Ayush — an AI/ML student and developer exploring how intelligent software can make everyday life more interesting.</p>
              <div className="hero-actions">
                <MagneticButton href="#work" className="action-button action-primary">EXPLORE SELECTED WORK <span>↗</span></MagneticButton>
                <MagneticButton href="#contact" className="action-button">START A TRANSMISSION <span>↗</span></MagneticButton>
              </div>
            </ScrollReveal>
            <div className="hero-coordinate" aria-hidden="true">SIGNAL / 13.0827° N<br />SYSTEM ONLINE / 2026</div>
            <a className="hero-scroll" href="#about"><span>SCROLL TO EXPLORE</span><i /></a>
          </div>
        </section>
        <Marquee />
        <section id="about" className="content-section page-shell">
          <ScrollReveal className="section-heading">
            <SectionLabel number="02">A HUMAN BEHIND THE INTERFACE</SectionLabel>
            <h2>Curious by default.<br /><span>Builder by choice.</span></h2>
            <p>A little code, a lot of curiosity, and a strong belief that the internet can still feel like magic.</p>
          </ScrollReveal>
          <div className="about-panel">
            <div className="about-signal" aria-hidden="true"><div className="signal-ring"><i /><i /></div><span>IDENTITY SIGNAL / LOCKED</span></div>
            <div className="about-copy">
              <p className="about-lead">First-year CSE student at <span>SRMIST</span>, exploring how intelligent software can make everyday life more interesting.</p>
              <p>I move between machine learning notebooks, full-stack interfaces and Minecraft worlds. I like learning by shipping: take an idea, make a prototype, find the rough edges, make it better.</p>
              <MagneticButton href="#contact" className="text-link">GET IN TOUCH <span>↗</span></MagneticButton>
            </div>
          </div>
        </section>
        <section id="work" className="content-section work-section">
          <div className="page-shell">
            <ScrollReveal className="section-heading work-heading">
              <SectionLabel number="03">THINGS I'VE MADE / MAKING</SectionLabel>
              <TextScramble as="h2" className="section-title" text="Proof of curiosity." trigger="hover" />
              <p>A few experiments in turning “what if?” into something you can actually click.</p>
            </ScrollReveal>
            <div className="project-grid">{projects.map((project) => <ProjectCard project={project} key={project.name} />)}</div>
          </div>
        </section>
        <section id="about-skills" className="ticker-band">
          <p>ALWAYS BUILDING / ALWAYS LEARNING</p>
          <div className="ticker-rule" />
          <p>ARTIFICIAL INTELLIGENCE · CREATIVE ENGINEERING · GAME WORLDS</p>
        </section>
        <section id="contact" className="contact-section page-shell">
          <ScrollReveal className="contact-panel">
            <SectionLabel number="04">OPEN CHANNEL / SAY HELLO</SectionLabel>
            <TextScramble as="h2" text="Got a good “what if?”" trigger="hover" />
            <p>Have an idea, a collaboration, or a Minecraft world in need of imagination? Let’s make the next experiment matter.</p>
            <MagneticButton href="mailto:090109ayush@gmail.com" className="action-button action-primary">SEND A TRANSMISSION <span>↗</span></MagneticButton>
          </ScrollReveal>
        </section>
      </main>
      <footer className="site-footer page-shell"><span>© {new Date().getFullYear()} AYUSH SINGH / KNOXXED1TS®</span><a href="#top">RETURN TO ORBIT ↑</a></footer>
    </>
  );
}
