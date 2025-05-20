
import prisma from "@/lib/prisma"

export async function eliminarEmpleado(idEmpleado: number) {
  try {
    // Elimina días de trabajo primero por integridad
    await prisma.empleadoDiaSemana.deleteMany({
      where: { idEmpleado },
    })

    await prisma.empleado.delete({
      where: { idEmpleado },
    })

    return { ok: true, message: "Empleado eliminado correctamente" }
  } catch (error) {
    console.error("Error al eliminar empleado:", error)
    return { ok: false, message: "Error al eliminar el empleado" }
  }
}
