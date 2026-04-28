"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Draggable from "gsap/Draggable";
import ScrollTrigger from "gsap/ScrollTrigger";
import { motion } from "motion/react";

const essentials = [
  {
    label: "Notebook",
    description: "Loose sketches, project notes, and the first version of ideas before they turn real.",
  },
  {
    label: "Match Day",
    description: "The soccer rhythm: pressure, teamwork, and the energy that keeps Footy4Hope moving.",
  },
  {
    label: "Studio",
    description: "A small workspace for design experiments, code sessions, and visual direction.",
  },
  {
    label: "Playlist",
    description: "The background layer for long builds, late edits, and staying locked in.",
  },
  {
    label: "Camera Roll",
    description: "Snapshots, references, and moments that shape the feeling of the collage.",
  },
  {
    label: "Archive",
    description: "Old versions, saved fragments, and proof that every polished thing had drafts.",
  },
];

const tags = [
  "Raised $5,000",
  "Co-Founder",
  "Cancer Fundraiser",
  "Youth Soccer Tournament",
];

const projects = ["Footy4Hope", "Footy4Hope"];

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

function RollingText({ children }: { children: string }) {
  return (
    <span className="roll-text roll-text-hover" aria-label={children}>
      <span className="roll-track" aria-hidden="true">
        <span>{children}</span>
        <span>{children}</span>
      </span>
    </span>
  );
}

