"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lock, Mail, ArrowRight, Sparkles, Shield, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

      await refreshUser();
      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <main className="min-h-screen bg-[#111111] text-[#F8F6F2]">
      <Navbar />

      <section className="pt-36 pb-24 max-w-md mx-auto px-6">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full border border-[#C8A46A]/50 flex items-center justify-center mx-auto mb-4 text-[#C8A46A]">
            <Lock className="w-5 h-5" />
          </div>

          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A46A] block mb-2">
            Private Access
          </span>
          <h1 className="font-serif text-3xl text-[#F8F6F2] uppercase font-light">
            Patron Sign In
          </h1>
          <p className="text-xs text-[#929292] mt-1">
            Access your bookings, styling history, and private suite preferences.
          </p>
        </div>

        {/* Quick Demo Credentials Bar */}
        <div className="mb-6 p-4 bg-[#181818] border border-[#C8A46A]/30">
          <div className="flex items-center gap-1.5 text-[11px] text-[#C8A46A] uppercase tracking-wider font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>One-Click Demo Credentials</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("client@demo.com", "client123")}
              className="px-3 py-2 bg-[#111111] hover:bg-[#C8A46A]/10 border border-white/10 hover:border-[#C8A46A] text-[11px] text-[#E8DDCE] transition-colors text-left"
            >
              <div className="font-medium flex items-center gap-1">
                <User className="w-3 h-3 text-[#C8A46A]" /> Client Demo
              </div>
              <div className="text-[9px] text-[#929292] truncate">client@demo.com</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@elixir.luxury", "admin123")}
              className="px-3 py-2 bg-[#111111] hover:bg-[#C8A46A]/10 border border-white/10 hover:border-[#C8A46A] text-[11px] text-[#E8DDCE] transition-colors text-left"
            >
              <div className="font-medium flex items-center gap-1">
                <Shield className="w-3 h-3 text-[#C8A46A]" /> Admin Portal
              </div>
              <div className="text-[9px] text-[#929292] truncate">admin@elixir.luxury</div>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-950/40 border border-red-500/40 text-red-200 text-xs">
            {error}
          </div>
        )}

        <div className="bg-[#161616] border border-white/5 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#929292]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@demo.com"
                  className="w-full bg-[#111111] border border-white/10 text-xs text-[#F8F6F2] pl-10 pr-4 py-3 focus:outline-none focus:border-[#C8A46A]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#929292]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111111] border border-white/10 text-xs text-[#F8F6F2] pl-10 pr-4 py-3 focus:outline-none focus:border-[#C8A46A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#C8A46A] text-[#111111] font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#D8B57B] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#C8A46A]/20"
            >
              <span>{loading ? "Verifying..." : "Sign In to Atelier"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-[#929292]">
            Don&apos;t have an account yet?{" "}
            <Link href="/auth/register" className="text-[#C8A46A] hover:underline font-medium">
              Create Patron Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
