import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { idDepartamento: string } }
) {
  try {
    const { idDepartamento } = params;
    if (!idDepartamento || isNaN(parseInt(idDepartamento))) {
      return NextResponse.json({ message: 'ID de departamento inválido' }, { status: 400 });
    }

    const provincias = await prisma.provincia.findMany({
      where: {
        idDepartamento: parseInt(idDepartamento),
        estado: true,
      },
      orderBy: { nombreProvincia: 'asc' },
    });

    return NextResponse.json(provincias, { status: 200 });
  } catch (error: any) {
    console.error('Error al obtener provincias:', error);
    return NextResponse.json(
      { message: 'Error al obtener provincias' },
      { status: 500 }
    );
  }
}