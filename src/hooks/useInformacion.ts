// hooks/useInformacion.ts
import { useCallback, useState } from "react";
import { getTiposDocumento } from "@/actions/document/tipo-documentg-get";
 
import { getTiposDocumentoAdjunto } from "@/actions/document/tipo-documento-adjunto";
import { getDepartamentosByPais } from "@/actions/pais/departamentoService";
import { getProvinciasByDepartamento } from "@/actions/pais/provinciaService";
import { getDistritosByProvincia } from "@/actions/pais/distritoService";

interface Option {
  id: number;
  nombre: string;
}

interface TipoDocumento {
    id: number;
    nombre: string;
  }
export const useInformacion = () => {
  const [formDireccion, setFormDireccion] = useState({
    idDepartamento: "",
    idProvincia: "",
    idDistrito: "",
    detalleUbicacion: "",
  });

  const [departamentos, setDepartamentos] = useState<Option[]>([]);
  const [provincias, setProvincias] = useState<Option[]>([]);
  const [distritos, setDistritos] = useState<Option[]>([]);
  const [tiposDocumento, setTiposDocumento] = useState<Option[]>([]);
  const [tiposDocumentoAdjunto, setTiposDocumentoAdjunto] = useState<TipoDocumento[]>([]);
  // Cargar departamentos (por defecto usando idPais = 1, puedes parametrizar si quieres)
  const cargarDepartamentos = useCallback(async (idPais: number) => {
    const departamentoData = await getDepartamentosByPais(idPais);
    setDepartamentos(departamentoData.map(d => ({ id: d.idDepartamento, nombre: d.nombreDepartamento })));
    setProvincias([]);
    setDistritos([]);
    setFormDireccion(prev => ({
      ...prev,
      idDepartamento: "",
      idProvincia: "",
      idDistrito: "",
    }));
  }, []);

  const cargarProvincias = useCallback(async (idDepartamento: number | undefined) => {
    if (idDepartamento) {
      const provinciasData = await getProvinciasByDepartamento(idDepartamento);
      setProvincias(provinciasData.map(p => ({ id: p.idProvincia, nombre: p.nombreProvincia })));
      setDistritos([]);
      setFormDireccion(prev => ({
        ...prev,
        idProvincia: "",
        idDistrito: "",
      }));
    } else {
      setProvincias([]);
      setDistritos([]);
      setFormDireccion(prev => ({
        ...prev,
        idProvincia: "",
        idDistrito: "",
      }));
    }
  }, []);

  const cargarDistritos = useCallback(async (idProvincia: number | undefined) => {
    if (idProvincia) {
      const distritosData = await getDistritosByProvincia(idProvincia);
      setDistritos(distritosData.map(d => ({ id: d.idDistrito, nombre: d.nombreDistrito })));
      setFormDireccion(prev => ({
        ...prev,
        idDistrito: "",
      }));
    } else {
      setDistritos([]);
      setFormDireccion(prev => ({
        ...prev,
        idDistrito: "",
      }));
    }
  }, []);

  const cargarTiposDocumento = useCallback(async () => {
    const data = await getTiposDocumento();
    setTiposDocumento(data.map((td: any) => ({
      id: td.idTipoDocumento,
      nombre: td.nombreTipoDocumento
    })));
  }, []);

  const cargarTiposDocumentoAdjunto = useCallback(async () => {
    const data = await getTiposDocumentoAdjunto();
    setTiposDocumentoAdjunto(data.map((td: any) => ({
      id: td.idTipoDocumentoAdjunto,
      nombre: td.nombreTipo
    })));
  }, []);

  return {
    formDireccion,
    setFormDireccion,
    departamentos,
    provincias,
    distritos,
    tiposDocumento,
    cargarDepartamentos,
    cargarProvincias,
    cargarDistritos,
    cargarTiposDocumento,
    cargarTiposDocumentoAdjunto,
    tiposDocumentoAdjunto
  };
};
