// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function HomePage() {
//   const router = useRouter();
//   const [cursorVisible, setCursorVisible] = useState(false);
//   const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

//   // Particle background
//   useEffect(() => {
//     const canvas = document.getElementById("particles");
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     let particles = [];
//     const count = 35;

//     for (let i = 0; i < count; i++) {
//       particles.push({
//         x: Math.random() * window.innerWidth,
//         y: Math.random() * window.innerHeight,
//         r: Math.random() * 2 + 1,
//         dx: (Math.random() - 0.5) * 0.4,
//         dy: (Math.random() - 0.5) * 0.4,
//       });
//     }

//     function animate() {
//       ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
//       particles.forEach((p) => {
//         ctx.beginPath();
//         ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
//         ctx.fillStyle = "rgba(255,140,0,0.6)";
//         ctx.fill();
//         p.x += p.dx;
//         p.y += p.dy;
//         if (p.x < 0 || p.x > window.innerWidth) p.dx *= -1;
//         if (p.y < 0 || p.y > window.innerHeight) p.dy *= -1;
//       });
//       requestAnimationFrame(animate);
//     }

//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     animate();
//   }, []);

//   // Custom cursor follow
//   useEffect(() => {
//     const handleMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
//     window.addEventListener("mousemove", handleMove);
//     return () => window.removeEventListener("mousemove", handleMove);
//   }, []);

//   // Card Component
//   const Card = ({ icon, title, desc, link }) => (
//     <div
//       onClick={() => router.push(link)}
//       onMouseEnter={() => setCursorVisible(true)}
//       onMouseLeave={() => setCursorVisible(false)}
//       className="relative z-10 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,140,0,0.4)]"
//     >
//       <div className="text-5xl mb-4">{icon}</div>
//       <h3 className="text-2xl font-bold text-orange-400 mb-3">{title}</h3>
//       <p className="text-gray-400">{desc}</p>
//     </div>
//   );

//   return (
//     <div className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden px-6">
//       {/* Particle Canvas */}
//       <canvas id="particles" className="absolute inset-0 z-0"></canvas>

//       {/* Glow background */}
//       <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-orange-500/10 blur-[150px] rounded-full"></div>

//       {/* Header */}
//       <header className="absolute top-0 left-0 w-full flex justify-between items-center px-10 py-6 bg-black/50 backdrop-blur-md border-b border-zinc-800 z-20">
//         <div className="flex items-center space-x-3">
//           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center text-2xl">
//             ♟️
//           </div>
//           <h1 className="text-2xl font-bold text-orange-400">CheckMate</h1>
//         </div>

//         <nav className="flex space-x-8 text-gray-300 font-medium">
//           <a href="/" className="hover:text-orange-400 transition">Home</a>
//           <a href="/features" className="hover:text-orange-400 transition">Features</a>
//           <a href="/about" className="hover:text-orange-400 transition">About</a>
//         </nav>

//         <button
//           onClick={() => router.push("/login")}
//           className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold hover:shadow-[0_0_25px_rgba(255,140,0,0.6)] transition-all duration-300"
//         >
//           Logout
//         </button>
//       </header>

//       {/* Main Section */}
//       <main className="relative z-10 text-center mt-28 mb-10">
//         <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-orange-300 via-orange-500 to-yellow-400 text-transparent bg-clip-text">
//           Choose Your Verification Mode
//         </h1>
//         <p className="text-gray-400 text-lg mb-16 max-w-2xl mx-auto">
//           Whether it’s text, a URL, or an image — CheckMate helps you uncover the truth with advanced AI verification.
//         </p>

//         {/* Verification Options */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
//           <Card
//             icon="📝"
//             title="Verify via Text"
//             desc="Paste or write text to analyze its authenticity using AI-driven language models."
//             link="/verify-text"
//           />
//           <Card
//             icon="🔗"
//             title="Verify via URL"
//             desc="Enter a webpage link to scan for factual accuracy, bias, and trustworthiness."
//             link="/verify-url"
//           />
//           <Card
//             icon="🖼️"
//             title="Verify via Image"
//             desc="Upload an image to detect deepfakes, manipulations, or misleading visuals."
//             link="/verify-image"
//           />
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="relative z-10 w-full text-center py-6 border-t border-zinc-800 text-gray-500">
//         © {new Date().getFullYear()} CheckMate — Powered by AI Truth Detection
//       </footer>

//       {/* Custom magnifying cursor */}
//       {cursorVisible && (
//         <img
//           src="/magnifyingwbg.png"
//           alt="cursor"
//           className="fixed pointer-events-none w-10 h-10 opacity-80 drop-shadow-[0_0_10px_rgba(255,140,0,0.8)] transition-transform duration-100 ease-linear"
//           style={{
//             left: `${cursorPos.x - 20}px`,
//             top: `${cursorPos.y - 20}px`,
//             transform: "scale(1.05)",
//             zIndex: 50,
//           }}
//         />
//       )}
//     </div>
//   );
// }




// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function HomePage() {
//   const router = useRouter();
//   const [cursorVisible, setCursorVisible] = useState(false);
//   const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

//   // 🔸 Particle background
//   useEffect(() => {
//     const canvas = document.getElementById("particles");
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     let particles = [];
//     const count = 40;

//     for (let i = 0; i < count; i++) {
//       particles.push({
//         x: Math.random() * window.innerWidth,
//         y: Math.random() * window.innerHeight,
//         r: Math.random() * 2 + 1,
//         dx: (Math.random() - 0.5) * 0.4,
//         dy: (Math.random() - 0.5) * 0.4,
//       });
//     }

//     function animate() {
//       ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
//       particles.forEach((p) => {
//         ctx.beginPath();
//         ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
//         ctx.fillStyle = "rgba(255,140,0,0.5)";
//         ctx.fill();
//         p.x += p.dx;
//         p.y += p.dy;
//         if (p.x < 0 || p.x > window.innerWidth) p.dx *= -1;
//         if (p.y < 0 || p.y > window.innerHeight) p.dy *= -1;
//       });
//       requestAnimationFrame(animate);
//     }

//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     animate();
//   }, []);

//   // 🔹 Cursor movement tracking
//   useEffect(() => {
//     const handleMove = (e) => {
//       if (cursorVisible) setCursorPos({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener("mousemove", handleMove);
//     return () => window.removeEventListener("mousemove", handleMove);
//   }, [cursorVisible]);

//   // 🔸 Reusable Card Component
//   const Card = ({ icon, title, desc, link }) => (
//     <div
//       onClick={() => router.push(link)}
//       onMouseEnter={() => setCursorVisible(true)}
//       onMouseLeave={() => setCursorVisible(false)}
//       className="relative z-10 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,140,0,0.4)]"
//     >
//       <div className="text-5xl mb-4">{icon}</div>
//       <h3 className="text-2xl font-bold text-orange-400 mb-3">{title}</h3>
//       <p className="text-gray-400">{desc}</p>
//     </div>
//   );

//   return (
//     <div className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden px-6">
//       {/* 🔸 Particle Background */}
//       <canvas id="particles" className="absolute inset-0 z-0"></canvas>

//       {/* 🔸 Glowing Light Aura */}
//       <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-orange-500/10 blur-[180px] rounded-full"></div>

//       {/* 🔸 Navbar */}
//       <header className="absolute top-0 left-0 w-full flex justify-between items-center px-10 py-6 bg-black/50 backdrop-blur-md border-b border-zinc-800 z-20">
//         <div className="flex items-center space-x-3">
//           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(255,140,0,0.5)]">
//             ♟️
//           </div>
//           <h1 className="text-2xl font-bold text-orange-400">CheckMate</h1>
//         </div>

//         <nav className="flex space-x-8 text-gray-300 font-medium">
//           <a href="/" className="hover:text-orange-400 transition">Home</a>
//           <a href="/features" className="hover:text-orange-400 transition">Features</a>
//           <a href="/about" className="hover:text-orange-400 transition">About</a>
//         </nav>

//         <button
//           onClick={() => router.push("/login")}
//           className="px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-orange-600 to-amber-500 text-black hover:shadow-[0_0_25px_rgba(255,140,0,0.6)] hover:scale-105 transition-all duration-300"
//         >
//           Login
//         </button>
//       </header>

//       {/* 🔸 Hero Section */}
//       <main className="relative z-10 text-center mt-28 mb-10">
//         <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-orange-300 via-orange-500 to-amber-400 text-transparent bg-clip-text">
//           Choose Your Verification Mode
//         </h1>
//         <p className="text-gray-400 text-lg mb-16 max-w-2xl mx-auto">
//           Whether it’s text, a URL, or an image — CheckMate helps you uncover truth with advanced AI verification.
//         </p>

//         {/* 🔸 Verification Options */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
//           <Card
//             icon="📝"
//             title="Verify via Text"
//             desc="Paste or write text to analyze its authenticity using AI-driven language models."
//             link="/verify-text"
//           />
//           <Card
//             icon="🔗"
//             title="Verify via URL"
//             desc="Enter a webpage link to scan for factual accuracy, bias, and trustworthiness."
//             link="/verify-url"
//           />
//           <Card
//             icon="🖼️"
//             title="Verify via Image"
//             desc="Upload an image to detect deepfakes, manipulations, or misleading visuals."
//             link="/verify-image"
//           />
//         </div>
//       </main>

