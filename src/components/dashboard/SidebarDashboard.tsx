"use client"
// First, I'll create role-specific menu configurations
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut, 
  Home,
  Folder,
  CreditCard,
  MessageSquare,
  PieChart,
  Database,
  User,
  ShoppingCart,
  Coffee,
  Utensils,
  Briefcase,
  ClipboardList,
  BarChart2,
  Bell
} from 'lucide-react';
import { LogoDemo } from './LogoSidebar';
import { logout } from '@/actions/auth/logout';
import { signOut } from 'next-auth/react';

// Types definition for our sidebar menu structure
interface SubMenuItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
  path: string;
  subItems?: SubMenuItem[];
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: SubMenuItem[];
}

// Role-specific menu configurations
const getMenuItemsByRole = (rol: string): MenuItem[] => {
  // Default items all roles should see
  const defaultItems: MenuItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <Home size={20} />,
      path: '/dashboard'
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings size={20} />,
      path: '/settings'
    }
  ];

  // Administrator has access to everything
  if (rol === "Administrador") {
    return [
      ...defaultItems,
      {
        id: 'Inventario',
        title: 'Inventario',
        icon: <ShoppingCart size={20} />,
        subItems: [
          {
            id: 'all-inventory',
            title: 'Ver Inventario',
            path: '/inventario/all'
          },
          {
            id: 'new-item',
            title: 'Nuevo Item',
            path: '/inventario/new'
          },
          {
            id: 'proveedores',
            title: 'Proveedores',
            icon: <Folder size={18} />,
            path: '/inventario/proveedores',
            subItems: [
              {
                id: 'ver-proveedores',
                title: 'Ver Proveedores',
                path: '/inventario/proveedores/all'
              },
              {
                id: 'nuevo-proveedor',
                title: 'Nuevo Proveedor',
                path: '/inventario/proveedores/new'
              }
            ]
          }
        ]
      },
      {
        id: 'personal',
        title: 'Personal',
        icon: <Users size={20} />,
        subItems: [
          {
            id: 'all-staff',
            title: 'Todo el Personal',
            path: '/personal/all'
          },
          {
            id: 'schedules',
            title: 'Horarios',
            path: '/personal/schedules'
          }
        ]
      },
      {
        id: 'appointments',
        title: 'Reservaciones',
        icon: <Calendar size={20} />,
        path: '/reservaciones'
      },
      {
        id: 'reports',
        title: 'Reportes',
        icon: <FileText size={20} />,
        subItems: [
          {
            id: 'analytics',
            title: 'Analítica',
            path: '/reports/analytics',
            icon: <PieChart size={18} />,
          },
          {
            id: 'financial',
            title: 'Finanzas',
            path: '/reports/financial',
            icon: <CreditCard size={18} />,
          }
        ]
      },
      {
        id: 'RRHH',
        title: 'Recursos Humanos',
        icon: <Briefcase size={20} />,
        path: '/dashboard/rrhh',
        subItems: [
          {
            id: 'empleados',
            title: 'Empleados',
            path: '/dashboard/rrhh/empleados'
          },
          {
            id: 'contratar',
            title: 'Contratar',
            path: '/dashboard/rrhh/contratar'
          },
          {
            id: 'persona',
            title: 'Personal',
            icon: <Folder size={18} />,
            path: '/dashboard/rrhh/persona',
            subItems: [
              {
                id: 'crear-personal',
                title: 'Crear Personal',
                path: '/dashboard/rrhh/persona/crear'
              },
              {
                id: 'crear-empleado',
                title: 'Crear Empleado',
                path: '/dashboard/rrhh/persona/empleado'
              },
              {
                id: 'supervision',
                title: 'Supervisión',
                path: '/dashboard/rrhh/persona/supervision'
              },
            ]
          }
        ]
      },
      {
        id: 'database',
        title: 'Database',
        icon: <Database size={20} />,
        path: '/database'
      }
    ];
  }

  // Cook menu items
  if (rol === "Cocinero") {
    return [
      ...defaultItems,
      {
        id: 'kitchen',
        title: 'Cocina',
        icon: <Utensils size={20} />,
        subItems: [
          {
            id: 'orders',
            title: 'Órdenes Pendientes',
            path: '/cocina/ordenes',
            icon: <ClipboardList size={18} />
          },
          {
            id: 'recipes',
            title: 'Recetas',
            path: '/cocina/recetas'
          }
        ]
      },
      {
        id: 'Inventario',
        title: 'Inventario',
        icon: <ShoppingCart size={20} />,
        subItems: [
          {
            id: 'check-inventory',
            title: 'Consultar Inventario',
            path: '/inventario/check'
          },
          {
            id: 'request-items',
            title: 'Solicitar Items',
            path: '/inventario/request'
          }
        ]
      }
    ];
  }

  // Waiter menu items
  if (rol === "Mesero") {
    return [
      ...defaultItems,
      {
        id: 'tables',
        title: 'Mesas',
        icon: <Coffee size={20} />,
        path: '/mesas'
      },
      {
        id: 'orders',
        title: 'Órdenes',
        icon: <ClipboardList size={20} />,
        subItems: [
          {
            id: 'active-orders',
            title: 'Órdenes Activas',
            path: '/ordenes/activas'
          },
          {
            id: 'new-order',
            title: 'Nueva Orden',
            path: '/ordenes/nueva'
          }
        ]
      },
      {
        id: 'menu',
        title: 'Menú',
        icon: <FileText size={20} />,
        path: '/menu'
      }
    ];
  }

  // Cleaning staff menu items
  if (rol === "Limpieza") {
    return [
      ...defaultItems,
      {
        id: 'cleaning-tasks',
        title: 'Tareas de Limpieza',
        icon: <ClipboardList size={20} />,
        path: '/limpieza/tareas'
      },
      {
        id: 'inventory-cleaning',
        title: 'Inventario Limpieza',
        icon: <ShoppingCart size={20} />,
        path: '/limpieza/inventario'
      }
    ];
  }

  // Assistant menu items
  if (rol === "Asistente") {
    return [
      ...defaultItems,
      {
        id: 'reservations',
        title: 'Reservaciones',
        icon: <Calendar size={20} />,
        path: '/reservaciones'
      },
      {
        id: 'customers',
        title: 'Clientes',
        icon: <Users size={20} />,
        path: '/clientes'
      },
      {
        id: 'notifications',
        title: 'Notificaciones',
        icon: <Bell size={20} />,
        path: '/notificaciones'
      }
    ];
  }

  // Human Resources menu items
  if (rol === "RRHH") {
    return [
      ...defaultItems,
      {
        id: 'RRHH',
        title: 'Recursos Humanos',
        icon: <Briefcase size={20} />,
        path: '/dashboard/rrhh',
        subItems: [
          {
            id: 'empleados',
            title: 'Empleados',
            path: '/dashboard/rrhh/empleados'
          },
          {
            id: 'contratar',
            title: 'Contratar',
            path: '/dashboard/rrhh/contratar'
          },
          {
            id: 'persona',
            title: 'Personal',
            icon: <Folder size={18} />,
            path: '/dashboard/rrhh/persona',
            subItems: [
              {
                id: 'crear-personal',
                title: 'Crear Personal',
                path: '/dashboard/rrhh/persona/crear'
              },
              {
                id: 'crear-empleado',
                title: 'Crear Empleado',
                path: '/dashboard/rrhh/persona/empleado'
              },
              {
                id: 'supervision',
                title: 'Supervisión',
                path: '/dashboard/rrhh/persona/supervision'
              },
            ]
          }
        ]
      },
      {
        id: 'attendance',
        title: 'Asistencia',
        icon: <Calendar size={20} />,
        path: '/rrhh/asistencia'
      },
      {
        id: 'payroll',
        title: 'Nómina',
        icon: <CreditCard size={20} />,
        path: '/rrhh/nomina'
      },
      {
        id: 'reports-hr',
        title: 'Reportes',
        icon: <BarChart2 size={20} />,
        path: '/rrhh/reportes'
      }
    ];
  }

  // Default fallback menu for unknown roles
  return defaultItems;
};

