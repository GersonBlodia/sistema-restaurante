'use client'

import { useState } from "react";
import {   Settings, Mail, ChevronDown, Bell, Cloud, LogOut, LifeBuoy, Github, Plus, CreditCard, User, Keyboard, Users, UserPlus, MessageSquare, PlusCircle } from "lucide-react";
import Image from "next/image";
 
import { motion } from "framer-motion"; // Importa motion
 
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MenuButton } from "./ButtonMenu";
 
 

interface Props {
  handleIsActive: () => void;
  isOpen: boolean;
}

export const HeaderDashboardLog = ({ handleIsActive, isOpen }: Props) => {
  
  const user = {
    id: 1, 
    name: "Gerson Vera", 
    img: "/perfil/programador-concentrado-ordenador-oficina.jpg", 
    notifications: 2,
    email: "gerson.vera@example.com",
    role: "Desarrollador"
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto py-3 px-4 lg:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MenuButton
            isOpen={isOpen}
            toggle={handleIsActive}
          />
          <h1 className="text-xl font-semibold text-gray-800 hidden md:block">Dashboard</h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-3 md:gap-5">
          {/* Language Selector */}
           
          {/* Notifications */}
          <NotificationBell count={user.notifications} />
          
          {/* Messages/Notes */}
          <NotesApp userEmail={user.email} />
          
          {/* Settings */}
          <ConfigDropdown />
          
          {/* User Profile */}
          <UserProfile user={user} />
        </nav>
      </div>
    </header>
  );
};

 

// Notifications Component
const NotificationBell = ({ count }) => {
  return (
    <Popover>
    <PopoverTrigger className="relative text-gray-600 hover:text-gray-900 transition">
      <Bell size={20} />
      {count > 0 && (
        <div className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white rounded-full">
          {count}
        </div>
      )}
    </PopoverTrigger>
    <PopoverContent className="w-80 p-0">
      {/* Motion Animation with framer-motion */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-medium">Notificaciones</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
            <p className="text-sm font-medium">Nueva actualización disponible</p>
            <p className="text-xs text-gray-500 mt-1">Hace 10 minutos</p>
          </div>
        </div>
      </motion.div>
    </PopoverContent>
  </Popover>
  );
};

//seleccionar lenguaje 
// Notes App Component for Messages
const NotesApp = ({ userEmail }) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const handleSendEmail = (e) => {
    e.preventDefault();
    // Here you would implement your email sending logic
    alert(`Email from ${userEmail} with subject: ${subject} has been sent!`);
    setSubject("");
    setContent("");
  };

  return (
    <Popover>
      <PopoverTrigger className="text-gray-600 hover:text-gray-900 transition">
        <Mail size={20} />
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-3 border-b border-gray-100">
          <h3 className="font-medium">Notas y Mensajes</h3>
        </div>
        <form onSubmit={handleSendEmail} className="p-3">
          <div className="mb-3">
            <label htmlFor="email-subject" className="block text-xs font-medium mb-1">
              Asunto
            </label>
            <input
              id="email-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
              placeholder="Asunto del mensaje"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email-content" className="block text-xs font-medium mb-1">
              Mensaje
            </label>
            <textarea
              id="email-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm h-24"
              placeholder="Escribe tu mensaje aquí..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm transition"
          >
            Enviar mensaje
          </button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

// Config Dropdown Component
const ConfigDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition focus:outline-none">
        <Settings size={20} />
        <ChevronDown size={16} />
      </DropdownMenuTrigger>
      {/* Aquí agregamos una animación */}
      <DropdownMenuContent align="end" className="w-48">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          <DropdownMenuLabel>Configuración</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            Perfil de usuario
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            Preferencias
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            Tema de interfaz
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-red-500">
            Cerrar sesión
          </DropdownMenuItem>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// User Profile Component
const UserProfile = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
          <Image
            src={user.img}
            alt={user.name}
            className="w-full h-full object-cover"
            width={64}
            height={64}
          />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-800 line-clamp-1">{user.name}</p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56  ">
          <DropdownMenuLabel className="text-white" >My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="  text-white">
            <DropdownMenuItem>
              <User />
              <span>Profile</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard />
              <span>Billing</span>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings />
              <span>Settings</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Keyboard />
              <span>Keyboard shortcuts</span>
              <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup  >
            <DropdownMenuItem className="text-white">
              <Users />
              <span>Team</span>
            </DropdownMenuItem  >
            <DropdownMenuSub   >
              <DropdownMenuSubTrigger>
                <UserPlus />
                <span className="">Invite users</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem className="text-white">
                    <Mail />
                    <span>Email</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquare />
                    <span>Message</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <PlusCircle />
                    <span>More...</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem className="text-white"> 
              <Plus />
              <span>New Team</span>
              <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-white">
            <Github />
            <span>GitHub</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-white">
            <LifeBuoy />
            <span>Support</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="text-white">
            <Cloud />
            <span>API</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-white">
            <LogOut />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
     
    </DropdownMenu>
  );
};