// "use client";

// import React, { useState, useEffect } from "react";

// export default function Leaderboard() {
//   const [url, setUrl] = useState("");
//   const [text, setText] = useState("");
//   const [image, setImage] = useState(null);
//   const [result, setResult] = useState(null);
//   const [isScanning, setIsScanning] = useState(false);
//   const [particles, setParticles] = useState([]);

//   // Create floating particles
//   useEffect(() => {
//     const newParticles = Array.from({ length: 25 }, (_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       size: Math.random() * 4 + 1,
//       speed: Math.random() * 3 + 1,
//       color: Math.random() > 0.5 ? "from-amber-400/40" : "from-rose-400/40",
//     }));
//     setParticles(newParticles);
//   }, []);

//   const handleImageUpload = (e) => {
//     setImage(e.target.files[0]);
//   };

//   const handleCheck = () => {
//     setIsScanning(true);

//     // Simulate scanning animation
//     setTimeout(() => {
//       setIsScanning(false);
//       setResult({
//         verdict: Math.random() > 0.5 ? "Fake" : "Real",
//         confidence: Math.floor(Math.random() * 30) + 70,
//         explanation:
//           Math.random() > 0.5
//             ? "This news contains misleading claims flagged by multiple fact-check sources."
//             : "This content appears to be credible based on our AI analysis and trusted sources.",
//       });
//     }, 3000);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center text-white relative overflow-hidden bg-slate-950">
//       {/* Background Gradient and Particles */}
//       <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-amber-900/10">
//         <div className="absolute inset-0 opacity-[0.03] grid-lines"></div>

//         {/* Floating particles */}
//         {particles.map((particle) => (
//           <div
//             key={particle.id}
//             className={`absolute rounded-full bg-gradient-to-r ${particle.color} to-orange-300/30 animate-float`}
//             style={{
//               left: `${particle.x}%`,
//               top: `${particle.y}%`,
//               width: `${particle.size}px`,
//               height: `${particle.size}px`,
//               animationDelay: `${particle.id * 0.3}s`,
//               animationDuration: `${particle.speed * 8}s`,
//             }}
//           />
//         ))}

//         {/* Animated gradient orbs */}
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-500/10 to-purple-600/10 rounded-full filter blur-3xl animate-pulse"></div>
//         <div
//           className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-rose-500/15 to-orange-400/10 rounded-full filter blur-3xl animate-pulse"
//           style={{ animationDelay: "1.5s" }}
//         ></div>
//         <div
//           className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-violet-500/10 to-amber-400/10 rounded-full filter blur-3xl animate-pulse"
//           style={{ animationDelay: "2.5s" }}
//         ></div>
//       </div>

//       {/* Navbar */}
//       <header className="relative z-20 w-full flex justify-between items-center px-8 py-6 bg-slate-900/40 backdrop-blur-2xl border-b border-amber-500/20">
//         <div className="flex items-center space-x-3">
//           <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/20">
//             <span className="text-2xl font-bold">♟️</span>
//           </div>
//           <h1 className="text-3xl font-black bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
//             CheckMate
//           </h1>
//         </div>

//         <nav className="hidden md:flex space-x-10">
//           {["Home", "About", "Features", "Contact"].map((item) => (
//             <a
//               key={item}
//               href="#"
//               className="relative text-slate-300 hover:text-amber-300 transition-all duration-300 group font-semibold tracking-wide"
//             >
//               {item}
//               <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 group-hover:w-full transition-all duration-500"></span>
//             </a>
//           ))}
//         </nav>

//         <a
//           href="/login"
//           className="relative px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 rounded-2xl font-bold overflow-hidden group shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/40 transition-all duration-500"
//         >
//           <span className="relative z-10">Sign In</span>
//           <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//         </a>
//       </header>

