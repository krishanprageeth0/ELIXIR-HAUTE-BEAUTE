"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Mail, Lock, Phone, ArrowRight, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      await refreshUser();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#111111] text-[#F8F6F2]">
      <Navbar />

      <section className="pt-36 pb-24 max-w-md mx-auto px-6">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full border border-[#C8A46A]/50 flex items-center justify-center mx-auto mb-4 text-[#C8A46A]">
            <Sparkles className="w-5 h-5" />
          </div>

          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A46A] block mb-2">
            Privilege Membership
          </span>
          <h1 className="font-serif text-3xl text-[#F8F6F2] uppercase font-light">
            Create Patron Account
          </h1>
          <p className="text-xs text-[#929292] mt-1">
            Join the ÉLIXIR Circle for personalized consultations, priority waitlists, and booking history.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-950/40 border border-red-500/40 text-red-200 text-xs">
            {error}
          </div>
        )}

        <div className="bg-[#161616] border border-white/5 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-1.5">
                Full Legal Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#929292]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sophia Vandermeer"
                  className="w-full bg-[#111111] border border-white/10 text-xs text-[#F8F6F2] pl-10 pr-4 py-3 focus:outline-none focus:border-[#C8A46A]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#929292]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@luxury.com"
                  className="w-full bg-[#111111] border border-white/10 text-xs text-[#F8F6F2] pl-10 pr-4 py-3 focus:outline-none focus:border-[#C8A46A]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#929292]" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (212) 000-0000"
                  className="w-full bg-[#111111] border border-white/10 text-xs text-[#F8F6F2] pl-10 pr-4 py-3 focus:outline-none focus:border-[#C8A46A]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#929292]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#111111] border border-white/10 text-xs text-[#F8F6F2] pl-10 pr-4 py-3 focus:outline-none focus:border-[#C8A46A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#C8A46A] text-[#111111] font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#D8B57B] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#C8A46A]/20 mt-6"
            >
              <span>{loading ? "Creating Account..." : "Create Patron Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-[#929292]">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#C8A46A] hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
