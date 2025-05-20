import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
 
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dni, nombre, apellido, fechaNacimiento, direccion,telefono} = body;

    // Convertir el DNI a número
    const dniNumber = parseInt(dni);
    if (isNaN(dniNumber)) {
      return NextResponse.json({ message: 'DNI inválido. Debe ser un número.' }, { status: 400 });
    }

    // Validar que el DNI tenga 8 dígitos numéricos
    if (dni.toString().length !== 8) {
      return NextResponse.json(
        { error: 'DNI inválido. Debe tener 8 dígitos numéricos.' },
        { status: 400 }
      );
    }

    // Verificar que todos los campos sean proporcionados
    if (!nombre || !apellido || !fechaNacimiento) {
      return NextResponse.json(
        { error: 'Nombre, Apellido y Fecha de Nacimiento son obligatorios.' },
        { status: 400 }
      );
    }

    // Validar la fecha de nacimiento
    const parsedFecha = new Date(fechaNacimiento);
    if (isNaN(parsedFecha.getTime())) {
      return NextResponse.json(
        { error: 'Fecha de nacimiento inválida.' },
        { status: 400 }
      );
    }

    // Verificar si ya existe una persona con el DNI proporcionado
    const existing = await prisma.persona.findFirst({
      where: { dni: dniNumber },  // Aquí ya es un número dsdsd
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe una persona con ese DNI.' },
        { status: 400 }
      );
    }

    // Crear la nueva persona
    const persona = await prisma.persona.create({
      data: {
        dni: dniNumber,  // Asegúrate de que sea un número
        nombre,
        apellido,
        fechaNacimiento: parsedFecha,
        direccion:direccion,
        telefono:telefono
      },
    });

    return NextResponse.json(persona, { status: 201 });
  } catch (error) {
    console.error('Error al registrar persona:', error);
    return NextResponse.json(
      { error: 'Error del servidor al registrar la persona.' },
      { status: 500 }
    );
  }
}
export async function GET() {
    try {
      // Obtener todas las personas de la base de datos
      const personas = await prisma.persona.findMany({
        where: {
          estado: true, // Puedes agregar cualquier filtro aquí, como solo las personas activas
        },
      });
  
      return NextResponse.json(personas); // Devuelve la respuesta en formato JSON
    } catch (error) {
      return NextResponse.json({ error: 'Error al obtener las personas' }, { status: 500 });
    }
  }