//       {/* Hero Section */}
//       <section className="text-center mt-24 max-w-5xl px-4 relative z-10">
//         <h2 className="text-7xl font-black mb-6 bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 bg-clip-text text-transparent animate-gradient-x drop-shadow-2xl">
//           CHECKMATE
//         </h2>
//         <p className="text-2xl text-slate-300 mb-6 leading-relaxed font-light">
//           Check the news.{" "}
//           <span className="font-semibold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
//             Win against fakes.
//           </span>
//         </p>
//         <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
//           Unleash advanced AI to detect misinformation in real-time. Your
//           ultimate move in the chess game against fake news.
//         </p>
//       </section>

//       {/* Main Scanner Interface */}
//       <div className="relative z-10 w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 mb-16 mt-8">
//         <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/15 to-orange-500/15 rounded-3xl blur-2xl"></div>
//         <div className="relative bg-slate-900/50 backdrop-blur-2xl rounded-3xl border border-amber-500/20 shadow-2xl p-8">
//           {isScanning && (
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-400 animate-scan rounded-t-3xl shadow-lg shadow-amber-400/30"></div>
//           )}

//           <label className="block text-left text-amber-300 font-bold text-xl mb-6 uppercase tracking-wider flex items-center">
//             🌐 Enter News URL
//           </label>
//           <div className="flex gap-4">
//             <input
//               type="url"
//               value={url}
//               onChange={(e) => setUrl(e.target.value)}
//               placeholder="https://example.com/suspicious-news"
//               className="flex-1 px-6 py-5 bg-slate-800/40 border-2 border-amber-500/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all duration-500"
//             />
//             <button
//               onClick={handleCheck}
//               disabled={isScanning}
//               className="relative px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 rounded-2xl font-black overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/40 transition-all duration-500 min-w-[180px]"
//             >
//               {isScanning ? (
//                 <div className="flex items-center space-x-3">
//                   <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
//                   <span className="font-bold">SCANNING...</span>
//                 </div>
//               ) : (
//                 <>
//                   <span className="relative z-10">VERIFY NOW</span>
//                   <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Result Card */}
//       {result && (
//         <div
//           className={`relative z-10 w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 mb-20 transform transition-all duration-1000 ${
//             result.verdict === "Fake" ? "animate-shake" : "animate-bounce-in"
//           }`}
//         >
//           <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-2xl"></div>
//           <div
//             className={`relative backdrop-blur-2xl rounded-3xl border-2 p-10 shadow-2xl ${
//               result.verdict === "Fake"
//                 ? "border-rose-500/50 bg-rose-500/10"
//                 : "border-emerald-500/50 bg-emerald-500/10"
//             }`}
//           >
//             <div className="text-center relative z-10">
//               <div className="text-7xl mb-6">
//                 {result.verdict === "Fake" ? "🚨" : "✅"}
//               </div>
//               <h3
//                 className={`text-5xl font-black mb-8 uppercase tracking-wider ${
//                   result.verdict === "Fake"
//                     ? "text-rose-400"
//                     : "text-emerald-400"
//                 }`}
//               >
//                 {result.verdict} NEWS DETECTED
//               </h3>
//               <p className="text-xl text-slate-200 font-medium leading-relaxed mb-8">
//                 {result.explanation}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Footer */}
//       <footer className="relative z-10 w-full text-center text-slate-400 text-sm py-12 border-t border-amber-500/10 bg-slate-900/40 backdrop-blur-2xl mt-auto">
//         <p className="text-slate-500 text-sm">
//           © 2025 CheckMate. Defending truth in the digital age.
//         </p>
//       </footer>

//       {/* Inline styles */}
//       <style jsx>{`
//         @keyframes gradient-x {
//           0%,
//           100% {
//             background-position: 0% 50%;
//           }
//           50% {
//             background-position: 100% 50%;
//           }
//         }
//         .animate-gradient-x {
//           background-size: 200% 200%;
//           animation: gradient-x 3s ease infinite;
//         }

//         @keyframes scan {
//           0% {
//             transform: translateX(-100%);
//           }
//           100% {
//             transform: translateX(400%);
//           }
//         }
//         .animate-scan {
//           animation: scan 2s linear infinite;
//         }

