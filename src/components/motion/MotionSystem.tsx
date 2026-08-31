"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function MotionSystem({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let cancelled = false;
    let cleanup = () => {};

    async function setupMotion() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !root) return;

      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        gsap.fromTo(
          root,
          { autoAlpha: 0.94, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out", clearProps: "transform" }
        );

        const heroCopy = root.querySelectorAll<HTMLElement>("[data-hero-copy] > *");
        if (heroCopy.length) {
          gsap.fromTo(
            heroCopy,
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", delay: 0.08 }
          );
        }

        root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.75,
              ease: "power3.out",
              scrollTrigger: { trigger: element, start: "top 86%", once: true },
            }
          );
        });

        root.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
          const items = group.querySelectorAll<HTMLElement>("[data-stagger-item]");
          if (!items.length) return;
          gsap.fromTo(
            items,
            { autoAlpha: 0, y: 24, scale: 0.985 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.65,
              stagger: 0.09,
              ease: "power2.out",
              scrollTrigger: { trigger: group, start: "top 84%", once: true },
            }
          );
        });

        root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((element) => {
          gsap.fromTo(
            element,
            { yPercent: -3 },
            {
              yPercent: 3,
              ease: "none",
              scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: 0.8 },
            }
          );
        });

        root.querySelectorAll<HTMLElement>("[data-count]").forEach((element) => {
          const end = Number(element.dataset.count ?? 0);
          const suffix = element.dataset.countSuffix ?? "";
          const counter = { value: 0 };
          gsap.to(counter, {
            value: end,
            duration: 1.5,
            ease: "power2.out",
            delay: 0.35,
            onUpdate: () => {
              element.textContent = `${Math.round(counter.value).toLocaleString("en-IN")}${suffix}`;
            },
          });
        });
      }, root);

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh, { once: true });
      cleanup = () => {
        window.removeEventListener("load", refresh);
        context.revert();
      };
    }

    void setupMotion();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [pathname]);

  return (
    <div ref={rootRef} key={pathname} data-page-transition>
      {children}
    </div>
  );
}
