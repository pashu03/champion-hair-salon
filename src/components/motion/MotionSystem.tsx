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
      let interactiveModelCleanup = () => {};
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

        const modelStage = root.querySelector<HTMLElement>("[data-hero-model-stage]");
        const modelScroll = root.querySelector<HTMLElement>("[data-hero-model-scroll]");
        const modelTilt = root.querySelector<HTMLElement>("[data-hero-model-tilt]");
        const modelShadow = root.querySelector<HTMLElement>("[data-hero-model-shadow]");

        if (modelStage && modelScroll && modelTilt) {
          gsap.set(modelStage, { perspective: 1050 });
          gsap.set([modelScroll, modelTilt], {
            transformStyle: "preserve-3d",
            transformOrigin: "50% 58%",
          });

          gsap.fromTo(
            modelScroll,
            { y: 20, rotationX: 2.5, scale: 0.965 },
            {
              y: -34,
              rotationX: -3.5,
              scale: 1.025,
              ease: "none",
              scrollTrigger: {
                trigger: modelStage,
                start: "top 88%",
                end: "bottom 12%",
                scrub: 0.85,
              },
            }
          );

          if (modelShadow) {
            gsap.fromTo(
              modelShadow,
              { scaleX: 1, opacity: 0.48 },
              {
                scaleX: 0.76,
                opacity: 0.24,
                ease: "none",
                scrollTrigger: {
                  trigger: modelStage,
                  start: "top 88%",
                  end: "bottom 12%",
                  scrub: 0.85,
                },
              }
            );
          }

          if (window.matchMedia("(pointer: fine)").matches) {
            const handlePointerMove = (event: PointerEvent) => {
              const rect = modelStage.getBoundingClientRect();
              const x = (event.clientX - rect.left) / rect.width - 0.5;
              const y = (event.clientY - rect.top) / rect.height - 0.5;
              gsap.to(modelTilt, {
                rotationY: x * 8,
                rotationX: y * -5,
                x: x * 8,
                y: y * 5,
                duration: 0.65,
                ease: "power2.out",
                overwrite: "auto",
              });
            };
            const handlePointerLeave = () => {
              gsap.to(modelTilt, {
                rotationY: 0,
                rotationX: 0,
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                overwrite: "auto",
              });
            };

            modelStage.addEventListener("pointermove", handlePointerMove);
            modelStage.addEventListener("pointerleave", handlePointerLeave);
            interactiveModelCleanup = () => {
              modelStage.removeEventListener("pointermove", handlePointerMove);
              modelStage.removeEventListener("pointerleave", handlePointerLeave);
            };
          }
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
        interactiveModelCleanup();
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
