
"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function Home() {
  const [particles, setParticles] = useState([]);
  const sectionRefs = useRef([]);

  useEffect(() => {
    // Floating background particles
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 4 + 2,
    }));
    setParticles(newParticles);

    // Fade-in observer
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            entry.target.classList.add("fade-in-active");
        }),
      { threshold: 0.2 }
    );
    sectionRefs.current.forEach((s) => s && observer.observe(s));
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden relative">
      {/* Animated Particle Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-r from-amber-400/20 to-yellow-400/10 animate-float"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size * 2}px`,
              height: `${p.size * 2}px`,
              animationDelay: `${p.id * 0.5}s`,
              animationDuration: `${p.speed * 10}s`,
            }}
          />
        ))}
      </div>

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0e0e0e]/80 backdrop-blur-lg border-b border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-700 rounded-xl flex items-center justify-center text-xl">
              ♟️
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-orange-400 bg-clip-text text-transparent">
              CheckMate
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-10 text-gray-300 font-medium">
            {["Features", "How It Works", "About"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-amber-300 transition-all duration-300"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="px-5 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-amber-300 hover:border-amber-400 transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-gradient-to-br from-amber-500 to-orange-900 text-gray-100 font-semibold rounded-lg shadow-md hover:shadow-amber-500/40 hover:brightness-110 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        ref={(el) => (sectionRefs.current[0] = el)}
        className="pt-40 text-center px-6 md:px-20 max-w-5xl mx-auto opacity-0 fade-in relative z-10"
      >

        {/* Background magnifying glass graphic */}
       <div className="absolute inset-0 flex justify-center items-center z-0 pointer-events-none">
  <div className="absolute inset-0 flex justify-center items-center z-0 pointer-events-none">
  <img
    src="/magnifyingwbg.png"
    alt="Magnifying glass backdrop"
    className="w-[700px] md:w-[950px] opacity-25 md:opacity-30 brightness-125 blur-[0.5px] animate-pulse-slow"
    style={{
      transform: "translateY(40px) rotate(-10deg)", // moves slightly down & adds rotation
      filter:
        "drop-shadow(0 0 50px rgba(255,140,0,0.25)) brightness(1.25) saturate(1.1)",
      objectFit: "contain",
    }}
  />
</div>

