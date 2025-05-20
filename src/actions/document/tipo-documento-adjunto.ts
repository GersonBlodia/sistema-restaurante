'use server';

import prisma from "@/lib/prisma";
import { Tipo_Documento_Adjunto } from "@prisma/client";

export const getTiposDocumentoAdjunto = async (): Promise<Tipo_Documento_Adjunto[]> => {
  try {
    const tiposDocumentoAdjunto = await prisma.tipo_Documento_Adjunto.findMany({
      where: {
        estado: true, // Solo documentos adjuntos activos
      },
      orderBy: {
        nombreTipo: 'asc',
      },
    });
    return tiposDocumentoAdjunto;
  } catch (error) {
    console.error("Error al obtener los tipos de documento adjunto:", error);
    return []; // O puedes usar: throw error;
  }
};
