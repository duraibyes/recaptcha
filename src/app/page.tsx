"use client";

import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { Lock, Mail, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

// Mock DB for demonstration
const MOCK_DB = [
  { email: "user@example.com", password: "password123" },
  { email: "admin@example.com", password: "admin" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    // Basic Validation
    if (!email || !password) {
      setStatus("error");
      setMessage("Please fill in all fields.");
      return;
    }

    // Turnstile Validation
    if (!turnstileToken) {
      setStatus("error");
      setMessage("Please complete the security challenge.");
      return;
    }

    // Mock API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Verify against local static DB
    const user = MOCK_DB.find((u) => u.email === email && u.password === password);

    if (user) {
      setStatus("success");
      setMessage("Login successful! Welcome back.");
    } else {
      setStatus("error");
      setMessage("Invalid email or password.");
      // Optional: reset turnstile if login fails so they must solve again
      // turnstileRef.current?.reset();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 overflow-hidden relative font-sans text-neutral-200">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/5">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
            <p className="text-neutral-400">Sign in to your account securely</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-indigo-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-indigo-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Cloudflare Turnstile */}
            <div className="flex justify-center py-2">
              <Turnstile
                siteKey="0x4AAAAAADrQaqAeP6qwJZBy"
                onSuccess={(token) => {
                  setTurnstileToken(token);
                  if (status === "error") setStatus("idle");
                }}
                onError={() => {
                  setTurnstileToken(null);
                  setStatus("error");
                  setMessage("Security challenge failed.");
                }}
                onExpire={() => {
                  setTurnstileToken(null);
                }}
                options={{
                  theme: "dark",
                }}
              />
            </div>

            {/* Status Messages */}
            {status === "error" && (
              <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-sm animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {status === "success" && (
              <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-400/10 p-3 rounded-lg border border-emerald-400/20 text-sm animate-in fade-in slide-in-from-top-1">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full relative group overflow-hidden rounded-xl p-[1px] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-neutral-950 flex items-center justify-center py-3 rounded-xl transition-all duration-300 group-hover:bg-opacity-0">
                {status === "loading" ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <span className="font-semibold text-white">Sign In securely</span>
                )}
              </div>
            </button>
          </form>

          {/* Helper Text */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-neutral-500">
            <p>Demo Credentials:</p>
            <p className="mt-1 font-mono text-xs">user@example.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
