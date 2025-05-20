'use server'

import prisma from "@/lib/prisma"

 
export async function getPersona(idPersona: number) {
  try {
    const persona = await prisma.persona.findUnique({
      where: { idPersona },
      include: {
        tipoDocumento: true,
        direccionUbicacion: {
          include: {
            distrito: {
              include: {
                provincia: {
                  include: {
                    departamento: {
                      include: {
                        pais: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        DocumentoAdjunto: true,
      },
    })

    if (!persona) throw new Error('Persona no encontrada')

    return persona
  } catch (error) {
    console.error('[getPersona]', error)
    throw error
  }
}