//       {/* 🔸 Footer */}
//       <footer className="relative z-10 w-full text-center py-6 border-t border-zinc-800 text-gray-500 bg-black/40 backdrop-blur-md">
//         © {new Date().getFullYear()} CheckMate — Powered by AI Truth Detection
//       </footer>

//       {/* 🔸 Animated Magnifying Glass Cursor */}
//       {cursorVisible && (
//         <img
//           src="/magnifyingwbg.png"
//           alt="cursor"
//           className="fixed pointer-events-none w-10 h-10 opacity-90 drop-shadow-[0_0_12px_rgba(255,140,0,0.8)] animate-rotate-slow"
//           style={{
//             left: `${cursorPos.x - 20}px`,
//             top: `${cursorPos.y - 20}px`,
//             zIndex: 50,
//           }}
//         />
//       )}

//       {/* 🔸 Rotation Animation */}
//       <style jsx>{`
//         @keyframes rotate-slow {
//           0% {
//             transform: rotate(0deg);
//           }
//           100% {
//             transform: rotate(360deg);
//           }
//         }
//         .animate-rotate-slow {
//           animation: rotate-slow 6s linear infinite;
//         }
//       `}</style>
//     </div>
//   );
// }



"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // 🔸 Particle background animation
  useEffect(() => {
    const canvas = document.getElementById("particles");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    const count = 40;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,140,0,0.5)";
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > window.innerWidth) p.dx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.dy *= -1;
      });
      requestAnimationFrame(animate);
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    animate();
  }, []);

  // 🔹 Track mouse movement only when cursor is active
  useEffect(() => {
    const handleMove = (e) => {
      if (cursorVisible) setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [cursorVisible]);

  // 🔸 Reusable verification card component
  const Card = ({ icon, title, desc, link }) => (
    <div
      onClick={() => router.push(link)}
      onMouseEnter={() => setCursorVisible(true)}
      onMouseLeave={() => setCursorVisible(false)}
      className="relative z-10 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,140,0,0.4)]"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-orange-400 mb-3">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden px-6">
      {/* Background particles */}
      <canvas id="particles" className="absolute inset-0 z-0"></canvas>

      {/* Glow backdrop */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-orange-500/10 blur-[180px] rounded-full"></div>

      {/* Navbar */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center px-10 py-6 bg-black/50 backdrop-blur-md border-b border-zinc-800 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(255,140,0,0.5)]">
            ♟️
          </div>
          <h1 className="text-2xl font-bold text-orange-400">CheckMate</h1>
        </div>

        <nav className="flex space-x-8 text-gray-300 font-medium">
          <a href="/" className="hover:text-orange-400 transition">Home</a>
          <a href="/features" className="hover:text-orange-400 transition">Features</a>
          <a href="/about" className="hover:text-orange-400 transition">About</a>
        </nav>

        <button
          onClick={() => router.push("/login")}
          className="px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-orange-700 to-orange-500 text-black hover:shadow-[0_0_25px_rgba(255,140,0,0.6)] hover:scale-105 transition-all duration-300"
        >
          Login
        </button>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 text-center mt-28 mb-10">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-orange-300 via-orange-500 to-amber-400 text-transparent bg-clip-text">
          Choose Your Verification Mode
        </h1>
        <p className="text-gray-400 text-lg mb-16 max-w-2xl mx-auto">
          Whether it’s text, a URL, or an image — CheckMate helps you uncover the truth with advanced AI verification.
        </p>

        {/* Verification Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <Card
            icon="📝"
            title="Verify via Text"
            desc="Paste or write text to analyze its authenticity using AI-driven language models."
            link="/verify-text"
          />
          <Card
            icon="🔗"
            title="Verify via URL"
            desc="Enter a webpage link to scan for factual accuracy, bias, and trustworthiness."
            link="/verify-url"
          />
          <Card
            icon="🖼️"
            title="Verify via Image"
            desc="Upload an image to detect deepfakes, manipulations, or misleading visuals."
            link="/verify-image"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center py-6 border-t border-zinc-800 text-gray-500 bg-black/40 backdrop-blur-md">
        © {new Date().getFullYear()} CheckMate — Powered by AI Truth Detection
      </footer>

      {/* Magnifying Glass Cursor */}
      {cursorVisible && (
        <img
          src="/magnifyingwbg.png"
          alt="cursor"
          className="fixed pointer-events-none w-10 h-10 opacity-90 drop-shadow-[0_0_12px_rgba(255,140,0,0.8)]"
          style={{
            left: `${cursorPos.x - 20}px`,
            top: `${cursorPos.y - 20}px`,
            zIndex: 50,
          }}
        />
      )}
    </div>
  );
}





