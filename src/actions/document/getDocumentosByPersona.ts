import prisma from "@/lib/prisma"

 
export async function getDocumentosByPersona(idPersona: number) {
  try {
    const documentos = await prisma.documentoAdjunto.findMany({
      where: {
        idPersona,
        estado: true,
      },
      include: {
        tipoDocumentoAdjunto: true,
      },
      orderBy: {
        fechaSubida: "desc",
      },
    })

    return documentos.map((doc) => ({
      idDocumentoAdjunto: doc.idDocumentoAdjunto,
      nombreArchivo: doc.nombreArchivo,
      rutaArchivo: `${doc.rutaArchivo}`,
      tipoDocumento: doc.tipoDocumentoAdjunto?.nombreTipo || "Desconocido",
      fechaSubida: doc.fechaSubida,
    }))
  } catch (error) {
    console.error("Error al obtener documentos adjuntos:", error)
    return []
  }
}
