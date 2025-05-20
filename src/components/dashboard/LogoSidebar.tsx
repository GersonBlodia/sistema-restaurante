import React from 'react';
import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';

const RestauranteLogo = ({ expanded = true }) => {
  return (
    <div className={`flex items-center py-6 ${expanded ? 'px-6' : 'justify-center'}`}>
      <div className="flex items-center">
        {/* Icon animation */}
        <motion.div
          initial={{ rotate: -20 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`${expanded ? 'mr-3' : ''} text-yellow-500`}
        >
          <Utensils size={expanded ? 28 : 22} className="text-yellow-500" />
        </motion.div>

        {/* Text animation */}
        {expanded ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col"
          >
            <span className="text-2xl font-bold text-white leading-tight">
              Restaurante
            </span>
            <span className="text-3xl font-bold text-yellow-400 leading-tight">
              Chalo
            </span>
            <div className="h-1 w-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mt-1"></div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-2xl font-bold text-yellow-400">C</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Wrapper component to demonstrate the logo in both states
export const LogoDemo = () => {
  
  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <RestauranteLogo   />
      </div>
      
    
    </div>
  );
};
 