//         @keyframes float {
//           0%,
//           100% {
//             transform: translateY(0px) rotate(0deg);
//           }
//           50% {
//             transform: translateY(-20px) rotate(180deg);
//           }
//         }
//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }

//         @keyframes shake {
//           0%,
//           100% {
//             transform: translateX(0);
//           }
//           25% {
//             transform: translateX(-5px);
//           }
//           75% {
//             transform: translateX(5px);
//           }
//         }
//         .animate-shake {
//           animation: shake 0.5s ease-in-out;
//         }

//         .grid-lines {
//           background-image: linear-gradient(
//               rgba(251, 191, 36, 0.05) 1px,
//               transparent 1px
//             ),
//             linear-gradient(
//               90deg,
//               rgba(251, 191, 36, 0.05) 1px,
//               transparent 1px
//             );
//           background-size: 50px 50px;
//         }
//       `}</style>
//     </div>
//   );
// }






// "use client";

// import React, { useState, useEffect } from "react";

// export default function Home() {
//   const [url, setUrl] = useState("");
//   const [text, setText] = useState("");
//   const [image, setImage] = useState(null);
//   const [result, setResult] = useState(null);
//   const [isScanning, setIsScanning] = useState(false);
//   const [particles, setParticles] = useState([]);

//   // Floating particles
//   useEffect(() => {
//     const newParticles = Array.from({ length: 25 }, (_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       size: Math.random() * 4 + 1,
//       speed: Math.random() * 3 + 1,
//       color: Math.random() > 0.5 ? "from-amber-400/40" : "from-rose-400/40",
//     }));
//     setParticles(newParticles);
//   }, []);

//   const handleImageUpload = (e) => setImage(e.target.files[0]);

//   const handleCheck = () => {
//     setIsScanning(true);
//     setTimeout(() => {
//       setIsScanning(false);
//       setResult({
//         verdict: Math.random() > 0.5 ? "Fake" : "Real",
//         confidence: Math.floor(Math.random() * 30) + 70,
//         explanation:
//           Math.random() > 0.5
//             ? "This news contains misleading claims flagged by multiple fact-check sources."
//             : "This content appears credible based on AI and verified sources.",
//       });
//     }, 3000);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center text-white relative overflow-hidden bg-slate-950">
//       {/* Background */}
//       <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-amber-900/10">
//         <div className="absolute inset-0 opacity-[0.03] grid-lines"></div>
//         {particles.map((p) => (
//           <div
//             key={p.id}
//             className={`absolute rounded-full bg-gradient-to-r ${p.color} to-orange-300/30 animate-float`}
//             style={{
//               left: `${p.x}%`,
//               top: `${p.y}%`,
//               width: `${p.size}px`,
//               height: `${p.size}px`,
//               animationDelay: `${p.id * 0.3}s`,
//               animationDuration: `${p.speed * 8}s`,
//             }}
//           />
//         ))}
//       </div>

//       {/* Navbar */}
//       <header className="relative z-20 w-full flex justify-between items-center px-8 py-6 bg-slate-900/40 backdrop-blur-2xl border-b border-amber-500/20">
//         <div className="flex items-center space-x-3">
//           <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/20">
//             <span className="text-2xl font-bold">♟️</span>
//           </div>
//           <h1 className="text-3xl font-black bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
//             CheckMate
//           </h1>
//         </div>
//         <nav className="hidden md:flex space-x-10">
//           {["Home", "About", "Features", "Contact"].map((item) => (
//             <a
//               key={item}
//               href="#"
//               className="relative text-slate-300 hover:text-amber-300 transition-all duration-300 group font-semibold tracking-wide"
//             >
//               {item}
//               <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 group-hover:w-full transition-all duration-500"></span>
//             </a>
//           ))}
//         </nav>
//         <a
//           href="/login"
//           className="relative px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 rounded-2xl font-bold overflow-hidden group shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/40 transition-all duration-500"
//         >
//           <span className="relative z-10">Sign In</span>
//           <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//         </a>
//       </header>

