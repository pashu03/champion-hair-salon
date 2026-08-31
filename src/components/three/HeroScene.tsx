"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Scissors, Sparkles } from "lucide-react";

const BarberToolScene = dynamic(
  () => import("./BarberToolScene").then((module) => module.BarberToolScene),
  { ssr: false, loading: () => <HeroSceneFallback loading /> }
);

type SceneMode = "checking" | "3d" | "fallback";

interface NavigatorWithPerformanceHints extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function shouldUse3D() {
  const nav = navigator as NavigatorWithPerformanceHints;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const compactViewport = window.matchMedia("(max-width: 640px)").matches;
  const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory < 4;
  const lowCpu = typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 6;
  const saveData = Boolean(nav.connection?.saveData);

  return canUseWebGL() && !reducedMotion && !saveData && !(compactViewport && (lowMemory || lowCpu));
}

class SceneBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <HeroSceneFallback /> : this.props.children;
  }
}

export function HeroSceneFallback({ loading = false }: { loading?: boolean }) {
  return (
    <div className="hero-static-fallback absolute inset-0 flex items-center justify-center" role="img" aria-label="Premium black and gold barber scissors">
      <div className="hero-tool-halo" />
      <div className="hero-tool-orbit hero-tool-orbit-one" />
      <div className="hero-tool-orbit hero-tool-orbit-two" />
      <Scissors className="hero-tool-icon h-40 w-40 sm:h-52 sm:w-52" strokeWidth={0.8} />
      <span className="absolute bottom-24 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]">
        <Sparkles className="h-3.5 w-3.5" />
        {loading ? "Preparing the craft" : "Crafted since 1998"}
      </span>
    </div>
  );
}

export function HeroScene() {
  const [mode, setMode] = useState<SceneMode>("checking");

  useEffect(() => {
    const start = () => setMode(shouldUse3D() ? "3d" : "fallback");
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (idleWindow.requestIdleCallback) {
      const id = idleWindow.requestIdleCallback(start, { timeout: 900 });
      return () => idleWindow.cancelIdleCallback?.(id);
    }

    const id = window.setTimeout(start, 180);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="relative h-full min-h-[430px] w-full overflow-hidden rounded-[1.5rem]">
      {mode === "3d" ? (
        <SceneBoundary>
          <BarberToolScene />
        </SceneBoundary>
      ) : (
        <HeroSceneFallback loading={mode === "checking"} />
      )}

      <div className="always-dark pointer-events-none absolute inset-x-4 bottom-4 z-10 flex items-center gap-3 rounded-xl border border-white/10 bg-black/65 p-3 text-white shadow-2xl backdrop-blur-md sm:inset-x-6 sm:bottom-6">
        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-[#D4AF37]/35">
          <Image src="/images/salon-storefront.jpg" alt="Champion Hair Salon storefront" fill priority loading="eager" className="object-cover" sizes="64px" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-white">The craft. The chair. The legacy.</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">Real salon • Main Market</p>
        </div>
      </div>
    </div>
  );
}
