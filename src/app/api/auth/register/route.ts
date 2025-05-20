import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

async function sendVerificationEmail(correo: string, token: string) {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
 // Plantilla HTML mejorada para el correo electrónico
 const htmlContent = `
 <!DOCTYPE html>
 <html lang="es">
 <head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Verificación de Correo</title>
   <style>
     body {
       font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
       line-height: 1.6;
       color: #333;
       margin: 0;
       padding: 0;
       background-color: #f7f7f7;
     }
     .container {
       max-width: 600px;
       margin: 0 auto;
       background-color: #ffffff;
       border-radius: 8px;
       overflow: hidden;
       box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
     }
     .header {
       background: linear-gradient(135deg, #0061a8 0%, #0085cc 100%);
       color: white;
       padding: 30px 20px;
       text-align: center;
     }
     .header h1 {
       margin: 0;
       font-size: 26px;
       font-weight: 500;
     }
     .content {
       padding: 30px 25px;
     }
     .verification-box {
       background-color: #f8f9fa;
       border: 1px solid #e9ecef;
       border-radius: 6px;
       padding: 25px;
       margin: 20px 0;
       text-align: center;
     }
     .btn {
       display: inline-block;
       background: linear-gradient(135deg, #0061a8 0%, #0085cc 100%);
       color: white;
       text-decoration: none;
       padding: 12px 30px;
       border-radius: 50px;
       font-size: 16px;
       font-weight: 500;
       margin: 15px 0;
       transition: all 0.3s ease;
     }
     .btn:hover {
       background: linear-gradient(135deg, #005291 0%, #0074b3 100%);
       transform: translateY(-2px);
       box-shadow: 0 5px 15px rgba(0, 97, 168, 0.3);
     }
     .footer {
       background-color: #f8f9fa;
       padding: 20px;
       text-align: center;
       color: #6c757d;
       font-size: 13px;
       border-top: 1px solid #e9ecef;
     }
     .divider {
       height: 1px;
       background-color: #e9ecef;
       margin: 20px 0;
     }
     .text-small {
       font-size: 14px;
       color: #6c757d;
     }
     .icon {
       margin-bottom: 15px;
       font-size: 40px;
     }
     @media only screen and (max-width: 600px) {
       .container {
         width: 100%;
         border-radius: 0;
       }
     }
   </style>
 </head>
 <body>
   <div class="container">
     <div class="header">
       <h1>Verificación de Correo Electrónico</h1>
     </div>
     <div class="content">
       <h2>¡Bienvenido a nuestro sistema!</h2>
       <p>Gracias por registrarte. Solo falta un paso más para completar tu registro y activar tu cuenta.</p>
       
       <div class="verification-box">
         <div class="icon">✉️</div>
         <h3>Verifica tu dirección de correo</h3>
         <p>Por favor, haz clic en el botón de abajo para verificar tu dirección de correo electrónico.</p>
         <a href="${verificationLink}" class="btn" target="_blank">Verificar mi correo</a>
         <p class="text-small">Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:</p>
         <p class="text-small" style="word-break: break-all;">${verificationLink}</p>
       </div>
       
       <div class="divider"></div>
       
       <p>Este enlace de verificación caducará en 24 horas. Si no verificas tu correo electrónico dentro de este período, deberás solicitar un nuevo enlace de verificación.</p>
       <p>Si no has creado una cuenta con nosotros, puedes ignorar este mensaje.</p>
     </div>
     <div class="footer">
       <p>&copy; ${new Date().getFullYear()} Tu Aplicación. Todos los derechos reservados.</p>
       <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
     </div>
   </div>
 </body>
 </html>
`;
  const mailOptions = {
    from: `"Tu Aplicación" <${process.env.EMAIL_USER}>`,
    to: correo,
    subject: 'Verifica tu correo electrónico',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo de verificación enviado a', correo);
  } catch (error) {
    console.error('Error al enviar el correo de verificación:', error);
    throw new Error('No se pudo enviar el correo de verificación');
  }
}

 

export async function POST(req: Request) {
  const { correo, contrasena, dni , userName} = await req.json()

  if (!correo || !contrasena || !dni) {
    return NextResponse.json(
      { error: 'Todos los campos son obligatorios.' },
      { status: 400 }
    )
  }

  try {
    const existingUser = await prisma.usuario.findUnique({ where: { correo } })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Este correo electrónico ya está registrado.' },
        { status: 400 }
      )
    }

    const persona = await prisma.persona.findUnique({
      where: { dni: parseInt(dni, 10) },
      include: { empleado: true },
    })

    if (!persona || !persona.empleado) {
      return NextResponse.json(
        { error: 'Este DNI no pertenece a un empleado registrado.' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10)
    const verificationToken = uuidv4()
    const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas desde ahora

    const newUser = await prisma.usuario.create({
      data: {
        correo,
        userName:userName,
        contrasena: hashedPassword,
        idEmpleado: persona.empleado.idEmpleado,
        verificationToken,
        verificationTokenExpiry: expiryDate,
        isActive: false,
        estado: true,
      },
    })

    await sendVerificationEmail(correo, verificationToken)

    return NextResponse.json(
      { message: 'Registro exitoso. Por favor, verifica tu correo electrónico.' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error durante el registro:', error)
    return NextResponse.json(
      { error: 'Ocurrió un error durante el registro.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}