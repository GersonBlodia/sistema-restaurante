"use server"

import prisma from "@/lib/prisma"

 
// Tipado opcional
export interface PersonaDTO {
  idPersona: number
  nombre: string
  apellido: string
  dni: number | null
  telefono?: string | null
}

// Obtener personas disponibles (por ejemplo, personas que no sean empleados aún)
export async function getPersonasDisponibles(): Promise<PersonaDTO[]> {
  try {
    const personas = await prisma.persona.findMany({
      where: {
        empleado: null, // solo personas sin relación con Empleado
        estado: true,
      },
      select: {
        idPersona: true,
        nombre: true,
        apellido: true,
        dni: true,
        telefono: true,
      },
    })

    return personas
  } catch (error) {
    console.error("Error al obtener personas disponibles:", error)
    throw new Error("No se pudo obtener personas disponibles")
  }
}

// Obtener persona por DNI
export async function getPersonaPorDni(dni: number): Promise<PersonaDTO | null> {
  try {
    const persona = await prisma.persona.findUnique({
      where: {
        dni,
      },
      select: {
        idPersona: true,
        nombre: true,
        apellido: true,
        dni: true,
        telefono: true,
      },
    })

    return persona
  } catch (error) {
    console.error(`Error al obtener persona con DNI ${dni}:`, error)
    throw new Error("No se pudo obtener la persona por DNI")
  }
}
