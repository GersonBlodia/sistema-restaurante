import { NextRequest, NextResponse } from 'next/server';

const TOKEN = '4849bc50f4c1f6052ae7ca3ec081f0123e1eeaccae318347178658e8f67d800f';  

export async function POST(req: NextRequest) {
  try {
    // Obtener el cuerpo de la solicitud
    const { dni } = await req.json();

    if (!dni || dni.length !== 8) {
      return NextResponse.json({ error: 'DNI es requerido y debe tener 8 dígitos' }, { status: 400 });
    }

    // Realizar la consulta a la API de apiperu.dev
    const response = await fetch('https://apiperu.dev/api/dni', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ dni }), // Enviar el DNI en el cuerpo de la solicitud
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json({ error: result.message || 'Error al consultar RENIEC' }, { status: response.status });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