</div>


        <h1 className="text-6xl md:text-7xl font-extrabold leading-tight mb-8 z-10 relative">
          <span className="bg-gradient-to-r from-amber-200 to-orange-500 bg-clip-text text-transparent">
            Check the News.
          </span>
          <br />
          <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent z-10 relative">
            Win Against Fakes.
          </span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-10 z-10 relative">
          Unleash AI-powered misinformation detection for a more truthful
          digital world.
        </p>
        <div className="flex justify-center space-x-6">
          <Link
            href="/verify"
            className="px-8 py-3 bg-gradient-to-br from-amber-500 to-orange-900 text-gray-100 font-semibold rounded-xl shadow-lg hover:shadow-amber-500/40 hover:brightness-110 transition-all duration-300"
          >
            Start Verifying
          </Link>
          <button className="px-8 py-3 border border-gray-700 rounded-xl text-gray-300 hover:text-amber-300 hover:border-amber-400 transition">
            Learn More
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section
        ref={(el) => (sectionRefs.current[1] = el)}
        className="max-w-7xl mx-auto mt-40 px-6 md:px-12 opacity-0 fade-in relative z-10"
      >
        <h2 className="text-center text-3xl font-bold mb-14 text-white">
          Powerful Detection at Your Fingertips
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { title: "Text Analysis", desc: "Detect biased or false claims using NLP.", icon: "📰" },
            { title: "Image Verification", desc: "Spot deepfakes and visual misinformation.", icon: "🖼️" },
            { title: "URL Scanning", desc: "Analyze domains for credibility and bias.", icon: "🔗" },
            { title: "Real-Time Detection", desc: "Lightning-fast misinformation detection.", icon: "⚡" },
            { title: "Advanced AI Models", desc: "Built on verified multi-source training data.", icon: "🧠" },
            { title: "Credibility Scoring", desc: "Confidence-based truth metrics for insights.", icon: "📊" },
            { title: "Privacy First", desc: "Your data is secure — encrypted, never stored.", icon: "🔒" },
            { title: "Multi-language Support", desc: "Analyze over 50+ global languages accurately.", icon: "🌐" },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-[#111] border border-[#222] rounded-3xl p-8 hover:border-amber-400/30 transition-all duration-300 shadow-[0_0_20px_-10px_rgba(255,180,0,0.15)]"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h4 className="text-lg font-semibold text-amber-300 mb-2">
                {f.title}
              </h4>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        ref={(el) => (sectionRefs.current[2] = el)}
        className="max-w-6xl mx-auto mt-36 px-8 text-center relative opacity-0 fade-in z-10"
      >
        <h3 className="text-3xl font-bold text-white mb-4">
          How CheckMate Works
        </h3>
        <p className="text-gray-400 mb-16 text-lg">
          Three simple steps to verify content and defend truth.
        </p>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {[
            {
              step: "01",
              icon: "⬆️",
              title: "Submit Content",
              desc: "Upload text, paste a URL, or upload an image you want to verify.",
            },
            {
              step: "02",
              icon: "🤖",
              title: "AI Analysis",
              desc: "Our AI analyzes the content across multiple sources and dimensions.",
            },
            {
              step: "03",
              icon: "✅",
              title: "Get Results",
              desc: "Receive detailed credibility reports with confidence levels.",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="relative bg-[#111111] border border-[#222] rounded-3xl p-10 shadow-[0_0_20px_-10px_rgba(255,180,0,0.1)] hover:border-amber-400/30 transition"
            >
              <div className="absolute text-7xl font-extrabold text-gray-700/10 right-8 top-6">
                {s.step}
              </div>
              <div className="text-4xl mb-6">{s.icon}</div>
              <h4 className="text-xl font-semibold text-amber-300 mb-3">
                {s.title}
              </h4>
              <p className="text-gray-400">{s.desc}</p>
            </div>
          ))}

          {/* Connecting Arrows */}
          <svg
            className="hidden md:block absolute inset-0 pointer-events-none"
            viewBox="0 0 1000 200"
            preserveAspectRatio="none"
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <polygon
                  points="0 0, 6 3, 0 6"
                  fill="rgba(251,191,36,0.8)"
                />
              </marker>
            </defs>
            <path
              d="M 320 100 C 400 100, 420 100, 500 100"
              stroke="rgba(251,191,36,0.6)"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
              className="arrow-glow"
            />
            <path
              d="M 700 100 C 770 100, 790 100, 860 100"
              stroke="rgba(251,191,36,0.6)"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
              className="arrow-glow"
            />
          </svg>
        </div>
      </section>

      {/* CTA */}
      <section
        ref={(el) => (sectionRefs.current[3] = el)}
        className="text-center mt-36 px-8 opacity-0 fade-in relative z-10"
      >
        <h3 className="text-4xl font-bold mb-6">
          Ready to{" "}
          <span className="text-amber-400">Fight Fake News?</span>
        </h3>
        <p className="text-gray-400 mb-10 text-lg max-w-2xl mx-auto">
          Join thousands who trust CheckMate to stay informed with verified,
          accurate insights.
        </p>
        <div className="flex justify-center space-x-6">
          <Link
            href="/verify"
            className="px-8 py-3 bg-gradient-to-br from-amber-500 to-orange-900 text-gray-100 font-semibold rounded-xl shadow-lg hover:shadow-amber-500/40 hover:brightness-110 transition-all duration-300"
          >
            Start Free Trial
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 border border-gray-700 rounded-xl text-gray-300 hover:text-amber-300 hover:border-amber-400 transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-32 py-10 border-t border-[#1c1c1c] bg-[#0b0b0b] text-center text-gray-500 relative z-10">
        <p className="mb-2">
          © 2025 CheckMate. Defending truth in the digital age.
        </p>
        <div className="space-x-6 text-sm">
          <a href="#" className="hover:text-amber-400">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-amber-400">
            Terms of Service
          </a>
          <a href="#" className="hover:text-amber-400">
            Contact
          </a>
        </div>
      </footer>

      {/* Animations */}
      <style jsx>{`
        .fade-in {
          transition: opacity 1.2s ease, transform 1.2s ease;
          transform: translateY(30px);
        }
        .fade-in-active {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        @keyframes arrowPulse {
          0%, 100% { stroke-opacity: 0.3; }
          50% { stroke-opacity: 0.9; }
        }
        .arrow-glow {
          animation: arrowPulse 2s ease-in-out infinite;
        }

      @keyframes pulse-slow {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1) rotate(-10deg);
    filter: drop-shadow(0 0 25px rgba(255,140,0,0.15));
  }
  50% {
    opacity: 0.3;
    transform: scale(1.05) rotate(-10deg);
    filter: drop-shadow(0 0 60px rgba(255,160,50,0.35));
  }
}
.animate-pulse-slow {
  animation: pulse-slow 6s ease-in-out infinite;
}



      `}</style>
    </div>
  );
}




