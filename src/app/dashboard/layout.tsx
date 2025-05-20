
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/layout/LayoutDashboard";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const roleAccessMap: Record<string, string[]> = {
  Administrador: ["admin", "rrhh", "cocinero", "mesero", "limpieza", "inventario", "empleados"],
  RRHH: ["rrhh", "inventario", "empleados"],
  Cocinero: ["cocinero", "inventario", "mesas"],
  Mesero: ["mesero", "mesas"],
  Limpieza: ["limpieza"],
};

export default async function DashboardLayoutss({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/login");
  }

  const userRole = session.user?.rol || "SinRol";
  const headersList = await headers();
  const currentPath = headersList.get("x-pathname") || "";

  // Extraer sección de acceso desde la URL
  const matchedSection = currentPath.split("/dashboard/")[1]?.split("/")[0];

  const allowedSections = roleAccessMap[userRole] || [];

  if (matchedSection && !allowedSections.includes(matchedSection)) {
    redirect("/dashboard"); // acceso denegado
  }

  return <DashboardLayout session={session}>{children}</DashboardLayout>;
}
