import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function BarberStationArtwork() {
  return (
    <div
      className="hero-station-stage absolute inset-x-0 bottom-[9.4rem] top-0 z-[1] flex items-center justify-center sm:bottom-[11rem]"
      role="img"
      aria-label="Luxury black and gold barber chair, mirror, clippers, comb, scissors and razor"
      data-hero-model-stage
    >
      <div className="hero-station-glow" aria-hidden="true" />

      <div className="hero-station-art relative h-full w-full" data-hero-model-scroll>
        <div className="hero-station-model relative h-full w-full" data-hero-model-tilt>
          <div className="hero-station-model-shadow" data-hero-model-shadow aria-hidden="true" />
          <Image
            src="/images/barber-station-hero-v2.png"
            alt="Premium Champion Hair Salon barber station"
            fill
            priority
            loading="eager"
            className="z-[2] object-contain object-center"
            sizes="(min-width: 1024px) 40vw, (min-width: 640px) 70vw, 94vw"
          />
        </div>
      </div>
    </div>
  );
}

export function HeroScene() {
  return (
    <div className="relative h-full min-h-[520px] w-full overflow-hidden rounded-[1.5rem] lg:min-h-[590px]">
      <BarberStationArtwork />

      <div className="hero-station-caption pointer-events-none absolute inset-x-4 bottom-[8.25rem] z-10 flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] sm:bottom-[9.75rem] sm:text-[10px]">
        <span>Champion signature craft</span>
        <span className="h-1 w-1 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
        <span>Since 1998</span>
      </div>

      <div className="always-dark absolute inset-x-4 bottom-4 z-20 flex items-center gap-3 rounded-[1.15rem] border border-white/10 bg-[#101010]/95 p-3 text-white shadow-2xl backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-4">
        <div className="relative h-14 w-[4.5rem] shrink-0 overflow-hidden rounded-xl border border-[#D4AF37]/55 sm:h-16 sm:w-20">
          <Image
            src="/images/salon-storefront.jpg"
            alt="Champion Hair Salon storefront"
            fill
            priority
            loading="eager"
            className="object-cover"
            sizes="80px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-semibold text-white sm:text-base">
            The craft. The chair. The legacy.
          </p>
          <p className="mt-0.5 truncate text-[9px] uppercase tracking-[0.18em] text-[#D4AF37] sm:text-[10px]">
            Real salon • Main Market
          </p>
        </div>

        <Link
          href="/about"
          aria-label="Discover the Champion Hair Salon legacy"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/70 text-[#D4AF37] transition-all hover:border-[#F5E296] hover:bg-[#D4AF37] hover:text-black focus-visible:outline-none sm:h-12 sm:w-12"
        >
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </Link>
      </div>
    </div>
  );
}
