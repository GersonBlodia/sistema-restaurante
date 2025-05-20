 
import prisma from "@/lib/prisma"

export async function obtenerEmpleadoPorId(idEmpleado: number) {
  try {
    const empleado = await prisma.empleado.findUnique({
      where: { idEmpleado },
      include: {
        persona: true,
        diasTrabajo: true,
      },
    })

    if (!empleado) throw new Error("Empleado no encontrado")

    return {
      idEmpleado: empleado.idEmpleado,
      rol: empleado.rol,
      horario: empleado.horario,
      sueldo: empleado.sueldo,
      contratoInicio: empleado.contratoInicio?.toISOString().split("T")[0],
      contratoFinal: empleado.contratoFinal?.toISOString().split("T")[0],
      estado: empleado.estado,
      persona: {
        idPersona: empleado.persona.idPersona,
        nombre: empleado.persona.nombre,
        apellido: empleado.persona.apellido,
        dni: empleado.persona.dni?.toString(),
        telefono: empleado.persona.telefono,
      },
      diasTrabajo: empleado.diasTrabajo.map((d) => d.dia),
    }
  } catch (error) {
    console.error("Error al obtener empleado:", error)
    throw error
  }
}
