import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(req: NextRequest) {
  const { token, nuevaContrasena } = await req.json()

  if (!token || !nuevaContrasena) {
    return NextResponse.json({ error: 'Datos incompletos.' }, { status: 400 })
  }

  const usuario = await prisma.usuario.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: {
        gte: new Date(),
      },
    },
  })

  if (!usuario) {
    return NextResponse.json({ error: 'Token inválido o expirado.' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(nuevaContrasena, 10)

  await prisma.usuario.update({
    where: { idUsuario: usuario.idUsuario },
    data: {
      contrasena: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      resetRequestedIp: null,
      resetRequestedUserAgent: null,
    },
  })

  return NextResponse.json({ message: 'Contraseña actualizada correctamente.' })
}