// Sidebar component
export const SidebardDashboard: React.FC<{ rol: string }> = ({ rol }) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [activePath, setActivePath] = useState<string>('/dashboard');
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const router = useRouter();
  
  // Get menu items based on user role
  const menuItems = getMenuItemsByRole(rol);

  // Toggle sidebar expansion
  const toggleSidebar = () => {
    setExpanded(!expanded);
    
    // Close all submenus when collapsing the sidebar
    if (expanded) {
      setOpenMenus({});
    }
  };

  // Toggle submenu
  const toggleSubmenu = (id: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Check if a menu has open children
  const hasOpenChildren = (id: string): boolean => {
    return openMenus[id] || false;
  };

  // Check if a menu or submenu is active
  const isActive = (path?: string): boolean => {
    if (!path) return false;
    return activePath === path;
  };

  // Find if any child in the submenu tree is active
  const hasActiveChild = (items?: SubMenuItem[]): boolean => {
    if (!items) return false;
    
    return items.some(item => 
      isActive(item.path) || hasActiveChild(item.subItems)
    );
  };

  // Handle menu click
  const handleMenuClick = (path?: string) => {
    if (path) {
      setActivePath(path);
    }
  };
  
  // Get item background color based on state and level
  const getItemBackgroundColor = (
    item: MenuItem | SubMenuItem, 
    active: boolean, 
    isOpen: boolean, 
    level: number,
    hasActiveChildren: boolean
  ): string => {
    if (active) {
      return 'bg-blue-700 text-white'; // Active item
    }

    if (isOpen || hasActiveChildren) {
      return level === 0 ? 'bg-gray-900 text-amber-500' : 'bg-blue-800/70 text-white'; // Open item
    }

    return level === 0 ? 'text-white hover:bg-blue-900' : 'text-gray-300 hover:bg-blue-700/50'; // Default state
  };

  // Recursive menu renderer for handling nested menus
  const renderMenuItems = (items: MenuItem[] | SubMenuItem[], level = 0, parentIndex = ''): React.ReactNode => {
    return items.map((item, index) => {
      const hasSubItems = item.subItems && item.subItems.length > 0;
      const isMenuOpen = hasOpenChildren(item.id);
      const active = isActive(item.path);
      const hasActiveChildren = hasActiveChild(item.subItems);
      const itemIndex = parentIndex ? `${parentIndex}.${index + 1}` : `${index + 1}`;
    
      const bgColorClass = getItemBackgroundColor(item, active, isMenuOpen, level, hasActiveChildren);

      return (
        <div key={item.id} className="w-full relative">
          {/* Main menu item */}
          <div
            className={`${pathname===item.path? 'bg-amber-600': ''}flex items-center justify-between w-full px-3 py-2 cursor-pointer transition-all duration-300 ${bgColorClass} ${level === 0 ? 'rounded-none' : ''}`}
            onClick={() => {
              if (hasSubItems) {
                toggleSubmenu(item.id);
              } else {
                router.push(item.path!); 
              }
            }}
          >
            <div className="flex items-center space-x-3">
              {level === 0 ? (
                /* Top level menu item with icon */
                <div className={`${!expanded ? 'mx-auto' : ''}`}>
                  {item.icon}
                </div>
              ) : (
                /* Submenu item with connector */
                <div className="flex items-center" >
                  {/* Horizontal connector line */}
                  <div className="w-3 h-0.5 bg-white mr-1"></div>
                  {/* Connector dot */}
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
              )}
              
              {(expanded || level > 0) && (
                <motion.span
                  initial={level === 0 ? { opacity: 0 } : undefined}
                  animate={level === 0 ? { opacity: 1 } : undefined}
                  exit={level === 0 ? { opacity: 0 } : undefined}
                  className="font-medium flex items-center"
                >
                  {hasSubItems && level > 0 && <Folder size={16} className="mr-2 text-blue-300" />}
                  {item.title}
                  {item.subItems && item.subItems.length > 0 && level > 0 && (
                    <span className="ml-2 text-xs text-blue-300">({item.subItems.length})</span>
                  )}
                </motion.span>
              )}
            </div>
            
            {/* Chevron for items with subitems */}
            {hasSubItems && (expanded || level > 0) && (
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={16} className="text-blue-300" />
              </motion.div>
            )}
          </div>

          {/* Submenu items with connecting lines */}
          {hasSubItems && (
            <AnimatePresence>
              {(isMenuOpen && (expanded || level > 0)) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden relative ml-6"
                >
                  {/* Vertical line connector */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500"></div>
                  
                  <div className="py-1">
                    {renderMenuItems(item.subItems!, level + 1, level === 0 ? `${index + 1}` : itemIndex)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      );
    });
  };

  return (
    <motion.div
      animate={{ width: expanded ? '260px' : '80px' }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-gray-800 text-amber-500 relative flex flex-col shadow-lg"
    >
      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleSidebar}
        className="absolute -right-3 top-12 bg-blue-700 p-1.5 rounded-full text-amber-500 shadow-md z-10"
      >
        <motion.div animate={{ rotate: expanded ? 0 : 180 }} transition={{ duration: 0.3 }}>
          {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </motion.div>
      </motion.button>

      {/* Logo section */}
      <div className="p-4 flex items-center">
        <LogoDemo />
        
      </div>

      {/* Menu container with scroll */}
      <div className="flex-1 overflow-y-auto py-0 px-0">
        <div className="flex flex-col">
          {renderMenuItems(menuItems)}
        </div>
      </div>

      {/* Footer with sign out button */}
      <div className={`p-4 border-t border-blue-800/30 ${expanded ? '' : 'flex justify-center'}`}>
        <button 

        onClick={()=>signOut({callbackUrl:'/auth/log'})}
          className={`cursor-pointer flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-amber-500 transition-all duration-300 hover:bg-red-600 hover:text-white ${expanded ? '' : 'justify-center'}`}
        >
          <LogOut size={20} />
          {expanded && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-medium"
            >
              Sign Out
            </motion.span>
          )}
        </button>
      </div>
    </motion.div>
  );
};