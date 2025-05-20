"use client"
 
 
import { useSidebarState } from '@/store/useSidebar';
import { useEffect, useState } from 'react';
import {   SidebardDashboard } from '../dashboard/SidebarDashboard';
import { HeaderDashboardLog } from '../dashboard/header/HeaderDashboardLog';
import { Session } from 'next-auth';

interface Props{ 
      children: React.ReactNode;
       session: Session | null;

}
const DashboardLayout = ({ children, session }:Props) => {
 const  { isActive,setIsActive}=useSidebarState();
 console.log("Este es tu session", {session})
 const [isMobile, setIsMobile] = useState(false);
 
 useEffect(() => {
  const handleResize = () => {
    const width = window.innerWidth;
    setIsMobile(width < 768);
    setIsActive(width >= 1024);
  };

  handleResize();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
const toggleSidebar = () => {
  setIsActive(!isActive);
};

    // Acceso al rol
  const rol = session?.user?.rol;
  return (
    <div className="flex min-h-screen bg-gray-50">
    {/* Sidebar wrapper with your transition code */}
    <div className={`fixed left-0   transition-all z-40 h-full w-64 transform   duration-200 ease-in-out
  ${isActive ? 'translate-x-0' : '-translate-x-full'}
  lg:${isActive ? 'translate-x-0' : '-translate-x-full'}    
    `}>

        {/* Render distinto por rol */}
        {rol === "Administrador" ? (
<SidebardDashboard rol={session?.user?.rol ?? 'SinRol'} />
        ) : rol === "Cocinero" ? (
         <SidebardDashboard rol={session?.user?.rol ?? 'SinRol'} />

        ) : rol === "RRHH" ? (
      <SidebardDashboard rol={session?.user?.rol ?? 'SinRol'} />

        ) : (
          <SidebardDashboard rol={session?.user?.rol ?? 'SinRol'} />
        )}
    </div>
    
    {/* Main content area */}
    <main className={`flex-1 transition-all duration-200 ease-in-out ${
      isActive ? (isMobile ? 'ml-0' : 'ml-64') : 'ml-0'
    } p-6`}>
      <HeaderDashboardLog handleIsActive={toggleSidebar}  isOpen={isActive}/>
      {children}
    </main>
  </div>
  );
};

export default DashboardLayout;