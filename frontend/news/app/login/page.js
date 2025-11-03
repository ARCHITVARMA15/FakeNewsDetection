// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({ email: "", password: "" });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (formData.email && formData.password) {
//       router.push("/dashboard"); // redirect if fields filled
//     } else {
//       alert("Please fill in all fields");
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
//       {/* Animated background particles */}
//       <div className="absolute inset-0 z-0">
//         <canvas id="particles" className="w-full h-full"></canvas>
//       </div>

//       {/* Glowing orb accent */}
//       <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-500/20 blur-[160px] rounded-full"></div>

//       {/* Login Card */}
//       <div className="relative z-10 bg-zinc-900/60 border border-zinc-800 p-10 rounded-3xl shadow-2xl backdrop-blur-md max-w-md w-full text-center">
//         <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 mb-2">
//           CheckMate
//         </h1>
//         <p className="text-gray-400 mb-8">Welcome back. Verify smarter.</p>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="text-left">
//             <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
//             <input
//               type="email"
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               placeholder="Enter your email"
//               className="w-full p-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-orange-400 outline-none transition-all"
//             />
//           </div>

//           <div className="text-left">
//             <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
//             <input
//               type="password"
//               value={formData.password}
//               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//               placeholder="Enter your password"
//               className="w-full p-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-orange-400 outline-none transition-all"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 mt-4 font-semibold text-lg rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-yellow-500 hover:to-orange-500 transition-all shadow-[0_0_20px_rgba(255,140,0,0.4)] hover:shadow-[0_0_30px_rgba(255,140,0,0.6)]"
//           >
//             Login
//           </button>
//         </form>

//         <p className="text-sm text-gray-400 mt-6">
//           Don’t have an account?{" "}
//           <a href="/signup" className="text-orange-400 hover:text-orange-300 underline">
//             Sign up
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function LoginPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({ email: "", password: "" });

