'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getEmpleadosConPersona() {
  try {
    const empleados = await prisma.empleado.findMany({
      include: {
        persona: true, // 🔗 Relación con modelo Persona
      },
    })

    return empleados
  } catch (error) {
    console.error('Error al obtener empleados:', error)
    throw new Error('No se pudo obtener la lista de empleados')
  }
}