//       {/* Hero */}
//       <section className="text-center mt-24 max-w-5xl px-4 relative z-10">
//         <h2 className="text-7xl font-black mb-6 bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 bg-clip-text text-transparent animate-gradient-x drop-shadow-2xl">
//           CHECKMATE
//         </h2>
//         <p className="text-2xl text-slate-300 mb-6 font-light">
//           Check the news.{" "}
//           <span className="font-semibold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
//             Win against fakes.
//           </span>
//         </p>
//         <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
//           Unleash AI to detect misinformation in real-time — your move in the
//           game against fake news.
//         </p>
//       </section>

//       {/* Input Section */}
//       <div className="relative z-10 w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 mb-16 mt-8">
//         {isScanning && (
//           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-400 animate-scan rounded-t-3xl shadow-lg shadow-amber-400/30"></div>
//         )}
//         <div className="bg-slate-900/60 backdrop-blur-2xl border border-amber-500/20 rounded-3xl shadow-2xl p-8">
//           <label className="block text-left text-amber-300 font-bold text-xl mb-6 uppercase flex items-center">
//             🌐 Enter News URL
//           </label>
//           <div className="flex gap-4">
//             <input
//               type="url"
//               value={url}
//               onChange={(e) => setUrl(e.target.value)}
//               placeholder="https://example.com/article"
//               className="flex-1 px-6 py-5 bg-slate-800/40 border-2 border-amber-500/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all duration-500"
//             />
//             <button
//               onClick={handleCheck}
//               disabled={isScanning}
//               className="relative px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 rounded-2xl font-black text-lg shadow-2xl shadow-amber-500/30 hover:scale-105 transition-all duration-500"
//             >
//               {isScanning ? "SCANNING..." : "VERIFY NOW"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Text + Image Inputs */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 mb-20 relative z-10">
//         {/* Text */}
//         <div className="bg-slate-900/60 border border-amber-500/20 p-8 rounded-3xl backdrop-blur-2xl">
//           <h3 className="text-2xl font-bold text-amber-300 mb-4">Text Check 📝</h3>
//           <textarea
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             placeholder="Paste the news article or claim..."
//             rows="5"
//             className="w-full px-5 py-4 bg-slate-800/40 border border-amber-500/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all"
//           />
//           <button
//             onClick={handleCheck}
//             className="mt-4 w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-bold rounded-2xl hover:scale-105 transition-all"
//           >
//             ANALYZE TEXT
//           </button>
//         </div>

//         {/* Image */}
//         <div className="bg-slate-900/60 border border-orange-500/20 p-8 rounded-3xl backdrop-blur-2xl">
//           <h3 className="text-2xl font-bold text-orange-300 mb-4">Image Check 🖼️</h3>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageUpload}
//             className="block w-full text-sm text-slate-400 mb-4"
//           />
//           {image && (
//             <p className="text-amber-300 text-sm mb-2">Selected: {image.name}</p>
//           )}
//           <button
//             onClick={handleCheck}
//             className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-900 font-bold rounded-2xl hover:scale-105 transition-all"
//           >
//             SCAN IMAGE
//           </button>
//         </div>
//       </div>

