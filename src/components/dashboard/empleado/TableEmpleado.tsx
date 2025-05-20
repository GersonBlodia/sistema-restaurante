"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search,   Eye, Edit, Trash2, Check, X, ChevronLeft, ChevronRight, ChevronDown, User, Coffee, Utensils, UserPlus, ChefHat, Users } from "lucide-react"

// UI Components
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
 
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
 
import {
  Card,
  CardContent,
  CardDescription,
 
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
 
// Store and Services
 
 
 
import { Input } from "@/components/UI/input"
import { usePersonaStore } from "@/store/usePersonaStore"
import { useEmpleadoStore } from "@/store/useEmpleadoStore"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/UI/dialog"
import { PersonaModal } from "./modal/ComponentModal"
 
import { SearchAndFilterBar } from "./SearchFilterBar"
import { getPersonaPorDni, getPersonasDisponibles, PersonaDTO } from "@/actions/empleado/get-persona"
import { Empleado, registrarEmpleado } from "@/actions/empleado/registrarEmpleado"
import { actualizarEmpleado } from "@/actions/empleado/actualizarEmpleado"
import { obtenerEmpleados } from "@/actions/empleado/get-empleado"
import { eliminarEmpleado } from "@/actions/empleado/eliminarEmpleado"

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
}

const listItemVariant = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.3 }
  }),
  exit: { opacity: 0, x: 10, transition: { duration: 0.2 } }
}

const schema = z.object({
  dni: z.string().min(8, "DNI inválido"),
  rol: z.string().min(3, "El rol debe tener al menos 3 caracteres"),
  fechaContrato: z.string().min(1, "Fecha de contrato es requerida"),
  sueldo: z.number().min(0, "Debe ser un sueldo válido"),
})

type FormValues = z.infer<typeof schema>

