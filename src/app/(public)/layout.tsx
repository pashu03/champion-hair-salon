import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { MotionSystem } from "@/components/motion/MotionSystem";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="site-shell min-h-screen flex flex-col bg-[#050505] text-white">
      <Navbar />
      <main className="flex-1">
        <MotionSystem>{children}</MotionSystem>
      </main>
      <Footer />
      <MobileBottomBar />
      <FloatingWhatsApp />
    </div>
  );
}
