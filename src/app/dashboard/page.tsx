"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  Calendar, 
  Settings, 
  Users, 
  DollarSign, 
  FileText, 
  Clock, 
  Utensils, 
  BarChart2,
  ChefHat,
  ClipboardList,
  Trash2,
  PackageOpen,
  UserCog,
  Coffee,
  Sparkles,
  Bell,
  Table,
  Receipt,
  Award,
  Flame,
  BadgePercent,
  Tag,
  ArrowUpRight
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ImprovedStatsSection } from "@/components/dashboard/uix/CardDashboard";

// Role access map that determines which features each role can access
const roleAccessMap: Record<string, string[]> = {
  Administrador: ["admin", "rrhh", "cocinero", "mesero", "limpieza", "inventario", "empleados", "mesas", "finanzas", "promociones"],
  RRHH: ["rrhh", "inventario", "empleados"],
  Cocinero: ["cocinero", "inventario", "mesas"],
  Mesero: ["mesero", "mesas", "ordenes"],
  Limpieza: ["limpieza"],
};

// Features configuration with icons, titles, descriptions, and links
const features = [
  {
    id: "admin",
    icon: <Settings className="h-6 w-6" />,
    color: "bg-gradient-to-br from-blue-500 to-blue-700",
    hoverColor: "hover:bg-blue-600",
    title: "Administración",
    description: "Panel de control administrativo",
    href: "/admin",
  },
  {
    id: "rrhh",
    icon: <UserCog className="h-6 w-6" />,
    color: "bg-gradient-to-br from-purple-500 to-purple-700",
    hoverColor: "hover:bg-purple-600",
    title: "Recursos Humanos",
    description: "Gestión de personal y planificación",
    href: "/rrhh",
  },
  {
    id: "cocinero",
    icon: <ChefHat className="h-6 w-6" />,
    color: "bg-gradient-to-br from-yellow-500 to-amber-600",
    hoverColor: "hover:bg-yellow-600",
    title: "Cocina",
    description: "Control de órdenes y preparación",
    href: "/dashboard/cocinero",
  },
  {
    id: "mesero",
    icon: <Coffee className="h-6 w-6" />,
    color: "bg-gradient-to-br from-green-500 to-green-700",
    hoverColor: "hover:bg-green-600",
    title: "Servicio",
    description: "Atención a mesas y órdenes",
    href: "/mesero",
  },
  {
    id: "limpieza",
    icon: <Trash2 className="h-6 w-6" />,
    color: "bg-gradient-to-br from-red-500 to-red-700",
    hoverColor: "hover:bg-red-600",
    title: "Limpieza",
    description: "Programación y tareas de limpieza",
    href: "/limpieza",
  },
  {
    id: "inventario",
    icon: <PackageOpen className="h-6 w-6" />,
    color: "bg-gradient-to-br from-amber-500 to-amber-700",
    hoverColor: "hover:bg-amber-600",
    title: "Inventario",
    description: "Control de productos y existencias",
    href: "/inventario",
  },
  {
    id: "empleados",
    icon: <Users className="h-6 w-6" />,
    color: "bg-gradient-to-br from-sky-500 to-sky-700",
    hoverColor: "hover:bg-sky-600",
    title: "Empleados",
    description: "Directorio y gestión de personal",
    href: "/empleados",
  },
  {
    id: "mesas",
    icon: <Table className="h-6 w-6" />,
    color: "bg-gradient-to-br from-teal-500 to-teal-700",
    hoverColor: "hover:bg-teal-600",
    title: "Mesas",
    description: "Estado y reservas de mesas",
    href: "/mesas",
  },
  {
    id: "ordenes",
    icon: <Receipt className="h-6 w-6" />,
    color: "bg-gradient-to-br from-cyan-500 to-cyan-700",
    hoverColor: "hover:bg-cyan-600",
    title: "Órdenes",
    description: "Gestión de pedidos y comandas",
    href: "/ordenes",
  },
  {
    id: "finanzas",
    icon: <BarChart2 className="h-6 w-6" />,
    color: "bg-gradient-to-br from-emerald-500 to-emerald-700",
    hoverColor: "hover:bg-emerald-600",
    title: "Finanzas",
    description: "Reportes y análisis financieros",
    href: "/finanzas",
  },
  {
    id: "promociones",
    icon: <BadgePercent className="h-6 w-6" />,
    color: "bg-gradient-to-br from-rose-500 to-rose-700",
    hoverColor: "hover:bg-rose-600",
    title: "Promociones",
    description: "Ofertas y marketing",
    href: "/promociones",
  },
];

