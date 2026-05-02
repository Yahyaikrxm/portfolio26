"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Draggable from "gsap/Draggable";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import { motion } from "motion/react";

const essentials = [
  {
    label: "MacBook",
    description: "The main workspace for builds, research, writing, and edits.",
    image: "/essentials/ESEIMG-MACBOOK.png",
  },
  {
    label: "Folder",
    description: "Saved references, drafts, assets, and ideas before they become finished work.",
    image: "/essentials/ESEIMG-FOLDER.png",
  },
  {
    label: "Headphones",
    description: "Focus mode for deep work, long edits, and late-night project sessions.",
    image: "/essentials/ESEIMG-HEADPHONE.png",
  },
  {
    label: "Figma",
    description: "A place for layouts, interface experiments, and visual direction.",
    image: "/essentials/ESEIMG-FIGMA.png",
  },
  {
    label: "Notion",
    description: "Notes, plans, task lists, and the structure behind the work.",
    image: "/essentials/ESEIMG-NOTION.png",
  },
  {
    label: "Notebook",
    description: "Sketches, project notes, and rough thinking before ideas turn real.",
    image: "/essentials/ESEIMG-NOTEBOOK.png",
  },
  {
    label: "Pen",
    description: "Quick annotations, page margins, and the first version of most ideas.",
    image: "/essentials/ESEIMG-PEN.png",
  },
  {
    label: "Calculator",
    description: "Numbers, problem solving, and the practical side of engineering work.",
    image: "/essentials/ESEIMG-CALCULATOR.png",
  },
  {
    label: "Hoodie",
    description: "The everyday layer for school, projects, and moving between worlds.",
    image: "/essentials/ESEIMG-HOODIE.png",
  },
  {
    label: "Wallet",
    description: "The small everyday carry that follows every routine.",
    image: "/essentials/ESEIMG-WALLET.png",
  },
  {
    label: "Camera",
    description: "Snapshots, references, and moments that shape the visual language.",
    image: "/essentials/ESEIMG-CAMEREA.png",
  },
  {
    label: "Controller",
    description: "A reset button for competition, rhythm, and a little downtime.",
    image: "/essentials/ESEIMG-CONTROLLER.png",
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

const themeStorageKey = "portfolio-theme";

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

export default function Home() {
  const [isLightMode, setIsLightMode] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const navPillRef = useRef<HTMLSpanElement>(null);
  const heroGroupRef = useRef<HTMLDivElement>(null);
  const projectSectionRef = useRef<HTMLElement>(null);
  const essentialsRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    gsap.registerPlugin(Draggable, ScrollTrigger);

    const ctx = gsap.context(() => {
      const navLinks = gsap.utils.toArray<HTMLElement>(".portfolio-nav a");
      const getSectionWidth = () => {
        const page = pageRef.current;

        if (!page) {
          return Math.min(window.innerWidth - 48, 812);
        }

        const pageRect = page.getBoundingClientRect();
        const pageStyles = window.getComputedStyle(page);
        const inlinePadding =
          Number.parseFloat(pageStyles.paddingLeft) +
          Number.parseFloat(pageStyles.paddingRight);

        return Math.max(36, (pageRect.width - inlinePadding) * 0.94);
      };

      const cards = tileRefs.current.filter(Boolean) as HTMLDivElement[];
      const heroReveals = gsap.utils.toArray<HTMLElement>(
        ".hero-group > .reveal",
      );
      const scrollReveals = gsap.utils.toArray<HTMLElement>(
        ".project-section .reveal, .site-footer.reveal",
      );
      const sectionRules = gsap.utils.toArray<HTMLElement>(".section-rule");
      const scrollIndicator = document.querySelector<HTMLElement>(".scroll-indicator");
      const scrollIndicatorDot = document.querySelector<HTMLElement>(".scroll-indicator-dot");

      const syncProjectSpacing = () => {
        const heroGroup = heroGroupRef.current;
        const projectSection = projectSectionRef.current;

        if (!heroGroup || !projectSection) {
          return;
        }

        const rootStyles = window.getComputedStyle(document.documentElement);
        const rootFontSize = Number.parseFloat(rootStyles.fontSize) || 16;
        const isSmallScreen = window.innerWidth <= 600;
        const minGap = isSmallScreen ? 48 : 58;
        const idealGap = window.innerHeight * (isSmallScreen ? 0.058 : 0.072);
        const maxGap = rootFontSize * (isSmallScreen ? 3.75 : 5);
        const gap = Math.min(Math.max(idealGap, minGap), maxGap);
        const currentProjectMargin =
          Number.parseFloat(window.getComputedStyle(projectSection).marginTop) || 0;
        const heroBottom = heroGroup.getBoundingClientRect().bottom + window.scrollY;
        const projectTop = projectSection.getBoundingClientRect().top + window.scrollY;
        const projectBaseTop = projectTop - currentProjectMargin;

        projectSection.style.marginTop = `${heroBottom + gap - projectBaseTop}px`;
      };

      gsap.set([...heroReveals, ...scrollReveals], {
        autoAlpha: 0,
        y: 20,
        filter: "blur(8px)",
      });
      gsap.set(cards, {
        autoAlpha: 0,
        y: 26,
        scale: 0.9,
        filter: "blur(6px)",
      });
      gsap.set(sectionRules, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(scrollIndicator, { autoAlpha: 0, y: 8 });
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
          width: getSectionWidth,
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
        trigger: ".project-section",
        start: "top 70%",
        onEnter: () => {
          if (window.scrollY > 8) {
            navRevealTimeline.play();
          }
        },
        onLeaveBack: () => navRevealTimeline.reverse(),
      });

      const syncNavWidth = () => {
        if (navRevealTimeline.progress() > 0 && navRef.current) {
          gsap.set(navRef.current, { width: getSectionWidth() });
        }
      };

      const syncLayout = () => {
        syncNavWidth();
        syncProjectSpacing();
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", syncLayout);

      const scrollIndicatorTween = gsap.fromTo(
        scrollIndicatorDot,
        { y: 0, autoAlpha: 0.55, scale: 0.92 },
        {
          y: 22,
          autoAlpha: 1,
          scale: 1,
          duration: 1.35,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        },
      );
      let scrollIndicatorRevealDelay: gsap.core.Tween | null = null;

      const hideScrollIndicator = () => {
        scrollIndicatorRevealDelay?.kill();
        scrollIndicatorRevealDelay = null;
        scrollIndicatorTween.pause();
        gsap.to(scrollIndicator, {
          autoAlpha: 0,
          y: 10,
          duration: 0.22,
          ease: "power2.out",
          overwrite: true,
        });
      };

      const showScrollIndicator = () => {
        scrollIndicatorTween.play();
        gsap.to(scrollIndicator, {
          autoAlpha: 1,
          y: 0,
          duration: 0.48,
          ease: "power2.out",
          overwrite: true,
        });
      };

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(heroReveals, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          stagger: 0.075,
        })
        .to(
          cards,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.56,
            stagger: { each: 0.038, from: "center" },
            ease: "back.out(1.35)",
            clearProps: "filter",
          },
          "-=0.48",
        )
        .call(() => {
          syncProjectSpacing();
          ScrollTrigger.refresh();
        })
        .to(
          scrollIndicator,
          {
            autoAlpha: window.scrollY > 8 ? 0 : 1,
            y: 0,
            duration: 0.45,
          },
          "-=0.2",
        )
        .call(() => {
          if (window.scrollY > 8) {
            scrollIndicatorTween.pause(0);
          }
        });

      const belowFoldTimeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      belowFoldTimeline
        .to(scrollReveals, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.82,
          stagger: 0.055,
        })
        .to(
          sectionRules,
          {
            scaleX: 1,
            duration: 1,
            stagger: 0.18,
          },
          "-=0.72",
        );

      const syncBelowFoldVisibility = () => {
        if (window.scrollY > 8) {
          hideScrollIndicator();
          belowFoldTimeline.timeScale(1);
          belowFoldTimeline.play();
          return;
        }

        belowFoldTimeline.timeScale(1.6).reverse();
        navRevealTimeline.reverse();
        scrollIndicatorRevealDelay?.kill();
        scrollIndicatorRevealDelay = gsap.delayedCall(0.62, showScrollIndicator);
      };

      window.addEventListener("scroll", syncBelowFoldVisibility, { passive: true });
      syncProjectSpacing();
      syncBelowFoldVisibility();

      const initialCardZ = new Map<HTMLDivElement, number>();
      const maxInitialCardZ = cards.reduce((maxZ, card) => {
        const zIndex = Number.parseInt(window.getComputedStyle(card).zIndex, 10);
        const safeZIndex = Number.isFinite(zIndex) ? zIndex : 9001;

        initialCardZ.set(card, safeZIndex);

        return Math.max(maxZ, safeZIndex);
      }, 9001);
      const activeCardZ = Math.min(maxInitialCardZ + 1, 9900);
      const liftCard = (card: HTMLDivElement) => {
        gsap.set(card, { zIndex: activeCardZ });
      };
      const resetCard = (card: HTMLDivElement) => {
        gsap.set(card, { zIndex: initialCardZ.get(card) ?? 9001 });
      };
      const hoverCard = (event: MouseEvent) => {
        const card = event.currentTarget as HTMLDivElement;

        liftCard(card);
      };
      const leaveCard = (event: MouseEvent) => {
        resetCard(event.currentTarget as HTMLDivElement);
      };
      const pressCard = (event: MouseEvent) => {
        liftCard(event.currentTarget as HTMLDivElement);
      };

      cards.forEach((card) => {
        card.addEventListener("mousedown", pressCard);
        card.addEventListener("mouseenter", hoverCard);
        card.addEventListener("mouseleave", leaveCard);
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
        onRelease() {
          const card = this.target as HTMLDivElement;

          if (!card.matches(":hover")) {
            resetCard(card);
          }
        },
      });

      return () => {
        window.removeEventListener("resize", syncLayout);
        window.removeEventListener("scroll", syncBelowFoldVisibility);
        scrollIndicatorRevealDelay?.kill();
        scrollIndicatorTween.kill();
        belowFoldTimeline.kill();

        cards.forEach((card) => {
          card.removeEventListener("mousedown", pressCard);
          card.removeEventListener("mouseenter", hoverCard);
          card.removeEventListener("mouseleave", leaveCard);
        });
      };
    }, pageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(themeStorageKey);
    const nextIsLightMode = savedTheme === "light";

    setIsLightMode(nextIsLightMode);
    document.documentElement.dataset.theme = nextIsLightMode ? "light" : "dark";
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

  const toggleTheme = () => {
    const nextIsLightMode = !isLightMode;
    const nextTheme = nextIsLightMode ? "light" : "dark";

    setIsLightMode(nextIsLightMode);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(themeStorageKey, nextTheme);
  };

  return (
    <main ref={pageRef} className="portfolio-shell">
      <button
        className="theme-toggle"
        type="button"
        aria-label={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
        aria-pressed={isLightMode}
        onClick={toggleTheme}
      >
        <span className="theme-toggle-track" aria-hidden="true">
          <span className="theme-toggle-thumb" />
        </span>
        <span className="theme-toggle-label">{isLightMode ? "Light" : "Dark"}</span>
      </button>

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
        <div ref={heroGroupRef} className="hero-grid hero-group">
          <div ref={essentialsRef} className="essentials-board reveal" aria-label="My essentials">
            <div className="essentials-collage">
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
                    <img src={item.image} alt={item.label} />
                  </motion.div>
                  <p className="essential-card-tooltip">{item.description}</p>
                </div>
              ))}
              <Image
                className="mobile-collage-image"
                src="/essentials/Collage.png"
                alt="A composed collage of Yahya's essentials"
                width={3862}
                height={1803}
                priority
              />
            </div>
          </div>

          <div className="hero-title-row reveal">
            <h1 className="hero-title">Yahya Ikram</h1>
            <p className="hero-kicker">
              ASPIRING ENGINEER  /  HIGH SCHOOL STUDENT
            </p>
          </div>
          <p className="hero-copy reveal">
            Positioned on Lake Ontario&apos;s northwestern shore, Toronto
            functions as a major economic and transportation centre. Ongoing
            construction, economic and transportation centre. Ongoing
            construction.
          </p>
        </div>
        <div className="scroll-indicator" aria-hidden="true">
          <span className="scroll-indicator-line">
            <span className="scroll-indicator-dot" />
          </span>
        </div>
      </section>

      <section ref={projectSectionRef} id="projects" className="content-section project-section">
        <div className="section-heading reveal">
          <h2>
            My Work/Initiatives
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
