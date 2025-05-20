"use server"
import prisma from "@/lib/prisma";
import { Distrito } from "@prisma/client";
export async function getDistritosByProvincia(idProvincia: number): Promise<Distrito[]> {
    return prisma.distrito.findMany({
      where: {
        idProvincia,
        estado: true,
      },
      orderBy: { nombreDistrito: 'asc' }
    });
  }