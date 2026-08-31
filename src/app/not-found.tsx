import React from "react";
import Link from "next/link";
import { Scissors, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#161616] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mx-auto shadow-xl">
          <Scissors className="w-8 h-8 -rotate-45" />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-bold font-display text-[#D4AF37]">404</h1>
          <h2 className="text-2xl font-bold font-display text-white">Page Not Found</h2>
          <p className="text-sm text-[#8E8E8E] leading-relaxed">
            The page you are looking for does not exist or may have been moved.
          </p>
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <Link href="/">
            <Button size="md" leftIcon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link href="/book">
            <Button variant="secondary" size="md">
              Book Appointment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
