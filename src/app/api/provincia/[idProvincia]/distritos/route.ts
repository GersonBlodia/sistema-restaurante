import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { idProvincia: string } }
) {
  try {
    const { idProvincia } = params;
    if (!idProvincia || isNaN(parseInt(idProvincia))) {
      return NextResponse.json({ message: 'ID de provincia inválido' }, { status: 400 });
    }

    const distritos = await prisma.distrito.findMany({
      where: {
        idProvincia: parseInt(idProvincia),
        estado: true,
      },
      orderBy: { nombreDistrito: 'asc' },
    });

    return NextResponse.json(distritos, { status: 200 });
  } catch (error: any) {
    console.error('Error al obtener distritos:', error);
    return NextResponse.json(
      { message: 'Error al obtener distritos' },
      { status: 500 }
    );
  }
}