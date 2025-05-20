// stores/usePersonaStore.ts
import { PersonaDTO } from "@/actions/empleado/get-persona"
import { create } from "zustand"
 
interface PersonaState {
  personaSeleccionada: PersonaDTO | null
  setPersona: (persona: PersonaDTO) => void
  clearPersona: () => void
}

export const usePersonaStore = create<PersonaState>((set) => ({
  personaSeleccionada: null,
  setPersona: (persona) => set({ personaSeleccionada: persona }),
  clearPersona: () => set({ personaSeleccionada: null }),
}))