//       {/* Result Card */}
//       {result && (
//         <div
//           className={`relative z-10 w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 mb-20 transition-all duration-1000 ${
//             result.verdict === "Fake" ? "animate-shake" : "animate-bounce-in"
//           }`}
//         >
//           <div
//             className={`p-10 rounded-3xl border-2 backdrop-blur-2xl shadow-2xl ${
//               result.verdict === "Fake"
//                 ? "border-rose-500/50 bg-rose-500/10"
//                 : "border-emerald-500/50 bg-emerald-500/10"
//             }`}
//           >
//             <div className="text-center">
//               <div className="text-7xl mb-6">
//                 {result.verdict === "Fake" ? "🚨" : "✅"}
//               </div>
//               <h3
//                 className={`text-5xl font-black mb-8 ${
//                   result.verdict === "Fake"
//                     ? "text-rose-400"
//                     : "text-emerald-400"
//                 }`}
//               >
//                 {result.verdict} NEWS DETECTED
//               </h3>
//               <div className="mb-8">
//                 <p className="text-xl text-slate-200">{result.explanation}</p>
//                 <p className="mt-4 text-amber-300 font-bold text-lg">
//                   Confidence: {result.confidence}%
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Footer */}
//       <footer className="text-center text-slate-400 text-sm py-12 border-t border-amber-500/10 bg-slate-900/40 backdrop-blur-2xl mt-auto w-full">
//         <p>© 2025 CheckMate. Defending truth in the digital age.</p>
//       </footer>

//       {/* Animations */}
//       <style jsx>{`
//         @keyframes gradient-x {
//           0%, 100% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//         }
//         .animate-gradient-x {
//           background-size: 200% 200%;
//           animation: gradient-x 3s ease infinite;
//         }
//         @keyframes scan {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(400%); }
//         }
//         .animate-scan {
//           animation: scan 2s linear infinite;
//         }
//         @keyframes float {
//           0%, 100% { transform: translateY(0px) rotate(0deg); }
//           50% { transform: translateY(-20px) rotate(180deg); }
//         }
//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           25% { transform: translateX(-5px); }
//           75% { transform: translateX(5px); }
//         }
//         .animate-shake {
//           animation: shake 0.5s ease-in-out;
//         }
//         .grid-lines {
//           background-image: linear-gradient(
//               rgba(251, 191, 36, 0.05) 1px,
//               transparent 1px
//             ),
//             linear-gradient(
//               90deg,
//               rgba(251, 191, 36, 0.05) 1px,
//               transparent 1px
//             );
//           background-size: 50px 50px;
//         }
//       `}</style>
//     </div>
//   );
// }




"use client";

import React, { useState, useEffect } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [particles, setParticles] = useState([]);

  // Floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 3 + 1,
      color: Math.random() > 0.5 ? "from-amber-400/40" : "from-rose-400/40",
    }));
    setParticles(newParticles);
  }, []);

  const handleImageUpload = (e) => setImage(e.target.files[0]);

  const handleCheck = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setResult({
        verdict: Math.random() > 0.5 ? "Fake" : "Real",
        confidence: Math.floor(Math.random() * 30) + 70,
        explanation:
          Math.random() > 0.5
            ? "This news contains misleading claims flagged by multiple fact-check sources."
            : "This content appears credible based on AI and verified sources.",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center text-white relative overflow-hidden bg-slate-950">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-amber-900/10">
        {particles.map((p) => (
          <div
            key={p.id}
            className={`absolute rounded-full bg-gradient-to-r ${p.color} to-orange-300/30 animate-float`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.id * 0.3}s`,
              animationDuration: `${p.speed * 8}s`,
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <header className="relative z-20 w-full flex justify-between items-center px-8 py-6 bg-slate-900/40 backdrop-blur-2xl border-b border-amber-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/20">
            <span className="text-2xl font-bold">♟️</span>
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
            CheckMate
          </h1>
        </div>
        <nav className="hidden md:flex space-x-10">
          {["Home", "About", "Features", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              className="relative text-slate-300 hover:text-amber-300 transition-all duration-300 group font-semibold tracking-wide"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 group-hover:w-full transition-all duration-500"></span>
            </a>
          ))}
        </nav>
        <a
          href="/login"
          className="relative px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 rounded-2xl font-bold overflow-hidden group shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/40 transition-all duration-500"
        >
          <span className="relative z-10">Sign In</span>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </a>
      </header>

      {/* Hero */}
      <section className="text-center mt-24 max-w-5xl px-4 relative z-10">
        <h2 className="text-7xl font-black mb-6 bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 bg-clip-text text-transparent animate-gradient-x drop-shadow-2xl">
          CHECKMATE
        </h2>
        <p className="text-2xl text-slate-300 mb-6 font-light">
          Check the news.{" "}
          <span className="font-semibold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
            Win against fakes.
          </span>
        </p>
        <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
          Unleash AI to detect misinformation in real-time — your move in the
          game against fake news.
        </p>
      </section>

      {/* Input Section */}
      <div className="relative z-10 w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 mb-16 mt-8">
        {isScanning && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-400 animate-scan rounded-t-3xl shadow-lg shadow-amber-400/30"></div>
        )}
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-amber-500/20 rounded-3xl shadow-2xl p-8">
          <label className="block text-left text-amber-300 font-bold text-xl mb-6 uppercase flex items-center">
            🌐 Enter News URL
          </label>
          <div className="flex gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="flex-1 px-6 py-5 bg-slate-800/40 border-2 border-amber-500/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all duration-500"
            />
            <button
              onClick={handleCheck}
              disabled={isScanning}
              className="relative px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 rounded-2xl font-black text-lg shadow-2xl shadow-amber-500/30 hover:scale-105 transition-all duration-500"
            >
              {isScanning ? "SCANNING..." : "VERIFY NOW"}
            </button>
          </div>
        </div>
      </div>

      {/* Text + Image Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 mb-20 relative z-10">
        {/* Text */}
        <div className="bg-slate-900/60 border border-amber-500/20 p-8 rounded-3xl backdrop-blur-2xl">
          <h3 className="text-2xl font-bold text-amber-300 mb-4">Text Check 📝</h3>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the news article or claim..."
            rows="5"
            className="w-full px-5 py-4 bg-slate-800/40 border border-amber-500/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all"
          />
          <button
            onClick={handleCheck}
            className="mt-4 w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-bold rounded-2xl hover:scale-105 transition-all"
          >
            ANALYZE TEXT
          </button>
        </div>

        {/* Image */}
        <div className="bg-slate-900/60 border border-orange-500/20 p-8 rounded-3xl backdrop-blur-2xl">
          <h3 className="text-2xl font-bold text-orange-300 mb-4">Image Check 🖼️</h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-slate-400 mb-4"
          />
          {image && (
            <p className="text-amber-300 text-sm mb-2">Selected: {image.name}</p>
          )}
          <button
            onClick={handleCheck}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-900 font-bold rounded-2xl hover:scale-105 transition-all"
          >
            SCAN IMAGE
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Articles Scanned", value: "1.2M+", icon: "📊", color: "text-amber-400" },
            { label: "Accuracy Rate", value: "96.8%", icon: "🎯", color: "text-emerald-400" },
            { label: "Response Time", value: "<2s", icon: "⚡", color: "text-orange-400" },
            { label: "Trust Score", value: "A+", icon: "🛡️", color: "text-rose-400" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-slate-900/60 backdrop-blur-2xl border border-amber-500/10 p-6 rounded-2xl text-center shadow-lg hover:shadow-amber-500/20 transition-all duration-500"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
              <p className="text-slate-300 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center text-slate-400 text-sm py-12 border-t border-amber-500/10 bg-slate-900/40 backdrop-blur-2xl mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg font-bold">♟️</span>
            </div>
            <h3 className="text-2xl font-black bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
              CheckMate
            </h3>
          </div>
          <p className="text-slate-300 font-semibold mb-4 text-lg">
            Check the news. Win against fakes.
          </p>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Your ultimate defense against misinformation. Powered by advanced AI and a
            commitment to truth.
          </p>
          <div className="flex justify-center space-x-8 flex-wrap mb-6">
            {[
              "Privacy Policy",
              "Terms of Service",
              "Contact",
              "API Docs",
              "GitHub",
              "Blog",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="text-slate-400 hover:text-amber-300 transition-colors duration-300 hover:underline font-medium"
              >
                {item}
              </a>
            ))}
          </div>
          <p className="text-slate-500 text-sm">
            © 2025 CheckMate. Defending truth in the digital age.
          </p>
        </div>
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