// Stats data for quick summary section
const statsData = [
  {
    icon: <DollarSign className="h-6 w-6 text-green-600" />,
    title: "Ventas de Hoy",
    value: "$3,240.56",
    change: "+12.5%",
    isPositive: true,
    progressValue: 75,
  },
  {
    icon: <Clock className="h-6 w-6 text-blue-600" />,
    title: "Tiempo Promedio",
    value: "18 min",
    change: "-2.3 min",
    isPositive: true,
    progressValue: 65,
  },
  {
    icon: <Utensils className="h-6 w-6 text-amber-600" />,
    title: "Órdenes Activas",
    value: "24",
    change: "+8",
    isPositive: true,
    progressValue: 80,
  },
  {
    icon: <Users className="h-6 w-6 text-purple-600" />,
    title: "Clientes Hoy",
    value: "156",
    change: "+15%",
    isPositive: true,
    progressValue: 90,
  },
];

// Top menu items for tab content
const topMenuItems = [
  { name: "Rib-Eye Premium", sales: 42, price: "$320", category: "Carnes", trend: "en alza" },
  { name: "Pasta Alfredo", sales: 36, price: "$180", category: "Pastas", trend: "estable" },
  { name: "Margarita Especial", sales: 58, price: "$90", category: "Bebidas", trend: "en alza" },
  { name: "Tiramisú", sales: 25, price: "$110", category: "Postres", trend: "nuevo" },
];

// Today's reservations
const todayReservations = [
  { time: "13:30", name: "Familia Rodríguez", persons: 4, table: "Mesa 8", status: "Confirmada" },
  { time: "14:00", name: "Carlos Méndez", persons: 2, table: "Mesa 3", status: "Pendiente" },
  { time: "20:30", name: "Ana Gómez", persons: 6, table: "Mesa 12", status: "Confirmada" },
];

// Animation delays for staggered effect
const getAnimationDelay = (index: number) => {
  return `${(index + 1) * 100}ms`;
};

