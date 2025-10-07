// import React from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";

// // Helper para animar letra por letra con efecto onda y cambio de color
// const AnimatedLetters = ({ text }) => {
//   return (
//     <span className="inline-block">
//       {text.split("").map((char, index) => (
//         <motion.span
//           key={index}
//           className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-400 to-white"
//           initial={{ y: 0, color: "#ffffff" }}
//           animate={{
//             y: [0, -10, 0], // movimiento oscilante
//             color: ["#ffffff", "#00ffff", "#ffffff"], // blanca → celeste → blanca
//           }}
//           transition={{
//             y: { repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: index * 0.1 },
//             color: { delay: index * 0.1, repeat: Infinity, duration: 1.5, repeatType: "loop" },
//           }}
//         >
//           {char}
//         </motion.span>
//       ))}
//     </span>
//   );
// };

// // Partículas de fondo
// const Particle = ({ size, x, y, delay }) => (
//   <motion.div
//     className="absolute rounded-full bg-blue-400 opacity-30"
//     style={{ width: size, height: size, top: y, left: x }}
//     animate={{ y: [0, -20, 0] }}
//     transition={{ repeat: Infinity, duration: 4 + Math.random() * 4, delay }}
//   />
// );

// function Landing() {
//   return (
//     <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white overflow-hidden">

//       {/* Fondo con partículas */}
//       {Array.from({ length: 15 }).map((_, i) => (
//         <Particle
//           key={i}
//           size={`${5 + Math.random() * 5}px`}
//           x={`${Math.random() * 100}%`}
//           y={`${Math.random() * 100}%`}
//           delay={Math.random() * 5}
//         />
//       ))}

//       {/* Título animado letra por letra */}
//       <h1 className="text-6xl font-extrabold drop-shadow-[2px_2px_8px_rgba(0,0,0,0.8)]">
//         <AnimatedLetters text="Palabra Argentina" />
//       </h1>

//       {/* Botón animado */}
//       <Link to="/home">
//         <motion.button
//           className="mt-12 px-8 py-3 bg-red-600 hover:bg-red-500 rounded-lg text-white font-semibold text-lg shadow-lg"
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.95 }}
//           animate={{ y: [0, -5, 0] }}
//           transition={{ repeat: Infinity, duration: 2 }}
//         >
//           Enter
//         </motion.button>
//       </Link>
//     </div>
//   );
// }

// export default Landing;