interface EmpleadoFormProps {
  modo: "crear" | "editar"
  empleado?: Empleado | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function EmpleadoForm({ modo, empleado, onSuccess, onCancel }: EmpleadoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const [personas, setPersonas] = useState<PersonaDTO[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState<PersonaDTO | null>(null)
  const [loading, setLoading] = useState(false)

  const { setPersona } = usePersonaStore()
  const { setSuccess, setError, successMessage, errorMessage } = useEmpleadoStore()

  useEffect(() => {
    setLoading(true)
    getPersonasDisponibles()
       
  }, [])

  useEffect(() => {
    if (modo === "editar" && empleado) {
      setValue("dni", empleado.persona.dni)
      setValue("rol", empleado.rol)
      setValue("fechaContrato", empleado.fechaContrato)
      setValue("sueldo", empleado.sueldo)
      setSelectedPersona(empleado.persona)
    } else {
      reset()
      setSelectedPersona(null)
    }
  }, [modo, empleado, setValue, reset])

  const handleDniSelect = async (dni: string) => {
    setValue("dni", dni)
    try {
      setLoading(true)
      const persona = await getPersonaPorDni(+dni)
      setSelectedPersona(persona)
      setPersona(persona!)
      setModalOpen(true)
      setLoading(false)
    } catch (e) {
      console.error(e)
      setError("Error al cargar datos de la persona")
      setLoading(false)
    }
  }

  const onSubmit = async (data: FormValues) => {
    try {
      if (modo === "crear") {
        await registrarEmpleado(data)
        setSuccess("Empleado registrado correctamente")
      } else if (modo === "editar" && empleado) {
        await actualizarEmpleado(empleado.id, data)
        setSuccess("Empleado actualizado correctamente")
      }
      reset()
      setSelectedPersona(null)
      if (onSuccess) onSuccess()
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeIn}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {modo === "crear" && (
          <div className="space-y-2">
            <Label htmlFor="dni" className="text-sm font-medium">
              DNI
            </Label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                  disabled={loading}
                >
                  {loading ? (
                    <Skeleton className="h-5 w-full" />
                  ) : selectedPersona ? (
                    <>
                      <span>{selectedPersona.dni}</span>
                      <span>-</span>
                      <span className="ml-2 truncate max-w-[200px]">
                        {selectedPersona.nombre} {selectedPersona.apellidos}
                      </span>
                    </>
                  ) : (
                    "Seleccione una persona"
                  )}
                </Button>
              </PopoverTrigger>
             <PopoverContent className="w-[350px] p-0 border-amber-200 shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-amber-700 to-amber-600 py-2 px-3 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 opacity-80" />
          <span className="text-sm font-serif">Seleccionar Persona</span>
        </div>
        <Coffee className="h-4 w-4 opacity-60" />
      </div>
      
      <Command className="bg-white rounded-none">
        <div className="relative border-b border-amber-100">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
          <CommandInput 
            placeholder="Buscar por DNI o nombre..." 
            className="pl-9 py-3 focus:ring-0 focus:border-amber-200 text-amber-900 placeholder:text-amber-400"
          />
        </div>
        
        <CommandList className="max-h-[300px] overflow-auto py-2">
          <CommandEmpty className="py-6 text-center">
            <div className="flex flex-col items-center text-amber-600">
              <Search className="h-8 w-8 opacity-20 mb-2" />
              <p>No se encontraron personas</p>
              <p className="text-xs opacity-70 mt-1">Intenta con otro término de búsqueda</p>
            </div>
          </CommandEmpty>
          
          {personas.map((p) => (
            <CommandItem
              key={p.dni}
              value={`${p.dni} ${p.nombre} ${p.apellidos}`}
              onSelect={() => {
                handleDniSelect(p.dni)
                setPopoverOpen(false)
              }}
              className="mx-2 rounded-md py-2 px-3 aria-selected:bg-amber-50 hover:bg-amber-50 cursor-pointer transition-colors group"
            >
              <div className="flex items-center w-full">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2 group-aria-selected:bg-amber-600 group-hover:bg-amber-200 transition-colors">
                  {selectedPersona?.dni === p.dni ? (
                    <Check className="h-3.5 w-3.5 text-amber-700 group-aria-selected:text-white" />
                  ) : (
                    <User className="h-3.5 w-3.5 text-amber-500 opacity-70" />
                  )}
                </div>
                
                <div className="flex flex-col flex-1">
                  <div className="flex items-center">
                    <span className="font-mono font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded text-xs mr-2">
                      {p.dni}
                    </span>
                    <span className="font-medium text-amber-900">
                      {p.nombre} {p.apellidos}
                    </span>
                  </div>
                </div>
                
                <Check
                  className={`h-4 w-4 text-amber-600 ${
                    selectedPersona?.dni === p.dni ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            </CommandItem>
          ))}
        </CommandList>
        
        {/* Pie decorativo */}
        <div className="px-3 py-2 border-t border-amber-100 flex items-center justify-between text-xs text-amber-500">
          <div className="flex items-center gap-1">
            <Utensils className="h-3 w-3" />
            <span>Personal Gastronómico</span>
          </div>
          <span>{personas.length} personas disponibles</span>
        </div>
      </Command>
    </PopoverContent>
            </Popover>
            {errors.dni && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-500"
              >
                {errors.dni.message}
              </motion.p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rol" className="text-sm font-medium">
              rol
            </Label>
            <Input
              id="rol"
              placeholder="Ej: Gerente, Analista, Desarrollador"
              {...register("rol")}
              className="w-full"
            />
            {errors.rol && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-500"
              >
                {errors.rol.message}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaContrato" className="text-sm font-medium">
              Fecha de Contrato
            </Label>
            <Input
              id="fechaContrato"
              type="date"
              {...register("fechaContrato")}
              className="w-full"
            />
            {errors.fechaContrato && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-500"
              >
                   Selecciona Fecha de Contrato
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sueldo" className="text-sm font-medium">
              sueldo
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                S/
              </span>
              <Input
                id="sueldo"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-8"
                {...register("sueldo", { valueAsNumber: true })}
              />
            </div>
            {errors.sueldo && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-500"
              >
                {errors.sueldo.message}
              </motion.p>
            )}
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Procesando...
              </div>
            ) : (
              <>{modo === "editar" ? "Actualizar" : "Registrar"} Empleado</>
            )}
          </Button>
        </DialogFooter>
      </form>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert variant="default" className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle>Éxito</AlertTitle>
              <AlertDescription className="text-green-600">
                {successMessage}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert variant="destructive">
              <X className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <PersonaModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </motion.div>
  )
}

const EmpleadoDetails = ({ empleado, onClose }: { empleado: Empleado; onClose: () => void }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeIn}
      className="space-y-6"
    >
      <DialogHeader>
        <DialogTitle className="text-xl">Detalles del Empleado</DialogTitle>
      </DialogHeader>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline" className="px-2 py-1">
              {empleado.persona.dni}
            </Badge>
            {empleado.persona.nombre} {empleado.persona.apellidos}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">rol</p>
              <p className="font-medium">{empleado.rol}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha de Contrato</p>
              <p className="font-medium">{empleado.fechaContrato}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">sueldo</p>
              <p className="font-medium">S/ {empleado.sueldo.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">DNI</p>
              <p className="font-medium">{empleado.persona.dni}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">nombre</p>
              <p className="font-medium">{empleado.persona.nombre}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Apellidos</p>
              <p className="font-medium">{empleado.persona.apellidos}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <DialogFooter>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogFooter>
    </motion.div>
  )
}

export const EmpleadoTable = () => {
  const [open, setOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [modoEdicion, setModoEdicion] = useState<"crear" | "editar">("crear")
  const [empleadoEditar, setEmpleadoEditar] = useState<Empleado | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("")
  const [filterrol, setFilterrol] = useState("")
  
  // Pagination state
  const [page, setPage] = useState(1)
  const itemsPerPage = 5
  
  const { 
    empleados, 
    setEmpleados, 
    empleadoSeleccionado, 
    setEmpleadoSeleccionado, 
    setSuccess, 
    setError 
  } = useEmpleadoStore()

  useEffect(() => {
    cargarEmpleados()
  }, [])

  const cargarEmpleados = async () => {
    setIsLoading(true)
    try {
      const data = await obtenerEmpleados()
      setEmpleados(data)
      setIsLoading(false)
    } catch (err) {
      setError("Error al cargar empleados")
      setIsLoading(false)
    }
  }

  // Get unique job positions for filtering
  const uniquerols = useMemo(() => {
    const rols = empleados.map(emp => emp.rol)
    return Array.from(new Set(rols))
  }, [empleados])

  // Filter and search employees
  const filteredEmpleados = useMemo(() => {
    return empleados.filter(emp => {
      const matchesSearch = searchTerm === "" || 
        emp.persona.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.persona.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.persona.dni.includes(searchTerm)
      
      const matchesrol = filterrol === "" || emp.rol === filterrol
      
      return matchesSearch && matchesrol
    })
  }, [empleados, searchTerm, filterrol])

  // Paginate employees
  const paginatedEmpleados = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage
    return filteredEmpleados.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredEmpleados, page])

  const totalPages = Math.ceil(filteredEmpleados.length / itemsPerPage)

  const handleEditar = (empleado: Empleado) => {
    setModoEdicion("editar")
    setEmpleadoEditar(empleado)
    setOpen(true)
  }

  const handleEliminar = async (id: number) => {
    try {
      await eliminarEmpleado(id)
      setSuccess("Empleado eliminado correctamente")
      setDeleteConfirmOpen(false)
      cargarEmpleados()
    } catch (err) {
      setError("No se pudo eliminar el empleado")
    }
  }

  const handleConfirmDelete = (empleado: Empleado) => {
    setEmpleadoSeleccionado(empleado)
    setDeleteConfirmOpen(true)
  }

  const handleVer = (empleado: Empleado) => {
    setEmpleadoSeleccionado(empleado)
    setDetailsOpen(true)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setFilterrol("")
    setPage(1)
  }

  return (

    <div className="flex-1 overflow-y-auto">
    
     
       <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <Card className="border-none">
         <CardHeader className="pb-6 border-b border-amber-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-3">
          <div className="hidden md:flex h-12 w-12 rounded-full bg-gradient-to-br from-amber-700 to-amber-500 items-center justify-center text-white shadow-md">
            <ChefHat size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl font-serif font-bold text-amber-900">
                Gestión de Empleados
              </CardTitle>
              <Utensils className="h-5 w-5 text-amber-500 hidden md:block" />
            </div>
            <div className="flex items-center mt-1">
              <CardDescription className="text-amber-700 font-medium">
                Administra la información del personal de tu restaurante
              </CardDescription>
              <div className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full font-medium hidden md:block">
                Equipo Gastronómico
              </div>
            </div>
            <div className="hidden md:flex items-center gap-1 mt-1 text-xs text-amber-600">
              <Users size={12} className="opacity-70" />
              <span>Contrata, gestiona y organiza a tu equipo culinario</span>
            </div>
          </div>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white border-none shadow-md flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={() => { 
                setModoEdicion("crear")
                setEmpleadoEditar(null) 
              }}
            >
              <div className="bg-white bg-opacity-20 rounded-full p-1">
                <UserPlus size={14} />
              </div>
              <span>Nuevo Empleado</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md border border-amber-200 shadow-lg">
            <DialogHeader className="bg-gradient-to-r from-amber-800 to-amber-600 -m-6 mb-2 p-6 rounded-t-lg">
              <div className="flex items-center gap-2 text-white">
                <Coffee size={20} className="opacity-80" />
                <DialogTitle className="font-serif">
                  {modoEdicion === "crear" ? "Registrar Nuevo Empleado" : "Editar Empleado"}
                </DialogTitle>
              </div>
              <div className="h-0.5 w-1/4 bg-white bg-opacity-20 mt-2"></div>
            </DialogHeader>
            <EmpleadoForm 
              modo={modoEdicion} 
              empleado={empleadoEditar} 
              onSuccess={() => { 
                setOpen(false)
                cargarEmpleados() 
              }}
              onCancel={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Línea decorativa */}
      <div className="flex items-center gap-2 mt-4">
        <div className="flex-grow h-0.5 bg-gradient-to-r from-transparent to-amber-200"></div>
        <Utensils size={14} className="text-amber-300" />
        <div className="flex-grow h-0.5 bg-gradient-to-l from-transparent to-amber-200"></div>
      </div>
    </CardHeader>
        <CardContent>
         <div className="mb-6 space-y-4">
      {/* Barra principal de búsqueda y filtros */}
     <SearchAndFilterBar
       filterrol={filterrol}
       filteredEmpleados={filteredEmpleados}
       searchTerm={searchTerm}
       paginatedEmpleados={paginatedEmpleados}
       resetFilters={resetFilters}
       setFilterrol={setFilterrol}
       setPage={setPage}
       setSearchTerm={setSearchTerm}
       uniquerols={uniquerols}
     />
    </div>

         <div className="border border-amber-200 rounded-lg shadow-md bg-white overflow-hidden">
      {/* Cabecera decorativa de restaurante */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-600 p-3 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Utensils className="h-5 w-5" />
          <h3 className="font-serif text-lg">Personal del Restaurante</h3>
        </div>
        <Coffee className="h-5 w-5 opacity-70" />
      </div>

      <Table>
        <TableHeader className="bg-amber-50">
          <TableRow className="border-b border-amber-200">
            <TableHead className="w-[100px] font-serif text-amber-900">DNI</TableHead>
            <TableHead className="font-serif text-amber-900">Nombre</TableHead>
            <TableHead className="font-serif text-amber-900">rol</TableHead>
            <TableHead className="text-right font-serif text-amber-900">sueldo</TableHead>
            <TableHead className="text-center font-serif text-amber-900">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="border-b border-amber-100">
                <TableCell><Skeleton className="h-6 w-16 bg-amber-100" /></TableCell>
                <TableCell><Skeleton className="h-6 w-32 bg-amber-100" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24 bg-amber-100" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16 ml-auto bg-amber-100" /></TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Skeleton className="h-8 w-20 bg-amber-100" />
                    <Skeleton className="h-8 w-20 bg-amber-100" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : filteredEmpleados.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12">
                <div className="flex flex-col items-center justify-center text-amber-800">
                  <div className="relative mb-4">
                    <Search className="h-12 w-12 opacity-30 text-amber-700" />
                    <Coffee className="h-6 w-6 absolute bottom-0 right-0 text-amber-500" />
                  </div>
                  <p className="text-lg font-medium font-serif">No se encontraron empleados</p>
                  <p className="text-sm text-amber-700 max-w-xs text-center">
                    {searchTerm || filterrol 
                      ? "Prueba con otros filtros o términos de búsqueda" 
                      : "Registra nuevos empleados usando el botón 'Nuevo Empleado'"}
                  </p>
                  {(searchTerm || filterrol) && (
                    <Button 
                      variant="outline" 
                      className="mt-3 border-amber-400 text-amber-700 hover:bg-amber-50"
                      onClick={resetFilters}
                    >
                      Limpiar filtros
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <AnimatePresence>
              {paginatedEmpleados.map((emp, index) => (
                <motion.tr
                  key={emp.idEmpleado}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={listItemVariant}
                  layout
                  className={`
                    border-b border-amber-100 
                    ${index % 2 === 0 ? 'bg-white' : 'bg-amber-50/40'} 
                    hover:bg-amber-100/50 transition-colors duration-200
                  `}
                >
                  <TableCell className="font-medium">
                    <Badge variant="outline" className="font-mono bg-amber-50 text-amber-800 border-amber-300">
                      {emp.persona.dni}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-amber-900">
                    <div className="flex items-center">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center mr-2 text-white">
                        <User className="h-4 w-4" />
                      </div>
                      {emp.persona.nombre} {emp.persona.apellidos}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`
                      px-2 py-1 
                      ${emp.rol.toLowerCase().includes('chef') ? 'bg-red-100 text-red-800 border-red-200' : 
                        emp.rol.toLowerCase().includes('mozo') ? 'bg-blue-100 text-blue-800 border-blue-200' : 
                        emp.rol.toLowerCase().includes('cajero') ? 'bg-green-100 text-green-800 border-green-200' : 
                        'bg-amber-100 text-amber-800 border-amber-200'}
                    `}>
                      {emp.rol}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-mono font-medium text-amber-900 bg-amber-50 px-3 py-1 rounded-md inline-block">
                      S/ {emp.sueldo.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="bg-white border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900">
                            Acciones <ChevronDown className="ml-1 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border-amber-200 shadow-lg rounded-md">
                          <DropdownMenuItem 
                            onClick={() => handleVer(emp)}
                            className="cursor-pointer hover:bg-amber-50 text-amber-900"
                          >
                            <Eye className="mr-2 h-4 w-4 text-amber-600" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleEditar(emp)}
                            className="cursor-pointer hover:bg-amber-50 text-amber-900"
                          >
                            <Edit className="mr-2 h-4 w-4 text-amber-600" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-amber-100" />
                          <DropdownMenuItem 
                            onClick={() => handleConfirmDelete(emp)}
                            className="cursor-pointer hover:bg-red-50 text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          )}
        </TableBody>
      </Table>
      
      {/* Pie decorativo */}
      <div className="bg-amber-50 py-2 px-4 text-amber-700 text-xs border-t border-amber-200 flex justify-between">
        <span>Restaurante &copy; {new Date().getFullYear()}</span>
        <span>{paginatedEmpleados.length} de {filteredEmpleados.length} empleados</span>
      </div>
    </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Página {page} de {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page => Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => Math.abs(p - page) < 2 || p === 1 || p === totalPages)
                  .map((p, i, arr) => (
                    <React.Fragment key={p}>
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <Button variant="outline" size="sm" disabled className="cursor-default">
                          ...
                        </Button>
                      )}
                      <Button
                        variant={page === p ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    </React.Fragment>
                  ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page => Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employee Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          {empleadoSeleccionado && (
            <EmpleadoDetails
              empleado={empleadoSeleccionado}
              onClose={() => setDetailsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {empleadoSeleccionado && (
              <p>
                ¿Estás seguro que deseas eliminar al empleado{" "}
                <span className="font-medium">
                  {empleadoSeleccionado.persona.nombre}{" "}
                  {empleadoSeleccionado.persona.apellidos}
                </span>
                ? Esta acción no se puede deshacer.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={() => empleadoSeleccionado && handleEliminar(empleadoSeleccionado.id)}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
    </div>
 
  )
}

 