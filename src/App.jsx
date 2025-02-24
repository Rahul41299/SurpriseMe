import './App.css'
import { useState } from "react";
import { motion } from "framer-motion";

function App() {
  const [bgColor, setBgColor] = useState("#f8f9fa");
  const [message, setMessage] = useState("Click for a surprise!");

  const messages = [
    "You are awesome! 😎",
    "Did you drink water today? 💧",
    "Boom! You just got surprised! 🎉",
    "A cat is watching you... 🐱",
    "Dance like nobody's watching! 💃🕺"
  ];

  const colors = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff"];

  const playSound = () => {
    const audio = new Audio("https://www.fesliyanstudios.com/play-mp3/4386");
    audio.play();
  };

  const handleSurprise = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setBgColor(randomColor);
    setMessage(randomMessage);
    playSound();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen transition-all" style={{ backgroundColor: bgColor }}>
      <motion.h1
        className="text-4xl font-bold mb-6"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5 }}
      >
        {message}
      </motion.h1>
      <button onClick={handleSurprise} className="text-lg px-6 py-3 bg-blue-500 text-white rounded-2xl shadow-md hover:bg-blue-600">
        Surprise Me!
      </button>
    </div>
  );
}

export default App
