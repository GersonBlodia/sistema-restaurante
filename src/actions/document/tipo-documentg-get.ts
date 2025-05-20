 
'use server';

import prisma from "@/lib/prisma";
import { Tipo_Documento } from "@prisma/client";

export const getTiposDocumento = async (): Promise<Tipo_Documento[]> => {
  try {
    const tiposDocumento = await prisma.tipo_Documento.findMany({
      where: {
        estado: true, // O la condición que necesites para documentos activos
      },
      orderBy: {
        nombreTipoDocumento: 'asc',
      },
    });
    return tiposDocumento;
  } catch (error) {
    console.error("Error al obtener los tipos de documento:", error);
    return []; // O lanza el error si prefieres manejarlo en el componente
  }
};