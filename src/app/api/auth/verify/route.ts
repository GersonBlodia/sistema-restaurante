import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')

  if (!token) {
    return NextResponse.json(
      { error: 'Token de verificación no proporcionado.' },
      { status: 400 }
    )
  }

  try {
    // Buscar usuario con token válido y no expirado
    const user = await prisma.usuario.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: {
          gte: new Date(), // ✅ Token aún no expirado
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido o expirado.' },
        { status: 400 }
      )
    }

    // Activar cuenta
    await prisma.usuario.update({
      where: { idUsuario: user.idUsuario },
      data: {
        isActive: true,
        verificationToken: null,
        verificationTokenExpiry: null, // ✅ Limpiar expiración
      },
    })

    return NextResponse.json(
      { message: 'Correo verificado exitosamente. Tu cuenta está activa.' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error durante la verificación:', error)
    return NextResponse.json(
      { error: 'Ocurrió un error durante la verificación.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
