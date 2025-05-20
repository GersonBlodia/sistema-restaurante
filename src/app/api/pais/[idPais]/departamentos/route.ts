import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { idPais: string } }
) {
  try {
    // Aseguramos que 'params' se resuelva antes de usarlo
    const { idPais } = params;
    
    if (!idPais || isNaN(parseInt(idPais))) {
      return NextResponse.json({ message: 'ID de país inválido' }, { status: 400 });
    }

    const departamentos = await prisma.departamento.findMany({
      where: {
        idPais: parseInt(idPais),
        estado: true,
      },
      orderBy: { nombreDepartamento: 'asc' },
    });

    return NextResponse.json(departamentos, { status: 200 });
  } catch (error: any) {
    console.error('Error al obtener departamentos:', error);
    return NextResponse.json(
      { message: 'Error al obtener departamentos' },
      { status: 500 }
    );
  }
}
