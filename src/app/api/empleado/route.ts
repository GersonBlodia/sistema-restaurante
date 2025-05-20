// app/api/empleados/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { idPersona, dni, rol, horario } = await req.json()
const dniNumber = dni ? parseInt(dni) : undefined

    // Validar si la persona existe por id o dni
    const persona = await prisma.persona.findFirst({
      where: {
        ...(idPersona && { idPersona }),
        ...(dniNumber && { dni: dniNumber }),
      },
    })

    if (!persona) {
      return NextResponse.json({ error: 'Persona no encontrada' }, { status: 404 })
    }

    // Validar si ya es empleado
    const existeEmpleado = await prisma.empleado.findUnique({
      where: { idPersona: persona.idPersona },
    })

    if (existeEmpleado) {
      return NextResponse.json({ error: 'La persona ya está registrada como empleado' }, { status: 400 })
    }

    // Crear nuevo empleado
    const nuevoEmpleado = await prisma.empleado.create({
      data: {
        idPersona: persona.idPersona,
        rol,
        horario,
      },
    })

    return NextResponse.json({ message: 'Empleado creado', empleado: nuevoEmpleado }, { status: 201 })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: 'Error del servidor', detalle: error.message }, { status: 500 })
  }
}
