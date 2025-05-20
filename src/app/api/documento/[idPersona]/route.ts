import { getDocumentosByPersona } from "@/actions/document/getDocumentosByPersona";
import { NextRequest, NextResponse } from "next/server";
 
// 👇 Fuerza la ruta a ser dinámica (y evita el error)
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: { idPersona: string } }
) {
  const id = Number(context.params.idPersona);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const documentos = await getDocumentosByPersona(id);
  return NextResponse.json(documentos);
}