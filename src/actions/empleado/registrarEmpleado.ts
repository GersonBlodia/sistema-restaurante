
import { z } from "zod"
import { Rol, DiaSemana } from "@prisma/client"

import prisma from "@/lib/prisma"

// Validación alineada con el modelo
export interface Empleado{
    dni: number; 
    rol: string; 
    horario: string; 
    sueldo: number; 
    contratoInicio:Date; 
    contratoFinal: Date; 
    diasTrabajo:string;
}
export const empleadoSchema = z.object({
  dni: z.string().length(8, "DNI inválido"),
  rol: z.nativeEnum(Rol),
  horario: z.string().optional(),
  sueldo: z.number().positive(),
  contratoInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  contratoFinal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  diasTrabajo: z.array(z.nativeEnum(DiaSemana)).min(1, "Selecciona al menos un día"),
})

export async function registrarEmpleado(data: unknown) {
  const parsed = empleadoSchema.safeParse(data)
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors }
  }

  try {
    // Buscar persona por DNI
    const persona = await prisma.persona.findUnique({
      where: { dni: parseInt(parsed.data.dni) },
    })

    if (!persona) {
      return { ok: false, message: "La persona con ese DNI no está registrada" }
    }

    // Crear Empleado con días de trabajo
    const nuevoEmpleado = await prisma.empleado.create({
      data: {
        idPersona: persona.idPersona,
        rol: parsed.data.rol,
        horario: parsed.data.horario,
        sueldo: parsed.data.sueldo,
        contratoInicio: new Date(parsed.data.contratoInicio),
        contratoFinal: parsed.data.contratoFinal ? new Date(parsed.data.contratoFinal) : undefined,
        diasTrabajo: {
          create: parsed.data.diasTrabajo.map((dia) => ({
            dia,
          })),
        },
      },
      include: {
        diasTrabajo: true,
        persona: true,
      },
    })
    return { ok: true, empleado: nuevoEmpleado }
  } catch (error: any) {
    console.error("Error al registrar empleado:", error)
    return { ok: false, message: "Error en el servidor", error }
  }
}
