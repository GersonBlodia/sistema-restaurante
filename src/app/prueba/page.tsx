// app/prueba/page.tsx
"use client";

import { useSession } from "next-auth/react";

export default function Prueba() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Cargando...</p>;
  if (status === "authenticated") return <p>Bienvenido {session.user?.name} {session.user.email} {session.user.rol}</p>;

  return <p>No has iniciado sesión</p>;
}
