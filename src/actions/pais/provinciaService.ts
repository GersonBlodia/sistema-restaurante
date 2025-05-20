"use server"
import prisma from "@/lib/prisma";
import { Provincia } from "@prisma/client";
export async function getProvinciasByDepartamento(idDepartamento: number): Promise<Provincia[]> {
    return prisma.provincia.findMany({
      where: {
        idDepartamento,
        estado: true,
      },
      orderBy: { nombreProvincia: 'asc' }
    });
  }