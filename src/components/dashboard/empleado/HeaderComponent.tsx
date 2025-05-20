"use client"
import React, { useState, useEffect } from 'react';
import { Bell, Search, ChevronDown, Menu, Utensils, User, Settings, LogOut, Home, BarChart, ShoppingCart, Calendar, Users, FileText } from 'lucide-react';
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/useUserStore';

export const AnimatedHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user } = useUserStore()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu || showMobileMenu || showNotification) {
        // Close menus if clicking outside their containers
        const isOutsideClick = !event.target.closest('.profile-menu-container') && 
                              !event.target.closest('.mobile-menu-container') &&
                              !event.target.closest('.notification-container');
        
        if (isOutsideClick) {
          setShowProfileMenu(false);
          setShowMobileMenu(false);
          setShowNotification(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu, showMobileMenu, showNotification]);
  
  // Show notification after 2 seconds for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.header 
      className={` bg-white p-4 transition-all duration-300 z-50 shadow-xl shadow-gray-300 ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo and Restaurant Name */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center mr-3"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <Utensils size={20} className="text-white" />
            </motion.div>
            <div>
              <motion.h1 
                className="text-xl font-bold text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                La Bella Cucina
              </motion.h1>
              <motion.p 
                className="text-xs text-amber-600 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Panel de Control
              </motion.p>
            </div>
          </motion.div>
          
          {/* Search Bar */}
          <motion.div 
            className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 flex-1 max-w-md mx-6"
            initial={{ opacity: 0, width: "60%" }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Search size={18} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Buscar cualquier cosa" 
              className="bg-transparent border-none outline-none w-full text-sm text-gray-700"
            />
          </motion.div>
          
          {/* Right Section - Notifications and User */}
          <div className="flex items-center">
            {/* Notification Bell */}
            <motion.div 
              className="relative notification-container"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <button 
                className="p-2 rounded-full hover:bg-gray-100 relative"
                onClick={() => setShowNotification(!showNotification)}
              >
                <Bell size={20} />
                {showNotification && (
                  <motion.span 
                    className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ delay: 0.2 }}
                  />
                )}
              </button>
              
              {/* Notification Dropdown */}
              <AnimatePresence>
                {showNotification && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-2 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Alert className="mb-2 bg-amber-50 border-amber-200">
                      <AlertTitle className="text-amber-700 text-sm font-medium">Nueva Reserva</AlertTitle>
                      <AlertDescription className="text-amber-600 text-xs">
                        Mesa para 4 personas - 20:30h
                      </AlertDescription>
                    </Alert>
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertTitle className="text-blue-700 text-sm font-medium">Actualización de Inventario</AlertTitle>
                      <AlertDescription className="text-blue-600 text-xs">
                        Nuevos ingredientes recibidos
                      </AlertDescription>
                    </Alert>
                    <div className="mt-2 text-center">
                      <a href="#" className="text-xs text-amber-600 hover:underline font-medium">Ver todas las notificaciones</a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* Menu Button (Mobile) */}
            <motion.div className="mobile-menu-container">
              <motion.button 
                className="md:hidden ml-4 p-2 rounded-full hover:bg-gray-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu size={20} />
              </motion.button>
              
              {/* Mobile Menu Dropdown */}
              <AnimatePresence>
                {showMobileMenu && (
                  <motion.div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div 
                      className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl"
                      initial={{ x: 300 }}
                      animate={{ x: 0 }}
                      exit={{ x: 300 }}
                      transition={{ type: 'spring', damping: 25 }}
                    >
                      <div className="p-4 border-b flex items-center">
                        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          CM
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium">{user?.nombres}</p>
                          <p className="text-xs text-gray-500">Gerente Ejecutivo</p>
                        </div>
                      </div>
                      
                      <nav className="p-4">
                        <ul className="space-y-4">
                          {[
                            { icon: <Home size={18} />, label: 'Dashboard', active: true },
                            { icon: <Calendar size={18} />, label: 'Reservaciones' },
                            { icon: <ShoppingCart size={18} />, label: 'Pedidos' },
                            { icon: <FileText size={18} />, label: 'Menú' },
                            { icon: <BarChart size={18} />, label: 'Informes' },
                            { icon: <Users size={18} />, label: 'Personal' },
                            { icon: <Settings size={18} />, label: 'Configuración' },
                          ].map((item, index) => (
                            <motion.li 
                              key={index}
                              whileHover={{ x: 5 }}
                              className={`flex items-center rounded-lg p-2 cursor-pointer ${
                                item.active ? 'bg-amber-50 text-amber-700' : 'hover:bg-gray-100'
                              }`}
                            >
                              <span className={`${item.active ? 'text-amber-700' : 'text-gray-500'}`}>
                                {item.icon}
                              </span>
                              <span className={`ml-3 ${item.active ? 'font-medium' : ''}`}>
                                {item.label}
                              </span>
                            </motion.li>
                          ))}
                        </ul>
                      </nav>
                      
                      <div className="border-t p-4">
                        <button className="flex items-center text-gray-600 hover:text-red-500 w-full">
                          <LogOut size={18} className="mr-2" />
                          <span>Cerrar sesión</span>
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* User Profile */}
            <motion.div 
              className="ml-4 flex items-center profile-menu-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <motion.div 
                  className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  whileHover={{ backgroundColor: "#f59e0b" }}
                >
                  CM
                </motion.div>
                <div className="ml-2 hidden md:block">
                  <motion.p 
                    className="text-sm font-medium"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                     {user?.rol=="ADMIN"? `Administrador ${user.nombres}` : `Cocinero  ${user?.nombres}`}
                  </motion.p>
                  <motion.p 
                    className="text-xs text-gray-500"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    Gerente Ejecutivo
                  </motion.p>
                </div>
                <motion.div 
                  className="ml-1"
                  animate={showProfileMenu ? { rotate: 180 } : { rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={16} className="text-gray-400" />
                </motion.div>
              </div>
              
              {/* Profile Dropdown */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    className="absolute right-4 top-14 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-3 border-b border-gray-100 bg-amber-50">
                      <p className="text-sm font-medium">Chef Mario</p>
                      <p className="text-xs text-gray-500">chef.mario@bellacucina.com</p>
                    </div>
                    <ul>
                      {[
                        { icon: <User size={16} />, label: 'Mi Perfil' },
                        { icon: <Settings size={16} />, label: 'Configuración' },
                      ].map((item, index) => (
                        <motion.li 
                          key={index}
                          whileHover={{ backgroundColor: '#f9fafb' }}
                          className="border-b border-gray-100 last:border-b-0"
                        >
                          <a href="#" className="flex items-center p-3 hover:bg-gray-50">
                            <span className="text-gray-500">{item.icon}</span>
                            <span className="ml-3 text-sm">{item.label}</span>
                          </a>
                        </motion.li>
                      ))}
                      <motion.li 
                        whileHover={{ backgroundColor: '#fef2f2' }}
                      >
                        <a href="#" className="flex items-center p-3 text-red-600 hover:bg-red-50">
                          <LogOut size={16} />
                          <span className="ml-3 text-sm">Cerrar sesión</span>
                        </a>
                      </motion.li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
        
        {/* Desktop Menu Navigation */}
        <motion.nav 
          className="hidden md:block mt-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <ul className="flex space-x-1">
            {[
              { label: 'Dashboard', active: true },
              { label: 'Reservaciones' },
              { label: 'Pedidos' },
              { label: 'Menú' },
              { label: 'Informes' },
              { label: 'Personal' },
            ].map((item, index) => (
              <motion.li 
                key={index}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <a
                  href="#"
                  className={`px-3 py-2 text-sm rounded-md inline-block ${
                    item.active 
                      ? 'bg-amber-100 text-amber-800 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.nav>
      </div>
    </motion.header>
  );
};

 