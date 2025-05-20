"use server"

import prisma from "@/lib/prisma"
export async function obtenerEmpleados() {
  try {
    const empleados = await prisma.empleado.findMany({
      include: {
        persona: true,
        diasTrabajo: true,
      },
    })

    return empleados.map((e) => ({
      idEmpleado: e.idEmpleado,
      rol: e.rol,
      horario: e.horario,
      sueldo: e.sueldo,
      contratoInicio: e.contratoInicio?.toISOString().split("T")[0],
      contratoFinal: e.contratoFinal?.toISOString().split("T")[0],
      estado: e.estado,
      persona: {
        idPersona: e.persona.idPersona,
        nombre: e.persona.nombre,
        apellido: e.persona.apellido,
        dni: e.persona.dni?.toString(),
        telefono: e.persona.telefono,
      },
      diasTrabajo: e.diasTrabajo.map((d) => d.dia),
    }))
  } catch (error) {
    console.error("Error al obtener empleados:", error)
    throw new Error("No se pudo obtener la lista de empleados")
  }
}
