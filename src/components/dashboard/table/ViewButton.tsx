"use client";

import { useState } from "react";
import { getPersona } from "@/actions/persona/get-person";
import { BadgeCheck, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/UI/dialog";
 
 

interface DocumentoAdjunto {
  idDocumentoAdjunto: number;
  nombreArchivo: string;
  rutaArchivo: string;
  tipoDocumento: string;
  fechaSubida: Date;
}

interface TipoDocumento {
  idTipoDocumento: number;
  nombreTipoDocumento: string;
}

interface Persona {
  idPersona: number;
  nombre: string;
  apellido: string;
  tipoDocumento: TipoDocumento;
}

export function ViewButton({ id }: { id: number }) {
  const [open, setOpen] = useState(false);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [documentos, setDocumentos] = useState<DocumentoAdjunto[]>([]);

  async function handleView() {
    const [personaData, documentosRes] = await Promise.all([
      getPersona(id),
      fetch(`/api/documento/${id}`).then((res) => res.json()),
    ]);
    
    setPersona(personaData);
    setDocumentos(documentosRes);
    setOpen(true);
  }
   console.log(documentos);
  return (
    <>
      <Button onClick={handleView} >
        Ver
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <BadgeCheck className="text-green-500" /> Detalle de Persona
              </DialogTitle>
              <DialogDescription>
                Visualización completa del perfil y documentos.
              </DialogDescription>
            </DialogHeader>

            {persona && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Nombre:</strong> {persona.nombre}
                  </p>
                  <p>
                    <strong>Apellido:</strong> {persona.apellido}
                  </p>
                  <p>
                    <strong>Tipo Documento:</strong>{" "}
                    {persona.tipoDocumento.nombreTipoDocumento}
                  </p>
                </div>

                {persona.tipoDocumento.idTipoDocumento !== 1 &&
                  documentos.length > 0 && (
                    <div>
                      <p className="font-semibold">Vista Previa del Documento</p>
                      <iframe
                         src={documentos[0].rutaArchivo}
                        className="w-full h-64 border rounded shadow"
                      />
                    </div>
                  )}
              </div>
            )}

            {documentos.length > 0 && (
              <div className="pt-4">
                <p className="font-semibold mb-2">Archivos Adjuntos:</p>
                <ul className="list-disc ml-5 space-y-1">
                  {documentos.map((doc) => (
                    <li key={doc.idDocumentoAdjunto}>
                      <a
                        href={doc.rutaArchivo}
                        target="_blank"
                        className="text-blue-600 underline flex items-center gap-1"
                      >
                        <FileText className="w-4 h-4" /> {doc.nombreArchivo}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
