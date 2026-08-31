"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Scissors, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@championhairsalon.com");
  const [password, setPassword] = useState("Champion@1998");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Header Logo */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#161616] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mx-auto shadow-xl">
            <Scissors className="w-7 h-7 -rotate-45" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-white">CHAMPION HAIR SALON</h1>
            <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mt-0.5">
              Secure Administration Portal • Since 1998
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="bg-[#141414] border-white/10 p-8 shadow-2xl space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-bold text-white">Sign In to Admin</h2>
            <p className="text-xs text-[#8E8E8E]">Enter your master credentials to manage salon operations.</p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Admin Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@championhairsalon.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            {/* Quick credentials hint */}
            <div className="p-3 bg-[#1A1A1A] rounded-lg border border-white/5 text-[11px] text-[#8E8E8E] space-y-1">
              <div className="flex items-center gap-1.5 text-[#D4AF37] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Default Admin Credentials:</span>
              </div>
              <p>Email: <code className="text-white">admin@championhairsalon.com</code></p>
              <p>Password: <code className="text-white">Champion@1998</code></p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full justify-center mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Access Dashboard
            </Button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-[#8E8E8E] hover:text-[#D4AF37] transition-colors"
            >
              ← Return to Public Website
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
