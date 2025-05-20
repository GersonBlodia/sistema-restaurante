"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
 
import { usePersonStore } from "@/store/personStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/UI/input";
import { ViewButton } from "./ViewButton";

interface Persona {
  idPersona: number;
  nombre: string;
  apellido: string;
  dni: string;
  status?: string;
  tipoDocumento?: {
    nombreTipoDocumento: string;
  };
}

function Filters() {
  const { search, setSearch } = usePersonStore();
  return (
    <div className="relative max-w-sm w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
      <Input
        placeholder="Buscar por nombre o apellido"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-10 pr-4 py-2 bg-white border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function SortableHeader({ field, label }: { field: string; label: string }) {
  const { sortBy, sortDirection, setSort } = usePersonStore();
  const isActive = sortBy === field;
  const Icon = sortDirection === "asc" ? ArrowUp : ArrowDown;

  return (
    <div
      onClick={() => setSort(field)}
      className={cn(
        "cursor-pointer select-none flex items-center gap-1 transition-colors",
        isActive ? "text-blue-600 font-semibold" : "hover:text-blue-500"
      )}
    >
      {label}
      {isActive && <Icon className="w-4 h-4" />}
    </div>
  );
}

const StatusBadge = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-red-100 text-red-700",
    Pending: "bg-yellow-100 text-yellow-700",
    "On Sale": "bg-blue-100 text-blue-700",
    Bouncing: "bg-purple-100 text-purple-700",
    default: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={cn(
        "px-2 py-1 text-xs rounded-full font-medium",
        colorMap[status] || colorMap.default
      )}
    >
      {status}
    </span>
  );
};

export const TablaPerson = ({ personas }: { personas: Persona[] }) => {
  const { search, sortBy, sortDirection } = usePersonStore();
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const filteredSorted = useMemo(() => {
    const searchLower = search.toLowerCase();
    const filtered = personas.filter((p) =>
      `${p.nombre} ${p.apellido}`.toLowerCase().includes(searchLower)
    );

    const sorted = filtered.sort((a, b) => {
      const aVal = a[sortBy as keyof Persona]?.toString().toLowerCase() ?? "";
      const bVal = b[sortBy as keyof Persona]?.toString().toLowerCase() ?? "";
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [personas, search, sortBy, sortDirection]);

  const totalPages = Math.ceil(filteredSorted.length / itemsPerPage);
  const paginated = filteredSorted.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Lista de Personas</h2>
        <Filters />
      </div>

      <div className="overflow-auto rounded-lg">
        <Table className="w-full min-w-[700px] text-sm">
          <TableHeader className="bg-gray-50">
            <TableRow className="text-left text-gray-700 uppercase tracking-wider">
              <TableHead className="px-4 py-3">
                <SortableHeader field="dni" label="DNIs" />
              </TableHead>
              <TableHead className="px-4 py-3">
                <SortableHeader field="nombre" label="Nombre" />
              </TableHead>
              <TableHead className="px-4 py-3">
                <SortableHeader field="apellido" label="Apellido" />
              </TableHead>
              <TableHead className="px-4 py-3">
                <SortableHeader field="tipoDocumento" label="Tipo Documento" />
              </TableHead>
              <TableHead className="px-4 py-3">Status</TableHead>
              <TableHead className="px-4 py-3">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((p) => (
              <TableRow key={p.idPersona} className="hover:bg-gray-50">
                <TableCell>{p.dni ?? "-"}</TableCell>
                <TableCell>{p.nombre}</TableCell>
                <TableCell>{p.apellido}</TableCell>
                <TableCell>{p.tipoDocumento?.nombreTipoDocumento ?? "N/A"}</TableCell>
                <TableCell>
                  <StatusBadge status={p.status ?? "Active"} />
                </TableCell>
                <TableCell className="space-x-2 px-4">
                  <ViewButton id={p.idPersona} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end items-center mt-4 gap-2 text-sm">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </motion.div>
  );
};
