// Importaciones con tipado TypeScript
import { Search, Filter, X, Coffee, Utensils, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, ChangeEvent } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/UI/input";

// Interfaz para una persona
interface Persona {
  dni: string;
  nombres: string;
  apellidos: string;
}

// Interfaz para un empleado
interface Empleado {
  id: string;
  persona: Persona;
  cargo: string;
  salario: number;
}

// Interfaz para las props del componente
interface SearchAndFilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterCargo: string;
  setFilterCargo: (value: string) => void;
  resetFilters: () => void;
  setPage: (value: number) => void;
  filteredEmpleados: Empleado[];
  paginatedEmpleados: Empleado[];
  uniquerols: string[];
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  filterCargo,
  setFilterCargo,
  resetFilters,
  setPage,
  filteredEmpleados,
  paginatedEmpleados,
  uniquerols
}) => {
  // Estado para controlar la animación de filtro
  const [animateFilter, setAnimateFilter] = useState<boolean>(false);
  
  // Activar animación cuando cambia searchTerm o filterCargo
  useEffect(() => {
    if (searchTerm || filterCargo !== "todos") {
      setAnimateFilter(true);
      
      // Resetear el estado de animación después de completarse
      const timer = setTimeout(() => {
        setAnimateFilter(false);
      }, 4000); // 4 segundos es suficiente para que se vea la animación completa
      
      return () => clearTimeout(timer);
    }
  }, [searchTerm, filterCargo]);
  
  // Función para manejar cambios en la búsqueda con animación
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
    setPage(1);
    setAnimateFilter(true);
  };
  
  // Función para manejar cambios en el filtro con animación
  const handleFilterChange = (value: string): void => {
    setFilterCargo(value);
    setPage(1);
    setAnimateFilter(true);
  };
  
  // Función para resetear filtros y animación
  const handleResetFilters = (): void => {
    resetFilters();
    setAnimateFilter(false);
  };
  return (
    <div className="mb-6 space-y-4">
      {/* Barra principal de búsqueda y filtros */}
      <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Campo de búsqueda */}
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center h-5 w-5 rounded-full bg-amber-100 text-amber-600">
              <Search className="h-3 w-3" />
            </div>
            <Input
              placeholder="Buscar por nombre o DNI..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 border-amber-200 focus:border-amber-400 focus:ring-amber-200 text-amber-900 placeholder:text-amber-400"
            />
          </div>
          
          {/* Filtros */}
          <div className="flex gap-3">
            <Select 
              value={filterCargo} 
              onValueChange={handleFilterChange}
            >
              <SelectTrigger className="w-[180px] border-amber-200 focus:ring-amber-200 text-amber-800 bg-white">
                <div className="flex items-center gap-2">
                  <ChefHat size={14} className="text-amber-500" />
                  <SelectValue placeholder="Filtrar por cargo" />
                </div>
              </SelectTrigger>
              <SelectContent className="border-amber-200 bg-white">
                <div className="flex items-center px-2 py-1.5 text-xs text-amber-600 border-b border-amber-100 mb-1">
                  <Utensils className="h-3 w-3 mr-1.5 opacity-70" />
                  <span>Filtrar personal</span>
                </div>
                <SelectItem value="todos" className="hover:bg-amber-50 focus:bg-amber-50 text-amber-800">
                  Todos los cargos
                </SelectItem>
                {uniquerols.map((cargo) => (
                  <SelectItem 
                    key={cargo} 
                    value={cargo}
                    className="hover:bg-amber-50 focus:bg-amber-50 text-amber-800"
                  >
                    <div className="flex items-center gap-1.5">
                      {cargo.toLowerCase().includes('chef') ? (
                        <div className="h-2 w-2 rounded-full bg-red-400"></div>
                      ) : cargo.toLowerCase().includes('mozo') ? (
                        <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                      ) : cargo.toLowerCase().includes('cajero') ? (
                        <div className="h-2 w-2 rounded-full bg-green-400"></div>
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                      )}
                      {cargo}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Botón de reset */}
            {(searchTerm || filterCargo !== "todos") && (
              <Button 
                variant="outline" 
                onClick={handleResetFilters} 
                size="icon"
                className="border-amber-200 hover:bg-amber-50 text-amber-700 hover:text-amber-900"
              >
                <X size={16} />
              </Button>
            )}
          </div>
        </div>
        
        {/* Información de resultados mostrados */}
        {filteredEmpleados.length > 0 && (
          <div className="mt-3 flex items-center justify-between text-sm">
            <div className="text-amber-700 flex items-center gap-1.5">
              <Coffee className="h-3.5 w-3.5 opacity-70" />
              <span>
                Mostrando <span className="font-medium">{Math.min(filteredEmpleados.length, paginatedEmpleados.length)}</span> de <span className="font-medium">{filteredEmpleados.length}</span> empleados
              </span>
            </div>
            
            {filterCargo !== "todos" && (
              <div className="bg-amber-100 px-2 py-0.5 rounded-full text-xs text-amber-800">
                Filtrando: {filterCargo}
              </div>
            )}
          </div>
        )}
        
                {/* Línea decorativa animada cuando hay filtros aplicados */}
        <AnimatePresence>
          {(searchTerm || filterCargo !== "todos") && (
            <motion.div 
              className="mt-3 pt-3 border-t border-amber-100 flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ 
                opacity: animateFilter ? 1 : 0.7, 
                y: 0,
                transition: { duration: 0.3 }
              }}
              exit={{ opacity: 0, height: 0, marginTop: 0, paddingTop: 0 }}
            >
              <motion.div 
                className="h-1 w-1 rounded-full bg-amber-300"
                animate={animateFilter ? { 
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                } : { scale: 1, opacity: 0.7 }}
                transition={{ 
                  repeat: animateFilter ? Infinity : 0, 
                  repeatType: "reverse", 
                  duration: 1.5,
                  delay: 0
                }}
              />
              <motion.div 
                className="h-1 w-1 rounded-full bg-amber-400"
                animate={animateFilter ? { 
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                } : { scale: 1, opacity: 0.7 }}
                transition={{ 
                  repeat: animateFilter ? Infinity : 0, 
                  repeatType: "reverse", 
                  duration: 1.5,
                  delay: 0.5
                }}
              />
              <motion.div 
                className="h-1 w-1 rounded-full bg-amber-500"
                animate={animateFilter ? { 
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                } : { scale: 1, opacity: 0.7 }}
                transition={{ 
                  repeat: animateFilter ? Infinity : 0,
                  repeatType: "reverse", 
                  duration: 1.5,
                  delay: 1
                }}
              />
              <motion.div 
                className="flex items-center"
                initial={{ x: -5, opacity: 0 }}
                animate={{ 
                  x: 0, 
                  opacity: animateFilter ? 1 : 0.8,
                  transition: { delay: 0.2 }
                }}
              >
                <motion.div
                  className="text-xs text-amber-600 ml-1 flex items-center gap-1"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ 
                    width: "auto", 
                    opacity: animateFilter ? 1 : 0.8,
                    transition: { duration: 0.3, delay: 0.3 }
                  }}
                >
                  <span>Filtros aplicados</span>
                  {searchTerm && filterCargo !== "todos" && (
                    <motion.span 
                      className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-700 px-1.5 rounded-full text-[10px]"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: animateFilter ? 1 : 0.9, 
                        scale: animateFilter ? [1, 1.05, 1] : 1,
                        transition: { 
                          delay: 0.5,
                          repeat: animateFilter ? 2 : 0,
                          duration: 1
                        }
                      }}
                    >
                      <span>{filterCargo}</span>
                      <span>•</span>
                      <span>"{searchTerm}"</span>
                    </motion.span>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
 