function LoadRollingText({ children }: { children: string }) {
  return (
    <span className="roll-text" aria-label={children}>
      <motion.span
        className="roll-track"
        aria-hidden="true"
        initial={{ y: "0%" }}
        animate={{ y: "-50%" }}
        transition={{ duration: 0.95, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
      >
        <span>{children}</span>
        <span>{children}</span>
      </motion.span>
    </span>
  );
}

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const navPillRef = useRef<HTMLSpanElement>(null);
  const essentialsRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    gsap.registerPlugin(Draggable, ScrollTrigger);

    const ctx = gsap.context(() => {
      const navLinks = gsap.utils.toArray<HTMLElement>(".portfolio-nav a");

      gsap.set(".reveal", {
        autoAlpha: 0,
        y: 20,
        filter: "blur(8px)",
      });
      gsap.set(".section-rule", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(navPillRef.current, { autoAlpha: 0, scale: 0.92 });
      gsap.set(navRef.current, {
        autoAlpha: 0,
        width: 36,
        pointerEvents: "none",
      });
      gsap.set(navLinks, { autoAlpha: 0, y: -2 });

      const navRevealTimeline = gsap
        .timeline({
          paused: true,
          defaults: { ease: "power3.out" },
          onStart: () => {
            gsap.set(navRef.current, { pointerEvents: "none" });
          },
          onComplete: () => {
            gsap.set(navRef.current, { pointerEvents: "auto" });
          },
          onReverseComplete: () => {
            gsap.set(navRef.current, { pointerEvents: "none" });
            gsap.set(navPillRef.current, { autoAlpha: 0, scale: 0.92 });
          },
        })
        .to(navRef.current, {
          autoAlpha: 1,
          duration: 0.1,
          ease: "none",
        })
        .to(navRef.current, {
          width: () => Math.min(window.innerWidth - 48, 812),
          duration: 0.42,
          ease: "expo.out",
        })
        .to(
          navLinks,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.18,
            stagger: 0.035,
            ease: "power2.out",
          },
          "-=0.16",
        );

      ScrollTrigger.create({
        trigger: pageRef.current,
        start: "top -90px",
        onEnter: () => navRevealTimeline.play(),
        onLeaveBack: () => navRevealTimeline.reverse(),
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(".reveal", {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          stagger: 0.075,
        })
        .to(
          ".section-rule",
          {
            scaleX: 1,
            duration: 1.1,
            stagger: 0.18,
          },
          "-=0.8",
        );

      const cards = tileRefs.current.filter(Boolean) as HTMLDivElement[];
      let activeCardZ = 9001;
      const liftCard = (card: HTMLDivElement) => {
        activeCardZ = Math.min(activeCardZ + 1, 9900);
        gsap.set(card, { zIndex: activeCardZ });
      };
      const hoverCard = (event: MouseEvent) => {
        const card = event.currentTarget as HTMLDivElement;

        liftCard(card);
      };
      const pressCard = (event: MouseEvent) => {
        liftCard(event.currentTarget as HTMLDivElement);
      };

      cards.forEach((card) => {
        card.addEventListener("mousedown", pressCard);
        card.addEventListener("mouseenter", hoverCard);
      });

      Draggable.create(cards, {
        type: "x,y",
        bounds: pageRef.current,
        inertia: false,
        edgeResistance: 0.82,
        cursor: "grab",
        activeCursor: "grabbing",
        zIndexBoost: false,
        onPress() {
          liftCard(this.target as HTMLDivElement);
        },
      });

      return () => {
        cards.forEach((card) => {
          card.removeEventListener("mousedown", pressCard);
          card.removeEventListener("mouseenter", hoverCard);
        });
      };
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const moveNavPill = (target: HTMLAnchorElement) => {
    const nav = navRef.current;
    const pill = navPillRef.current;

    if (!nav || !pill) {
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    gsap.killTweensOf(pill);
    gsap.to(pill, {
      x: targetRect.left - navRect.left,
      y: targetRect.top - navRect.top,
      width: targetRect.width,
      height: targetRect.height,
      autoAlpha: 1,
      scale: 1,
      duration: 0.48,
      ease: "expo.out",
      overwrite: true,
    });
  };

  const hideNavPill = () => {
    const pill = navPillRef.current;

    if (!pill) {
      return;
    }

    gsap.killTweensOf(pill);
    gsap.to(pill, {
      autoAlpha: 0,
      scale: 0.96,
      duration: 0.24,
      ease: "power2.out",
      overwrite: true,
    });
  };

  return (
    <main ref={pageRef} className="portfolio-shell">
      <nav
        ref={navRef}
        className="portfolio-nav"
        aria-label="Main navigation"
        onMouseLeave={hideNavPill}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            hideNavPill();
          }
        }}
      >
        <span ref={navPillRef} className="nav-hover-pill" aria-hidden="true" />
        {navItems.map((item) => (
          <a
            href={item.href}
            key={item.href}
            onFocus={(event) => moveNavPill(event.currentTarget)}
            onMouseEnter={(event) => moveNavPill(event.currentTarget)}
          >
            <span className="nav-label">
              <RollingText>{item.label}</RollingText>
            </span>
          </a>
        ))}
      </nav>

      <section id="home" className="hero-section">
        <div className="hero-grid">
          <div className="hero-title-row reveal">
            <h1 className="hero-title">Yahya Ikram</h1>
            <p className="hero-kicker">
              Aspiring Engineer
              <span className="hero-slash">/</span>
              <span className="hero-student">High School Student</span>
            </p>
          </div>
          <p className="hero-copy reveal">
            Positioned on Lake Ontario&apos;s northwestern shore, Toronto
            functions as a major economic and transportation centre. Ongoing
            construction, economic and transportation centre. Ongoing
            construction.
          </p>
        </div>
      </section>

      <section className="content-section essentials-section" aria-label="My essentials">
        <div className="section-heading reveal">
          <h2>
            <LoadRollingText>My Essentials</LoadRollingText>
          </h2>
          <div className="section-rule" />
        </div>

        <div ref={essentialsRef} className="essentials-board reveal">
          {essentials.map((item, index) => (
            <div
              ref={(node) => {
                tileRefs.current[index] = node;
              }}
              className={`essential-card essential-card-${index + 1}`}
              key={item.label}
            >
              <motion.div
                className="essential-card-inner"
                whileHover={{ scale: 1.035 }}
                whileTap={{ scale: 0.985 }}
                transition={{ type: "spring", stiffness: 340, damping: 26 }}
              >
                <span>{item.label}</span>
              </motion.div>
              <p className="essential-card-tooltip">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="content-section project-section">
        <div className="section-heading reveal">
          <h2>
            <LoadRollingText>My Work/Initiatives</LoadRollingText>
          </h2>
          <div className="section-rule" />
        </div>

        {projects.map((project, projectIndex) => (
          <article className="project-card" key={`${project}-${projectIndex}`}>
            <div className="project-intro reveal">
              <h3>{project}</h3>
            </div>

            <div className="project-details reveal">
              <div className="tag-list" aria-label="Project tags">
                {tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <p className="project-copy">
                Positioned on Lake Ontario&apos;s northwestern shore, Toronto
                functions as a major economic and transportation centre. Ongoing
                construction, economic and transportation centre. Ongoing
                construction, Positioned
              </p>
            </div>

            <div
              className="project-media reveal"
              aria-label={`${project} media placeholder`}
            />

            <div className="project-links reveal">
              <a href="https://footy4hope.ca" target="_blank" rel="noreferrer">
                <RollingText>Learn More....</RollingText>
              </a>
              <a href="https://footy4hope.ca" target="_blank" rel="noreferrer">
                <RollingText>Footy4Hope.ca</RollingText>
              </a>
              <a href="https://www.instagram.com/footy4hope" target="_blank" rel="noreferrer">
                <RollingText>@footy4hope</RollingText>
              </a>
            </div>
          </article>
        ))}
      </section>

      <footer id="contact" className="site-footer reveal">
        <p>Yahya Ikram</p>
        <div>
          <a href="mailto:yahya@example.com">
            <RollingText>yahya@example.com</RollingText>
          </a>
          <a href="#home">
            <RollingText>Back to top</RollingText>
          </a>
        </div>
      </footer>
    </main>
  );
}
