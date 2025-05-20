// stores/useEmpleadoStore.ts

import { Empleado } from "@/actions/empleado/registrarEmpleado"
import { create } from "zustand"
 
interface EmpleadoState {
  empleados: Empleado[]
  empleadoSeleccionado: Empleado | null
  successMessage: string
  errorMessage: string
  setEmpleados: (empleados: Empleado[]) => void
  setEmpleadoSeleccionado: (empleado: Empleado | null) => void
  setSuccess: (msg: string) => void
  setError: (msg: string) => void
  clearMessages: () => void
}

export const useEmpleadoStore = create<EmpleadoState>((set) => ({
  empleados: [],
  empleadoSeleccionado: null,
  successMessage: "",
  errorMessage: "",
  setEmpleados: (empleados) => set({ empleados }),
  setEmpleadoSeleccionado: (empleado) => set({ empleadoSeleccionado: empleado }),
  setSuccess: (msg) => set({ successMessage: msg, errorMessage: "" }),
  setError: (msg) => set({ errorMessage: msg, successMessage: "" }),
  clearMessages: () => set({ successMessage: "", errorMessage: "" }),
}))
