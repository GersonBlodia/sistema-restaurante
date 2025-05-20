'use server'
 
import prisma from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import path from 'path'
import { v4 as uuid } from 'uuid'

type UploadParams = {
  idPersona: number
  idTipoDocumentoAdjunto: number
  archivo: File
}

export async function uploadDocumentoAdjunto({ idPersona, idTipoDocumentoAdjunto, archivo }: UploadParams) {
  try {
    const persona = await prisma.persona.findUnique({
      where: { idPersona },
      select: { idTipoDocumento: true }
    })

    if (!persona) throw new Error('Persona no encontrada')

    if (persona.idTipoDocumento === 1) {
      throw new Error('No se permite subir documentos adjuntos para tipo de documento 1')
    }

    const buffer = await archivo.arrayBuffer()
    const fileName = `${uuid()}-${archivo.name}`
    const filePath = path.join(process.cwd(), 'public/uploads', fileName)

    await writeFile(filePath, Buffer.from(buffer))

    const nuevoDocumento = await prisma.documentoAdjunto.create({
      data: {
        idPersona,
        idTipoDocumentoAdjunto,
        nombreArchivo: archivo.name,
        rutaArchivo: `/uploads/${fileName}`,
      },
    })

    return nuevoDocumento
  } catch (error) {
    console.error('[uploadDocumentoAdjunto]', error)
    throw error
  }
}
