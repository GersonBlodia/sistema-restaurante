import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const correo = url.searchParams.get('correo');

  if (!correo) {
    return NextResponse.json({ error: 'Correo no proporcionado' }, { status: 400 });
  }

  const user = await prisma.usuario.findUnique({
    where: { correo },
  });

  return NextResponse.json({
    isActive: user?.isActive || false,
  });
}
