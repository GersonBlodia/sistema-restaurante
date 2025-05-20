"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuButtonProps {
  isOpen: boolean;
  toggle: () => void;
  className?: string;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ isOpen, toggle, className = "" }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Animation variants for the button
  const buttonVariants = {
    closed: { 
      scale: 1,
      boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.12)" 
    },
    open: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)" 
    },
    hover: {
      scale: 1.1,
      boxShadow: "0px 8px 15px rgba(79, 70, 229, 0.3)"
    }
  };

  // Style classes based on state and device
  const baseClasses = "flex items-center justify-center rounded-full transition-all duration-300";
  const mobileClasses = isMobile ? "fixed top-4 right-4 z-50 p-3" : "p-3";
  const colorClasses = isOpen 
    ? "bg-white text-indigo-600 shadow-lg" 
    : "bg-gradient-to-br from-indigo-500 to-indigo-700 text-white";
  
  const combinedClasses = `${baseClasses} ${mobileClasses} ${colorClasses} ${className}`;

  return (
    <motion.button
      className={combinedClasses}
      onClick={toggle}
      variants={buttonVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <CloseIcon key="close" />
        ) : (
          <MenuIcon key="menu" />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Dynamic animated menu icon
const MenuIcon = () => (
  <motion.div
    initial={{ opacity: 0, rotate: -45 }}
    animate={{ opacity: 1, rotate: 0 }}
    exit={{ opacity: 0, rotate: 45 }}
    transition={{ duration: 0.3 }}
    className="relative w-6 h-6"
  >
    {[0, 1, 2].map((line) => (
      <motion.span
        key={line}
        className="absolute left-0 w-full h-0.5 bg-current rounded-full"
        initial={{ 
          y: line * 8 - 8,
          scaleX: line === 1 ? 0.8 : 1
        }}
        animate={{ 
          y: line * 8 - 8,
          scaleX: line === 1 ? 0.8 : 1
        }}
        style={{
          top: "50%",
          transformOrigin: "center"
        }}
      />
    ))}
  </motion.div>
);

// Dynamic animated close icon
const CloseIcon = () => (
  <motion.div
    initial={{ opacity: 0, rotate: 45 }}
    animate={{ opacity: 1, rotate: 0 }}
    exit={{ opacity: 0, rotate: -45 }}
    transition={{ duration: 0.3 }}
    className="relative w-6 h-6"
  >
    <motion.span
      className="absolute top-1/2 left-0 w-full h-0.5 bg-current rounded-full"
      style={{ 
        transformOrigin: "center",
        transform: "rotate(45deg)"
      }}
    />
    <motion.span
      className="absolute top-1/2 left-0 w-full h-0.5 bg-current rounded-full"
      style={{ 
        transformOrigin: "center",
        transform: "rotate(-45deg)"
      }}
    />
  </motion.div>
);

 