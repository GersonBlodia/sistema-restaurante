
import { z } from "zod"
import { DiaSemana, Rol } from "@prisma/client"
import prisma from "@/lib/prisma"

const updateSchema = z.object({
  rol: z.nativeEnum(Rol),
  horario: z.string().optional(),
  sueldo: z.number().positive(),
  contratoInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  contratoFinal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  diasTrabajo: z.array(z.nativeEnum(DiaSemana)).min(1),
})

export async function actualizarEmpleado(idEmpleado: number, data: unknown) {
  const parsed = updateSchema.safeParse(data)
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors }
  }

  try {
    // Primero eliminamos los días anteriores
    await prisma.empleadoDiaSemana.deleteMany({
      where: { idEmpleado },
    })

    const actualizado = await prisma.empleado.update({
      where: { idEmpleado },
      data: {
        rol: parsed.data.rol,
        horario: parsed.data.horario,
        sueldo: parsed.data.sueldo,
        contratoInicio: new Date(parsed.data.contratoInicio),
        contratoFinal: parsed.data.contratoFinal
          ? new Date(parsed.data.contratoFinal)
          : undefined,
        diasTrabajo: {
          create: parsed.data.diasTrabajo.map((dia) => ({
            dia,
          })),
        },
      },
      include: {
        persona: true,
        diasTrabajo: true,
      },
    })

    return { ok: true, empleado: actualizado }
  } catch (error) {
    console.error("Error al actualizar empleado:", error)
    return { ok: false, message: "No se pudo actualizar el empleado" }
  }
}