//   // ✅ Toast function with smooth gradient style
//   const notify = (msg, type = "info") => {
//     toast[type](msg, {
//       position: "top-right",
//       autoClose: 2500,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: false,
//       draggable: true,
//       theme: "dark",
//       style: {
//         background: "linear-gradient(90deg, #1a1a1a, #111)",
//         border: "1px solid #ff8c00",
//         color: "#fff",
//         boxShadow: "0 0 20px rgba(255,140,0,0.5)",
//       },
//       progressStyle: {
//         background: "linear-gradient(90deg, #ff8c00, #ffaa33)",
//       },
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (formData.email && formData.password) {
//       notify("Login successful!", "success");
//       setTimeout(() => router.push("/home"), 2000);
//     } else {
//       notify("Please fill in all fields.", "error");
//     }
//   };

//   // Optional background particle animation (classy orange glow)
//   useEffect(() => {
//     const canvas = document.getElementById("particles");
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     let particles = [];
//     const count = 30;

//     for (let i = 0; i < count; i++) {
//       particles.push({
//         x: Math.random() * window.innerWidth,
//         y: Math.random() * window.innerHeight,
//         r: Math.random() * 2 + 1,
//         dx: (Math.random() - 0.5) * 0.5,
//         dy: (Math.random() - 0.5) * 0.5,
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

//     return () => cancelAnimationFrame(animate);
//   }, []);

//   return (
//     <div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
//       {/* Subtle background particles */}
//       <canvas id="particles" className="absolute inset-0 z-10"></canvas>

//       {/* Glowing background accent */}
//       <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-500/20 blur-[160px] rounded-full"></div>

//       {/* Toast container */}
//       <ToastContainer />

//       {/* Login Card */}
//       <div className="relative z-10 bg-zinc-900/60 border border-zinc-800 p-10 rounded-3xl shadow-2xl backdrop-blur-md max-w-md w-full text-center">
//         <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 mb-2">
//           CheckMate
//         </h1>
//         <p className="text-gray-400 mb-8">Welcome back. Verify smarter.</p>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="text-left">
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData({ ...formData, email: e.target.value })
//               }
//               placeholder="Enter your email"
//               className="w-full p-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-orange-400 outline-none transition-all"
//             />
//           </div>

//           <div className="text-left">
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               value={formData.password}
//               onChange={(e) =>
//                 setFormData({ ...formData, password: e.target.value })
//               }
//               placeholder="Enter your password"
//               className="w-full p-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-orange-400 outline-none transition-all"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 mt-4 font-semibold text-lg rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-yellow-400 hover:to-orange-600 transition-all duration-300 shadow-[0_0_20px_rgba(255,140,0,0.4)] hover:shadow-[0_0_40px_rgba(255,140,0,0.7)]"
//           >
//             Login
//           </button>
//         </form>

//         <p className="text-sm text-gray-400 mt-6">
//           Don’t have an account?{" "}
//           <a
//             href="/signup"
//             className="text-orange-400 hover:text-orange-300 underline"
//           >
//             Sign up
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function LoginPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const canvasRef = useRef(null);
//   const mouse = useRef({ x: null, y: null });

//   // ✅ Toast setup
//   const notify = (msg, type = "info") => {
//     toast[type](msg, {
//       position: "top-right",
//       autoClose: 2500,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: false,
//       draggable: true,
//       theme: "dark",
//       style: {
//         background: "linear-gradient(90deg, #1a1a1a, #111)",
//         border: "1px solid #ff8c00",
//         color: "#fff",
//         boxShadow: "0 0 20px rgba(255,140,0,0.5)",
//       },
//       progressStyle: {
//         background: "linear-gradient(90deg, #ff8c00, #ffaa33)",
//       },
//     });
//   };

//   // ✅ Form handling
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (formData.email && formData.password) {
//       notify("Login successful!", "success");
//       setTimeout(() => router.push("/home"), 2000);
//     } else {
//       notify("Please fill in all fields.", "error");
//     }
//   };

//   // ✅ Particle animation + interactive cursor
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     let particles = [];
//     let animationFrameId;

//     const count = 40;
//     const particleColor = "rgba(255,140,0,0.5)";

//     function resizeCanvas() {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     }
//     resizeCanvas();
//     window.addEventListener("resize", resizeCanvas);

//     // Track mouse
//     const handleMouseMove = (e) => {
//       mouse.current.x = e.x;
//       mouse.current.y = e.y;
//     };
//     window.addEventListener("mousemove", handleMouseMove);

//     // Initialize particles
//     for (let i = 0; i < count; i++) {
//       particles.push({
//         x: Math.random() * canvas.width,
//         y: Math.random() * canvas.height,
//         r: Math.random() * 2 + 1,
//         dx: (Math.random() - 0.5) * 0.4,
//         dy: (Math.random() - 0.5) * 0.4,
//       });
//     }

//     function draw() {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       particles.forEach((p) => {
//         const distX = p.x - mouse.current.x;
//         const distY = p.y - mouse.current.y;
//         const distance = Math.sqrt(distX * distX + distY * distY);

//         // Subtle repel effect
//         if (distance < 100) {
//           p.x += distX / distance;
//           p.y += distY / distance;
//         }

//         p.x += p.dx;
//         p.y += p.dy;

//         if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
//         if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

//         ctx.beginPath();
//         ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
//         ctx.fillStyle = particleColor;
//         ctx.fill();
//       });

//       animationFrameId = requestAnimationFrame(draw);
//     }

//     draw();

//     return () => {
//       cancelAnimationFrame(animationFrameId);
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("resize", resizeCanvas);
//     };
//   }, []);

//   return (
//     <div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
//       {/* ✅ Animated particle background */}
//       <canvas
//         ref={canvasRef}
//         className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
//       />

//       {/* Subtle glow accents */}
//       <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-500/20 blur-[160px] rounded-full -z-10"></div>
//       <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-500/10 blur-[200px] rounded-full -z-10"></div>

//       <ToastContainer />

//       {/* ✅ Login card */}
//       <div className="relative z-10 bg-zinc-900/60 border border-zinc-800 p-10 rounded-3xl shadow-2xl backdrop-blur-md max-w-md w-full text-center">
//         <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 mb-2">
//           CheckMate
//         </h1>
//         <p className="text-gray-400 mb-8">Welcome back. Verify smarter.</p>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="text-left">
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData({ ...formData, email: e.target.value })
//               }
//               placeholder="Enter your email"
//               className="w-full p-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-orange-400 outline-none transition-all"
//             />
//           </div>

//           <div className="text-left">
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               value={formData.password}
//               onChange={(e) =>
//                 setFormData({ ...formData, password: e.target.value })
//               }
//               placeholder="Enter your password"
//               className="w-full p-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-orange-400 outline-none transition-all"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 mt-4 font-semibold text-lg rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-yellow-400 hover:to-orange-600 transition-all duration-300 shadow-[0_0_20px_rgba(255,140,0,0.4)] hover:shadow-[0_0_40px_rgba(255,140,0,0.7)]"
//           >
//             Login
//           </button>
//         </form>

//         <p className="text-sm text-gray-400 mt-6">
//           Don’t have an account?{" "}
//           <a
//             href="/signup"
//             className="text-orange-400 hover:text-orange-300 underline"
//           >
//             Sign up
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }



// "use client";
// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function LoginPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const canvasRef = useRef(null);

//   // ✅ Toastify configuration
//   const notify = (msg, type = "info") => {
//     toast[type](msg, {
//       position: "top-right",
//       autoClose: 2500,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: false,
//       draggable: true,
//       theme: "dark",
//       style: {
//         background: "linear-gradient(90deg, #1a1a1a, #111)",
//         border: "1px solid #ff8c00",
//         color: "#fff",
//         boxShadow: "0 0 20px rgba(255,140,0,0.5)",
//       },
//       progressStyle: {
//         background: "linear-gradient(90deg, #ff8c00, #ffaa33)",
//       },
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (formData.email && formData.password) {
//       notify("Login successful!", "success");
//       setTimeout(() => router.push("/home"), 2000);
//     } else {
//       notify("Please fill in all fields.", "error");
//     }
//   };

//   // ✅ Particle animation logic
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     let particlesArray = [];
//     const particleCount = 35;
//     const color = "rgba(255, 140, 0, 0.5)";
//     let animationFrameId;

//     function handleResize() {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     }

//     window.addEventListener("resize", handleResize);
//     handleResize();

//     // Create particles
//     for (let i = 0; i < particleCount; i++) {
//       particlesArray.push({
//         x: Math.random() * canvas.width,
//         y: Math.random() * canvas.height,
//         radius: Math.random() * 2 + 1,
//         dx: (Math.random() - 0.5) * 0.5,
//         dy: (Math.random() - 0.5) * 0.5,
//       });
//     }

//     const animate = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       particlesArray.forEach((p) => {
//         p.x += p.dx;
//         p.y += p.dy;

//         if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
//         if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

//         ctx.beginPath();
//         ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
//         ctx.fillStyle = color;
//         ctx.fill();
//       });

//       animationFrameId = requestAnimationFrame(animate);
//     };

//     animate();

//     return () => {
//       cancelAnimationFrame(animationFrameId);
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   return (
//     <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">
//       {/* ✅ Particle Background */}
//       <canvas
//         ref={canvasRef}
//         className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
//       />

//       {/* Subtle glowing effects */}
//       <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-orange-500/20 blur-[150px] rounded-full z-0"></div>
//       <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-yellow-500/10 blur-[180px] rounded-full z-0"></div>

//       {/* Toasts */}
//       <ToastContainer />

//       {/* ✅ Login Card */}
//       <div className="relative z-10 bg-zinc-900/70 border border-zinc-800 p-10 rounded-3xl shadow-[0_0_25px_rgba(255,140,0,0.2)] backdrop-blur-md max-w-md w-full text-center">
//         <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 mb-2">
//           CheckMate
//         </h1>
//         <p className="text-gray-400 mb-8">Welcome back. Verify smarter.</p>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="text-left">
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData({ ...formData, email: e.target.value })
//               }
//               placeholder="Enter your email"
//               className="w-full p-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-orange-400 outline-none transition-all"
//             />
//           </div>

//           <div className="text-left">
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               value={formData.password}
//               onChange={(e) =>
//                 setFormData({ ...formData, password: e.target.value })
//               }
//               placeholder="Enter your password"
//               className="w-full p-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-orange-400 outline-none transition-all"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 mt-4 font-semibold text-lg rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-yellow-400 hover:to-orange-600 transition-all duration-300 shadow-[0_0_20px_rgba(255,140,0,0.4)] hover:shadow-[0_0_40px_rgba(255,140,0,0.7)]"
//           >
//             Login
//           </button>
//         </form>

//         <p className="text-sm text-gray-400 mt-6">
//           Don’t have an account?{" "}
//           <a
//             href="/signup"
//             className="text-orange-400 hover:text-orange-300 underline"
//           >
//             Sign up
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const canvasRef = useRef(null);

  // Toastify notifications
  const notify = (msg, type = "info") => {
    toast[type](msg, {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "dark",
      style: {
        background: "linear-gradient(90deg, #1a1a1a, #111)",
        border: "1px solid #ff8c00",
        color: "#fff",
        boxShadow: "0 0 20px rgba(255,140,0,0.5)",
      },
      progressStyle: {
        background: "linear-gradient(90deg, #ff8c00, #ffaa33)",
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      notify("Login successful!", "success");
      setTimeout(() => router.push("/home"), 2000);
    } else {
      notify("Please fill in all fields.", "error");
    }
  };

  // ✅ Particle background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let particlesArray = [];
    const particleCount = 35;
    const color = "rgba(255, 140, 0, 0.5)";
    let animationFrameId;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    for (let i = 0; i < particleCount; i++) {
      particlesArray.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.8,
        dy: (Math.random() - 0.5) * 0.8,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = "orange";
        ctx.shadowBlur = 8;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
      {/* ✅ Animated particle background */}
      <canvas
        ref={canvasRef}
        id="particles"
        className="absolute inset-0 z-[1] pointer-events-none"
      />

      {/* Subtle glowing backdrop */}
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-orange-500/25 blur-[160px] rounded-full z-[2]" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-yellow-400/10 blur-[200px] rounded-full z-[2]" />

      {/* Toast container */}
      <ToastContainer />

      {/* ✅ Login Card */}
      <div className="relative z-[3] bg-zinc-900/70 border border-zinc-800 p-10 rounded-3xl shadow-[0_0_25px_rgba(255,140,0,0.2)] backdrop-blur-md max-w-md w-full text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 mb-2">
          CheckMate
        </h1>
        <p className="text-gray-400 mb-8">Welcome back. Verify smarter.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter your email"
              className="w-full p-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-orange-400 outline-none transition-all"
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter your password"
              className="w-full p-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-orange-400 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 font-semibold text-lg rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-yellow-400 hover:to-orange-600 transition-all duration-300 shadow-[0_0_20px_rgba(255,140,0,0.4)] hover:shadow-[0_0_40px_rgba(255,140,0,0.7)]"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-orange-400 hover:text-orange-300 underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
