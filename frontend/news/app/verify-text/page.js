"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CheckPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = async () => {
    if (!input.trim()) {
      toast.error("Please enter text or a headline to verify!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();
      setResult(data);
      toast.success("Verification completed!");
    } catch (err) {
      toast.error("Error connecting to backend!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
        CheckMate News Verifier
      </h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter news text, headline, or URL..."
        className="w-full max-w-2xl h-40 p-4 rounded-xl bg-zinc-900 border border-orange-500/40 focus:border-orange-500 text-white outline-none resize-none"
      />

      <button
        onClick={handleVerify}
        disabled={loading}
        className="mt-6 px-8 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-orange-500 hover:to-amber-600 transition-all shadow-md font-semibold text-black"
      >
        {loading ? "Verifying..." : "Start Verification"}
      </button>

      {result && (
        <div className="mt-10 p-6 bg-zinc-900 rounded-2xl border border-orange-500/20 max-w-3xl w-full text-left">
          <h2 className="text-3xl font-bold mb-3">
            🧾 Result:{" "}
            <span
              className={
                result.decision === "True"
                  ? "text-green-400"
                  : result.decision === "Fake"
                  ? "text-red-500"
                  : "text-yellow-400"
              }
            >
              {result.decision}
            </span>
          </h2>

          <p className="text-lg mb-2">📊 Confidence: {result.confidence}</p>
          <p className="text-lg mb-4">💡 Reason: {result.reason}</p>

          {result.related_articles?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">🔗 Related Articles:</h3>
              <ul className="list-disc pl-6 space-y-2">
                {result.related_articles.map((art, idx) => (
                  <li key={idx}>
                    <a
                      href={art.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-400 hover:underline"
                    >
                      {art.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}




// "use client";
// import { useState, useEffect } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Confetti from "react-confetti";

// export default function VerifyTextPage() {
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [particles, setParticles] = useState([]);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [popupEmoji, setPopupEmoji] = useState(null);

//   // --- Create floating background particles ---
//   useEffect(() => {
//     const newParticles = Array.from({ length: 25 }, (_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       size: Math.random() * 4 + 1,
//       speed: Math.random() * 3 + 1,
//     }));
//     setParticles(newParticles);
//   }, []);

//   const handleVerify = async () => {
//     if (!input.trim()) {
//       toast.error("Please enter some text to verify!");
//       return;
//     }

//     setLoading(true);
//     setShowConfetti(false);
//     setPopupEmoji(null);

//     try {
//       const res = await fetch("http://127.0.0.1:5000/verify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text: input }),
//       });
//       const data = await res.json();
//       setResult(data);

//       // --- Visual feedbacks based on verdict ---
//       if (data.decision === "True") {
//         setShowConfetti(true);
//         toast.success("✅ Verified as TRUE!");
//         setPopupEmoji("🎉");
//       } else if (data.decision === "Fake") {
//         toast.error("🚨 This appears to be FAKE news!");
//         setPopupEmoji("👎");
//       } else {
//         toast.info("⚪ Could not verify confidently.");
//         setPopupEmoji("🤔");
//       }
//     } catch (err) {
//       toast.error("Error verifying news.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//       setTimeout(() => setShowConfetti(false), 3000);
//       setTimeout(() => setPopupEmoji(null), 2500);
//     }
//   };

//   const handleClear = () => {
//     setInput("");
//     setResult(null);
//     setShowConfetti(false);
//     setPopupEmoji(null);
//     toast.info("Page reset. You can verify again!");
//   };

//   return (
//     <div className="relative min-h-screen w-full bg-black text-white overflow-y-auto flex flex-col items-center justify-start py-16 px-4">
//       <ToastContainer theme="dark" position="bottom-right" />
//       {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

//       {/* ✨ Particle Background */}
//       <div className="absolute inset-0 -z-10 overflow-hidden">
//         {particles.map((p) => (
//           <div
//             key={p.id}
//             className="absolute rounded-full bg-amber-400/30 animate-float"
//             style={{
//               left: `${p.x}%`,
//               top: `${p.y}%`,
//               width: `${p.size}px`,
//               height: `${p.size}px`,
//               animationDuration: `${p.speed * 8}s`,
//               animationDelay: `${p.id * 0.3}s`,
//             }}
//           />
//         ))}
//       </div>

//       {/* Popup emoji feedback */}
//       {popupEmoji && (
//         <div className="absolute text-8xl animate-pop z-30">{popupEmoji}</div>
//       )}

//       {/* Header */}
//       <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-12 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-xl">
//         CheckMate News Verifier
//       </h1>

//       {/* Input Section */}
//       <div className="relative w-full max-w-2xl">
//         {/* Clear Button */}
//         <button
//           onClick={handleClear}
//           className="absolute right-4 -top-10 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-semibold px-4 py-2 rounded-lg shadow-md
//                      hover:from-orange-500 hover:to-amber-700 hover:shadow-[0_0_20px_rgba(255,165,0,0.4)] transition-all duration-300"
//         >
//           Clear
//         </button>

//         <textarea
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Enter a news headline, text, or statement..."
//           className="w-full h-44 p-5 rounded-2xl bg-zinc-900/80 border border-amber-500/30 
//                      focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40 outline-none 
//                      text-lg text-gray-100 placeholder-gray-500 transition-all shadow-[0_0_15px_rgba(255,165,0,0.1)]"
//         ></textarea>

//         <div className="flex justify-center">
//           <button
//             onClick={handleVerify}
//             disabled={loading}
//             className="mt-6 px-10 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-600 
//                        hover:from-orange-500 hover:to-amber-700 text-black font-bold text-lg
//                        transition-all shadow-[0_0_20px_rgba(255,165,0,0.4)] 
//                        hover:shadow-[0_0_35px_rgba(255,165,0,0.6)]"
//           >
//             {loading ? "Verifying..." : "Start Verification"}
//           </button>
//         </div>
//       </div>

//       {/* Result Section */}
//       {result && (
//         <div
//           className="mt-12 max-w-3xl w-full bg-zinc-900/90 p-8 rounded-2xl border border-amber-500/20 
//                      shadow-[0_0_15px_rgba(255,165,0,0.15)] animate-fadeIn"
//         >
//           <h2 className="text-3xl font-semibold mb-4 flex items-center gap-3">
//             🧾 Result:
//             <span
//               className={
//                 result.decision === "True"
//                   ? "text-green-400"
//                   : result.decision === "Fake"
//                   ? "text-red-500"
//                   : "text-gray-400"
//               }
//             >
//               {result.decision}
//             </span>
//           </h2>

//           <p className="text-lg text-gray-300 mb-2">
//             📊 Confidence: <span className="text-white">{result.confidence}</span>
//           </p>
//           <p className="text-lg text-gray-300 mb-4">
//             💡 Reason: <span className="text-gray-100">{result.reason}</span>
//           </p>

//           {result.related_articles?.length > 0 && (
//             <div>
//               <h3 className="text-xl font-bold text-amber-400 mb-3">
//                 🔗 Related Articles:
//               </h3>
//               <ul className="space-y-2 list-disc pl-6">
//                 {result.related_articles.map((art, idx) => (
//                   <li key={idx} className="text-gray-300 leading-relaxed">
//                     <a
//                       href={art.link}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-amber-400 hover:text-orange-300 underline-offset-4 hover:underline"
//                     >
//                       {art.title}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}

//       {/* CSS Animations */}
//       <style jsx>{`
//         @keyframes float {
//           0%,
//           100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-15px);
//           }
//         }
//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }

//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.6s ease-out;
//         }

//         @keyframes pop {
//           0% {
//             transform: scale(0);
//             opacity: 0;
//           }
//           40% {
//             transform: scale(1.2);
//             opacity: 1;
//           }
//           100% {
//             transform: scale(1);
//             opacity: 0;
//           }
//         }
//         .animate-pop {
//           animation: pop 1.8s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }



// "use client";
// import { useState, useEffect } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Confetti from "react-confetti";

// export default function VerifyTextPage() {
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [particles, setParticles] = useState([]);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [popupEmoji, setPopupEmoji] = useState(null);

//   // Floating background particles
//   useEffect(() => {
//     const newParticles = Array.from({ length: 25 }, (_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       size: Math.random() * 4 + 1,
//       speed: Math.random() * 3 + 1,
//     }));
//     setParticles(newParticles);
//   }, []);

//   const handleVerify = async () => {
//     if (!input.trim()) {
//       toast.error("Please enter some text to verify!");
//       return;
//     }

//     setLoading(true);
//     setShowConfetti(false);
//     setPopupEmoji(null);

//     try {
//       const res = await fetch("http://127.0.0.1:5000/verify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text: input }),
//       });
//       const data = await res.json();
//       setResult(data);

//       // Visual feedback based on verdict
//       if (data.decision === "True") {
//         setShowConfetti(true);
//         toast.success("✅ Verified as TRUE!");
//         setPopupEmoji("🎉");
//       } else if (data.decision === "Fake") {
//         toast.error("🚨 This appears to be FAKE news!");
//         setPopupEmoji("👎");
//       } else {
//         toast.info("⚪ Could not verify confidently.");
//         setPopupEmoji("🤔");
//       }
//     } catch (err) {
//       toast.error("Error verifying news.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//       setTimeout(() => setShowConfetti(false), 3000);
//       setTimeout(() => setPopupEmoji(null), 2500);
//     }
//   };

//   const handleClear = () => {
//     setInput("");
//     setResult(null);
//     setShowConfetti(false);
//     setPopupEmoji(null);
//     toast.info("Page reset. You can verify again!");
//   };

//   return (
//     <div className="relative min-h-screen w-full bg-black text-white overflow-y-auto flex flex-col items-center justify-start py-16 px-4">
//       <ToastContainer theme="dark" position="bottom-right" />
//       {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

//       {/* Particle background */}
//       <div className="absolute inset-0 -z-10 overflow-hidden">
//         {particles.map((p) => (
//           <div
//             key={p.id}
//             className="absolute rounded-full bg-amber-400/30 animate-float"
//             style={{
//               left: `${p.x}%`,
//               top: `${p.y}%`,
//               width: `${p.size}px`,
//               height: `${p.size}px`,
//               animationDuration: `${p.speed * 8}s`,
//               animationDelay: `${p.id * 0.3}s`,
//             }}
//           />
//         ))}
//       </div>

//       {/* Popup emoji feedback */}
//       {popupEmoji && (
//         <div className="absolute text-8xl animate-pop z-30">{popupEmoji}</div>
//       )}

//       {/* Header */}
//       <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-12 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-xl">
//         CheckMate News Verifier
//       </h1>

//       {/* Input Section */}
//       <div className="relative w-full max-w-2xl">
//         {/* Clear Button */}
//         <button
//           onClick={handleClear}
//           className="absolute right-4 -top-10 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-semibold px-4 py-2 rounded-lg shadow-md
//                      hover:from-orange-500 hover:to-amber-700 hover:shadow-[0_0_20px_rgba(255,165,0,0.4)] transition-all duration-300"
//         >
//           Clear
//         </button>

//         <textarea
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Enter a news headline, text, or statement..."
//           className="w-full h-44 p-5 rounded-2xl bg-zinc-900/80 border border-amber-500/30 
//                      focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40 outline-none 
//                      text-lg text-gray-100 placeholder-gray-500 transition-all shadow-[0_0_15px_rgba(255,165,0,0.1)]"
//         ></textarea>

//         <div className="flex justify-center">
//           <button
//             onClick={handleVerify}
//             disabled={loading}
//             className="mt-6 px-10 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-600 
//                        hover:from-orange-500 hover:to-amber-700 text-black font-bold text-lg
//                        transition-all shadow-[0_0_20px_rgba(255,165,0,0.4)] 
//                        hover:shadow-[0_0_35px_rgba(255,165,0,0.6)]"
//           >
//             {loading ? "Verifying..." : "Start Verification"}
//           </button>
//         </div>
//       </div>

//       {/* Result Section */}
//       {result && (
//         <div
//           className="mt-12 max-w-3xl w-full bg-zinc-900/90 p-8 rounded-2xl border border-amber-500/20 
//                      shadow-[0_0_15px_rgba(255,165,0,0.15)] animate-fadeIn"
//         >
//           <h2 className="text-3xl font-semibold mb-4 flex items-center gap-3">
//             <span role="img" aria-label="result">
//               🧾
//             </span>{" "}
//             Result:
//             <span
//               className={
//                 result.decision === "True"
//                   ? "text-green-400"
//                   : result.decision === "Fake"
//                   ? "text-red-500"
//                   : "text-gray-400"
//               }
//             >
//               {result.decision}
//             </span>
//           </h2>

//           <p className="text-lg text-gray-300 mb-2">
//             <span role="img" aria-label="confidence">
//               📊
//             </span>{" "}
//             Confidence: <span className="text-white">{result.confidence}</span>
//           </p>
//           <p className="text-lg text-gray-300 mb-4">
//             <span role="img" aria-label="reason">
//               💡
//             </span>{" "}
//             Reason: <span className="text-gray-100">{result.reason}</span>
//           </p>

//           {result.related_articles?.length > 0 && (
//             <div>
//               <h3 className="text-xl font-bold text-amber-400 mb-3">
//                 🔗 Related Articles:
//               </h3>
//               <ul className="space-y-2 list-disc pl-6">
//                 {result.related_articles.map((art, idx) => (
//                   <li key={idx} className="text-gray-300 leading-relaxed">
//                     <a
//                       href={art.link}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-amber-400 hover:text-orange-300 underline-offset-4 hover:underline"
//                     >
//                       {art.title}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}

//       {/* CSS Animations */}
//       <style jsx>{`
//         @keyframes float {
//           0%,
//           100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-15px);
//           }
//         }
//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }

//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.6s ease-out;
//         }

//         @keyframes pop {
//           0% {
//             transform: scale(0);
//             opacity: 0;
//           }
//           40% {
//             transform: scale(1.2);
//             opacity: 1;
//           }
//           100% {
//             transform: scale(1);
//             opacity: 0;
//           }
//         }
//         .animate-pop {
//           animation: pop 1.8s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }



// "use client";
// import { useState, useEffect } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function VerifyTextPage() {
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [particles, setParticles] = useState([]);

//   // Create subtle floating background particles
//   useEffect(() => {
//     const newParticles = Array.from({ length: 25 }, (_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       size: Math.random() * 3 + 1,
//       speed: Math.random() * 3 + 1,
//     }));
//     setParticles(newParticles);
//   }, []);

//   const handleVerify = async () => {
//     if (!input.trim()) {
//       toast.error("Please enter some text to verify!");
//       return;
//     }

//     setLoading(true);
//     setResult(null);

//     try {
//       const res = await fetch("http://127.0.0.1:5000/verify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text: input }),
//       });

//       const data = await res.json();
//       setResult(data);

//       if (data.decision === "True") {
//         toast.success("News verified as TRUE!");
//       } else if (data.decision === "Fake") {
//         toast.error("This news appears to be FAKE!");
//       } else {
//         toast.info("News could not be verified confidently.");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Error verifying the news. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClear = () => {
//     setInput("");
//     setResult(null);
//     toast.info("Page reset. You can verify again!");
//   };

//   return (
//     <div className="relative min-h-screen w-full bg-black text-white overflow-y-auto flex flex-col items-center justify-start py-16 px-4">
//       <ToastContainer theme="dark" position="bottom-right" />

//       {/* Particle background */}
//       <div className="absolute inset-0 -z-10 overflow-hidden">
//         {particles.map((p) => (
//           <div
//             key={p.id}
//             className="absolute rounded-full bg-amber-400/20 animate-float"
//             style={{
//               left: `${p.x}%`,
//               top: `${p.y}%`,
//               width: `${p.size}px`,
//               height: `${p.size}px`,
//               animationDuration: `${p.speed * 8}s`,
//               animationDelay: `${p.id * 0.2}s`,
//             }}
//           />
//         ))}
//       </div>

//       {/* Header */}
//       <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-10 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-xl">
//         CheckMate News Verifier
//       </h1>

//       {/* Input Section */}
//       <div className="relative w-full max-w-2xl">
//         {/* Clear Button */}
//         <button
//           onClick={handleClear}
//           className="absolute right-4 -top-10 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-semibold px-4 py-2 rounded-lg shadow-md
//                      hover:from-orange-500 hover:to-amber-700 hover:shadow-[0_0_20px_rgba(255,165,0,0.4)] transition-all duration-300"
//         >
//           Clear
//         </button>

//         <textarea
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Enter a news headline, text, or statement..."
//           className="w-full h-44 p-5 rounded-2xl bg-zinc-900/80 border border-amber-500/30 
//                      focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40 outline-none 
//                      text-lg text-gray-100 placeholder-gray-500 transition-all shadow-[0_0_15px_rgba(255,165,0,0.1)]"
//         ></textarea>

//         <div className="flex justify-center">
//           <button
//             onClick={handleVerify}
//             disabled={loading}
//             className="mt-6 px-10 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-600 
//                        hover:from-orange-500 hover:to-amber-700 text-black font-bold text-lg
//                        transition-all shadow-[0_0_20px_rgba(255,165,0,0.4)] 
//                        hover:shadow-[0_0_35px_rgba(255,165,0,0.6)]"
//           >
//             {loading ? "Verifying..." : "Start Verification"}
//           </button>
//         </div>
//       </div>

//       {/* Result Section */}
//       {result && (
//         <div
//           className="mt-12 max-w-3xl w-full bg-zinc-900/90 p-8 rounded-2xl border border-amber-500/20 
//                      shadow-[0_0_15px_rgba(255,165,0,0.15)] animate-fadeIn"
//         >
//           <h2 className="text-3xl font-semibold mb-4 flex items-center gap-3">
//             Result:
//             <span
//               className={
//                 result.decision === "True"
//                   ? "text-green-400"
//                   : result.decision === "Fake"
//                   ? "text-red-500"
//                   : "text-gray-400"
//               }
//             >
//               {result.decision}
//             </span>
//           </h2>

//           <p className="text-lg text-gray-300 mb-2">
//             Confidence: <span className="text-white">{result.confidence}</span>
//           </p>
//           <p className="text-lg text-gray-300 mb-4">
//             Reason: <span className="text-gray-100">{result.reason}</span>
//           </p>

//           {result.related_articles?.length > 0 && (
//             <div>
//               <h3 className="text-xl font-bold text-amber-400 mb-3">
//                 Related Articles:
//               </h3>
//               <ul className="space-y-2 list-disc pl-6">
//                 {result.related_articles.map((art, idx) => (
//                   <li key={idx} className="text-gray-300 leading-relaxed">
//                     <a
//                       href={art.link}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-amber-400 hover:text-orange-300 underline-offset-4 hover:underline"
//                     >
//                       {art.title}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}

//       {/* CSS Animations */}
//       <style jsx>{`
//         @keyframes float {
//           0%,
//           100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-15px);
//           }
//         }
//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }

//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.6s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }



