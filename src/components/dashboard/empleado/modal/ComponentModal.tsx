"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { usePersonaStore } from "@/store/usePersonaStore"
 
export function PersonaModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { personaSeleccionada } = usePersonaStore()
  console.log(personaSeleccionada?.nombres)
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Datos de la Persona</DialogTitle>
        </DialogHeader>
        {personaSeleccionada ? (
          <div className="space-y-2">
            <p><strong>Nombre:</strong> {personaSeleccionada?.nombres} {personaSeleccionada?.apellidos}</p>
            <p><strong>DNI:</strong> {personaSeleccionada.dni}</p>
            <p><strong>Teléfono:</strong> {personaSeleccionada.telefono || "No registrado"}</p>
            <p><strong>Correo:</strong> {personaSeleccionada.correo || "No registrado"}</p>
          </div>
        ) : (
          <p>Cargando datos...</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
