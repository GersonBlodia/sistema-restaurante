'use server';
import prisma from '@/lib/prisma';

interface CrearPersonaData {
  nombre: string;
  apellido: string;
  idTipoDocumento?: number; // opcional
  dni?: number;
  telefono?: string;
  genero?: 'Masculino' | 'Femenino' | 'Otro' | 'No_Binario';
  fechaNacimiento?: string; // YYYY-MM-DD
  idDireccionUbicacion?: number; // opcional
}
const ID_DOCUMENTO_DNI = 1;

export async function crearPersonaAction(data: CrearPersonaData) {
  try {

    // Verificar si el DNI ya existe
    if (data.idTipoDocumento === ID_DOCUMENTO_DNI && data.dni) {
      const personaExistente = await prisma.persona.findUnique({
        where: { dni: data.dni },
      });

      if (personaExistente) {
        return { error: 'El DNI ya está registrado.' };
      }
    }
    console.log(data)
    const nuevaPersona = await prisma.persona.create({
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        idTipoDocumento: Number(data.idTipoDocumento) ?? null,
        dni: data.dni ?? null,
        telefono: data.telefono ?? null,
        genero: data.genero ?? null,
        fechaNacimiento: data.fechaNacimiento
          ? new Date(data.fechaNacimiento)
          : null,
        idDireccionUbicacion: data.idDireccionUbicacion ?? null,
      },
    });

    return { ok: true, persona: nuevaPersona };
  } catch (error) {
    console.error('Error al crear persona:', error);
    return { ok: false, error: 'Error al crear la persona' };
  }
}
