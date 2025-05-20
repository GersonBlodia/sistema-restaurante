"use server"
import prisma from "@/lib/prisma";
import { Pais } from "@prisma/client";
export async function GetPais (): Promise<Pais[]> {
    const paises=await prisma.pais.findMany({
        where:{
            estado: true
        },
        orderBy:{
            nombrePais:'asc'
        }
    });
    return paises; 
}

 