const DashboardPage = () => {
  const { data } = useSession();
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("general");
  const userRole = data?.user?.rol || ""; // Default to Mesero if no role found

  // Animation for progress bars
  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 500);
    return () => clearTimeout(timer);
  }, []);

  // Get current date/time for greeting
  const currentHour = new Date().getHours();
  const currentDate = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long'
  });
  
  let greeting = "Buenos días";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Buenas tardes";
  } else if (currentHour >= 18) {
    greeting = "Buenas noches";
  }

  // Filter features based on user role
  const accessibleFeatures = features.filter(feature => 
    roleAccessMap[userRole]?.includes(feature.id)
  );

  // Format the date to first letter uppercase
  const formattedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  return (
    <div className="w-full overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Welcome header with animated gradient */}
    <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-b from-gray-900 to-gray-950 p-8 text-white shadow-lg border-b-2 border-yellow-500">
      {/* Decorative elements */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-yellow-500 opacity-5"></div>
      <div className="absolute bottom-0 left-1/2 h-32 w-32 -translate-x-full rounded-full bg-blue-600 opacity-10"></div>
      <div className="absolute right-12 bottom-4 h-24 w-24 rounded-full bg-yellow-400 opacity-10"></div>
      
      <div className="flex items-center justify-between">
        <div className="relative z-10 animate-fadeIn">
          <div className="flex items-center mb-2">
            <Utensils className="h-6 w-6 text-yellow-500 mr-2" />
            <h2 className="text-lg font-medium text-white">Restaurante <span className="text-yellow-500 font-bold">Chalo</span></h2>
          </div>
          
          <h1 className="text-3xl font-bold">
            {greeting}, {data?.user?.name?.split(' ')[0] || "Usuario"}
          </h1>
          <p className="mt-1 text-lg opacity-90">{formattedDate}</p>
          
          <div className="mt-4 flex items-center gap-2">
            <Badge className="border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-sm font-medium text-white">
              <Users className="mr-1 h-4 w-4 text-yellow-400" />
              Rol: {userRole}
            </Badge>
            
            <Badge className="border-blue-600/30 bg-blue-600/10 px-3 py-1 text-sm font-medium text-white">
              <Bell className="mr-1 h-4 w-4 text-blue-400" />
              5 Notificaciones
            </Badge>
          </div>
          
          <button className="mt-6 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white shadow-md transition hover:bg-blue-700">
            Dashboard
          </button>
        </div>

        {/* Restaurant Icon */}
        <div className="relative z-10 hidden md:block">
          <div className="relative h-40 w-48 flex items-center justify-center">
            <div className="p-4 rounded-full bg-gray-800 border-2 border-yellow-500">
              <Utensils className="h-16 w-16 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>
    </div>

     <ImprovedStatsSection/>

      {/* Tabs for dashboard sections */}
      <div className="mb-6 animate-fadeIn" style={{ animationDelay: "300ms" }}>
        <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="general" className="gap-1">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="menu" className="gap-1">
              <Utensils className="h-4 w-4" />
              <span className="hidden sm:inline">Menú</span>
            </TabsTrigger>
            <TabsTrigger value="reservas" className="gap-1">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Reservas</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-4 space-y-4">
            {/* Role-based navigation cards */}
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-800">Acceso Rápido</h2>
              <Badge className="bg-blue-100 text-blue-700">
                {accessibleFeatures.length} módulos
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {accessibleFeatures.map((feature, index) => (
                <Card 
                  key={feature.id} 
                  className="group overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fadeSlideUp"
                  style={{ animationDelay: getAnimationDelay(index + 2) }}
                >
                  <CardHeader className={`flex items-center pb-2 ${feature.color} text-white`}>
                    <div className="rounded-full bg-white/20 p-3 shadow-md transition-transform duration-300 group-hover:scale-110">
                      {feature.icon}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="mt-1">{feature.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button className={`w-full transition-all duration-300 ${feature.color} ${feature.hoverColor}`} asChild>
                      <a href={feature.href}>Acceder</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="menu" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Productos Más Vendidos
                </CardTitle>
                <CardDescription>
                  Estadísticas de los platillos más populares del día
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topMenuItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border p-3 shadow-sm transition-all duration-200 hover:bg-slate-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.name}</span>
                          {item.trend === "en alza" && (
                            <Badge className="bg-green-100 text-green-700">
                              <ArrowUpRight className="mr-1 h-3 w-3" />
                              Tendencia
                            </Badge>
                          )}
                          {item.trend === "nuevo" && (
                            <Badge className="bg-blue-100 text-blue-700">
                              <Tag className="mr-1 h-3 w-3" />
                              Nuevo
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">Categoría: {item.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{item.price}</div>
                        <div className="text-sm text-slate-500">{item.sales} vendidos</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Ver menú completo</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="reservas" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Reservaciones de Hoy
                </CardTitle>
                <CardDescription>
                  Listado de reservas programadas para hoy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayReservations.map((reservation, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border p-3 shadow-sm hover:bg-slate-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{reservation.time}</span>
                          <Badge className={`${
                            reservation.status === "Confirmada" 
                              ? "bg-green-100 text-green-700" 
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {reservation.status}
                          </Badge>
                        </div>
                        <div className="mt-1 text-sm text-slate-500">{reservation.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{reservation.table}</div>
                        <div className="text-sm text-slate-500">{reservation.persons} personas</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Ver todas las reservaciones</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Today's highlights */}
      <div className="mt-8 animate-fadeSlideUp" style={{ animationDelay: "600ms" }}>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-slate-800">Destacados del Día</h2>
          <Badge className="bg-purple-100 text-purple-700">
            <Award className="mr-1 h-3 w-3" />
            Importante
          </Badge>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="shadow-md transition-all duration-300 hover:shadow-lg">
            <CardHeader className="border-b bg-slate-50 pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Calendar className="h-5 w-5" />
                Eventos Próximos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="rounded-lg border bg-white p-3 shadow-sm transition-all duration-200 hover:shadow">
                  <div className="flex justify-between">
                    <div className="font-medium">Reunión de personal</div>
                    <Badge variant="outline" className="bg-blue-50">Hoy</Badge>
                  </div>
                  <div className="mt-1 text-sm text-slate-500">15:00 - Sala de reuniones</div>
                </div>
                <div className="rounded-lg border bg-white p-3 shadow-sm transition-all duration-200 hover:shadow">
                  <div className="flex justify-between">
                    <div className="font-medium">Capacitación nuevo menú</div>
                    <Badge variant="outline" className="bg-purple-50">Mañana</Badge>
                  </div>
                  <div className="mt-1 text-sm text-slate-500">10:00 - Cocina principal</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50">
              <Button variant="outline" className="w-full">Ver todos los eventos</Button>
            </CardFooter>
          </Card>

          <Card className="shadow-md transition-all duration-300 hover:shadow-lg">
            <CardHeader className="border-b bg-slate-50 pb-3">
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <FileText className="h-5 w-5" />
                Anuncios Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="rounded-lg border bg-blue-50 p-3 text-blue-700 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Nuevo sistema de inventario</div>
                    <Badge variant="secondary" className="bg-blue-200">Actualización</Badge>
                  </div>
                  <div className="mt-1 text-sm opacity-90">Se ha implementado una actualización en el sistema de inventario. Revisa la guía.</div>
                </div>
                <div className="rounded-lg border bg-amber-50 p-3 text-amber-700 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Promoción del fin de semana</div>
                    <Badge variant="secondary" className="bg-amber-200">Promoción</Badge>
                  </div>
                  <div className="mt-1 text-sm opacity-90">Recuerda la promoción 2x1 en cócteles de 18:00 a 20:00 hrs.</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50">
              <Button variant="outline" className="w-full">Ver todos los anuncios</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeSlideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-fadeSlideUp {
          opacity: 0;
          animation: fadeSlideUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;