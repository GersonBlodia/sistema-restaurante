'use server'

import prisma from "@/lib/prisma"

 
export async function getPersonas() {
  try {
    return await prisma.persona.findMany({
      where: { estado: true },
      include: {
        tipoDocumento: true,
        DocumentoAdjunto: true,
      },
    })
  } catch (error) {
    console.error('[getPersonas]', error)
    throw error
  }
}
