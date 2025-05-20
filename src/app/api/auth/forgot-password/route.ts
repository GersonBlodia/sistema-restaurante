import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  const { correo } = await req.json()

  if (!correo) {
    return NextResponse.json({ error: 'Correo requerido.' }, { status: 400 })
  }

  const usuario = await prisma.usuario.findUnique({ where: { correo } })
  if (!usuario) {
    return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 })
  }

  const token = uuidv4()
  const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

  const ip = req.headers.get('x-forwarded-for') || ''
  const userAgent = req.headers.get('user-agent') || ''

  await prisma.usuario.update({
    where: { idUsuario: usuario.idUsuario },
    data: {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
      resetRequestedIp: ip,
      resetRequestedUserAgent: userAgent,
    },
  })

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

  // Configura tu correo
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: `"Tu Aplicación" <${process.env.EMAIL_USER}>`,
    to: correo,
    subject: 'Restablecer contraseña',
    html: `<p>Haz clic aquí para restablecer tu contraseña:</p>
           <a href="${resetLink}">${resetLink}</a>
           <p>Este enlace expirará en 1 hora.</p>`,
  })

  return NextResponse.json({ message: 'Correo enviado' })
}
