'use server';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises'; // 👈 Importa mkdir directamente
import path from 'path';
import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';

interface CrearDocumentoAdjuntoData {
  idPersona: number;
  idTipoDocumentoAdjunto: number;
  archivo: File | null;
}

export async function crearDocumentoAdjuntoAction(data: CrearDocumentoAdjuntoData) {
  console.log('crearDocumentoAdjuntoAction llamada', data);
  try {
    const { idPersona, idTipoDocumentoAdjunto, archivo } = data;
    console.log('idTipoDocumentoAdjunto:', idTipoDocumentoAdjunto);
    console.log('Datos del archivo:', archivo);

    if (idTipoDocumentoAdjunto && !archivo) {
      console.log('Se requiere un archivo adjunto para este tipo de documento.');
      return { ok: false, error: 'Se requiere un archivo adjunto.' };
    }

    if (!archivo) {
      console.log('No se adjuntó archivo y no es requerido.');
      return { ok: true, documentoAdjunto: null };
    }

    if (archivo.size === 0) {
      console.log('El archivo está vacío.');
      return { ok: false, error: 'El archivo está vacío.' };
    }

    const buffer = Buffer.from(await archivo.arrayBuffer());
    const extension = path.extname(archivo.name).toLowerCase();
    const nombreUnico = `${randomUUID()}${extension}`;
    const rutaCarpeta = path.join(process.cwd(), 'public', 'uploads');
    const rutaCompleta = path.join(rutaCarpeta, nombreUnico);
    const rutaEnServidor = `/uploads/${nombreUnico}`;

    // Asegurarse de que la carpeta exista
    try {
      await mkdir(rutaCarpeta, { recursive: true }); // ✅ Usa mkdir directamente
      console.log(`Carpeta creada o ya existente: ${rutaCarpeta}`);
    } catch (mkdirError) {
      console.error('Error al crear la carpeta:', mkdirError);
      return { ok: false, error: 'Error al crear la carpeta de subida.' };
    }

    await writeFile(rutaCompleta, buffer);
    console.log(`Archivo guardado en: ${rutaCompleta}`);

    const documentoAdjunto = await prisma.documentoAdjunto.create({
      data: {
        idPersona,
        idTipoDocumentoAdjunto: +idTipoDocumentoAdjunto,
        nombreArchivo: archivo.name,
        rutaArchivo: rutaEnServidor,
      },
    });

    console.log('Documento adjunto creado en la base de datos:', documentoAdjunto);

    revalidatePath(`/dashboard/rrhh/persona/${idPersona}`);

    return { ok: true, documentoAdjunto };
  } catch (error) {
    console.error('Error al crear documento adjunto:', error);
    return { ok: false, error: 'Error al adjuntar documento.' };
  }
}