"use server"
import prisma from "@/lib/prisma";
import { Departamento } from "@prisma/client";
export async function getDepartamentosByPais(idPais: number): Promise<Departamento[]> {
    return prisma.departamento.findMany({
      where: {
        idPais,
        estado: true,
      },
      orderBy: { nombreDepartamento: 'asc' }
    });
  }