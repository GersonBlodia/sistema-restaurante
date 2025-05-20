"use client";
import { useEffect, useState } from "react";
 
import { useForm, Controller } from "react-hook-form";
import { crearPersonaAction } from "@/actions/persona/post-persona";
import { crearDocumentoAdjuntoAction } from "@/actions/document/crearDocumentoAdjuntoAction";
import { crearDireccionUbicacionAction } from "@/actions/pais/crearDireccionUbicacionAction";
import { motion, AnimatePresence } from "framer-motion";
 
 
import {  Upload, Check, AlertCircle, FileText, UserCircle } from "lucide-react";
 
import { Loader2 } from "lucide-react";
 
 
 
 
 
 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/UI/select";
import { Input } from "@/components/UI/input";
import { AlertDialog, Button } from "@/components/ui";
import { useInformacion } from "@/hooks/useInformacion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Alert } from "@/components/ui/alert";
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
 
interface FormValues {
  idTipoDocumento?: number;
  dni?: string | number;
  nombre: string;
  apellido: string;
  telefono?: string;
  genero?: 'Masculino' | 'Femenino' | 'Otro' | 'No_Binario';
  fechaNacimiento?: string;
  idDepartamento?: string;
  idProvincia?: string;
  idDistrito?: string;
  detalleUbicacion?: string;
  idTipoDocumentoAdjunto: number;
  archivo: File;
}

export const PersonCreateForm = () => {
  const {
    departamentos,
    provincias,
    distritos,
    cargarDepartamentos,
    cargarProvincias,
    cargarDistritos,
    cargarTiposDocumento,
  } = useInformacion();

  console.log(departamentos)
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      idTipoDocumento: undefined,
      dni: "",
      nombre: "",
      apellido: "",
      telefono: "",
      genero: undefined,
      fechaNacimiento: "",
      idDepartamento: "",
      idProvincia: "",
      idDistrito: "",
      detalleUbicacion: "",
      idTipoDocumentoAdjunto: undefined,
      archivo: undefined, 
    },
  });
 
  const [archivoFile, setArchivo] = useState<File | null>(null);
  const [selectedTipoDocumento, setSelectedTipoDocumento] = useState<number>(0);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<string>("personal");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArchivo(e.target.files[0]);
      simulateUpload();
    }
  };
  
  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const selectedDepartamento = watch("idDepartamento");
  const selectedProvincia = watch("idProvincia");
   
  useEffect(() => {
    cargarDepartamentos(22);
    cargarTiposDocumento();
  }, [cargarDepartamentos, cargarTiposDocumento]);

  useEffect(() => {
    if (selectedDepartamento) {
      cargarProvincias(Number(selectedDepartamento));
      setValue("idProvincia", "");
      setValue("idDistrito", "");
    }
  }, [selectedDepartamento, cargarProvincias, setValue]);

  useEffect(() => {
    if (selectedProvincia) {
      cargarDistritos(Number(selectedProvincia));
      setValue("idDistrito", "");
    }
  }, [selectedProvincia, cargarDistritos, setValue]);

  const onSubmit = async (data: FormValues) => {
    setSubmitStatus('idle');
    try {
      // 1. Crear DirecciónUbicacion primero
      const resultadoDireccion = await crearDireccionUbicacionAction({
        idDistrito: Number(data.idDistrito),
        detalleUbicacion: data.detalleUbicacion as string,
      });

      if (!resultadoDireccion.ok) {
        throw new Error('Error al crear dirección');
      }

      const idDireccionUbicacion = resultadoDireccion?.direccion?.idDireccionUbicacion;

      // 2. Crear Persona con idDireccionUbicacion
      const resultadoPersona = await crearPersonaAction({
        nombre: data.nombre,
        apellido: data.apellido,
        idTipoDocumento: data.idTipoDocumento,
        dni: selectedTipoDocumento === 91 ? Number(data.dni) : undefined,
        telefono: data.telefono,
        genero: data.genero,
        fechaNacimiento: data.fechaNacimiento,
        idDireccionUbicacion: idDireccionUbicacion,
      });

      if (!resultadoPersona.ok) {
        throw new Error('Error al crear persona');
      }

      const personaCreada = resultadoPersona.persona;
      if(Number(personaCreada?.idTipoDocumento) !== 1 && archivoFile){
        const resultadoDocumento = await crearDocumentoAdjuntoAction({
          idPersona: personaCreada?.idPersona,
          idTipoDocumentoAdjunto: 92,
          archivo: archivoFile,
        });

        if (!resultadoDocumento.ok) {
          throw new Error('Error al crear documento adjunto');
        }
      }
      
      setSubmitStatus('success');

    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    }
  };

  const nextTab = () => {
    if (activeTab === "personal") setActiveTab("ubicacion");
  };

  const previousTab = () => {
    if (activeTab === "ubicacion") setActiveTab("personal");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 max-w-2xl mx-auto"
    >
      <Card className="border-none shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader  className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Registro de Persona
          </CardTitle>
          <CardDescription className="text-center text-slate-500 dark:text-slate-400">
            Complete el formulario para registrar una nueva persona en el sistema
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="personal" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Datos Personales
                </TabsTrigger>
                <TabsTrigger value="ubicacion" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <FileText className="mr-2 h-4 w-4" />
                  Ubicación
                </TabsTrigger>
              </TabsList>
            </div>

            <CardContent>
              <TabsContent value="personal" className="space-y-4 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tipo de Documento */}
                  <div className="space-y-2">
                    
                    <Controller
                      name="idTipoDocumento"
                      control={control}
                      rules={{ required: "El tipo de documento es obligatorio" }}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => {
                            field.onChange(Number(value));
                            setSelectedTipoDocumento(Number(value));
                          }}
                          value={field.value?.toString() || ""}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione tipo de documento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="91">DNI</SelectItem>
                            <SelectItem value="92">Carné de Extranjería</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.idTipoDocumento && 
                      <p className="text-red-500 text-sm">{errors.idTipoDocumento.message}</p>
                    }
                  </div>

                  {/* Número de DNI - Condicional */}
                  <AnimatePresence mode="wait">
                    {selectedTipoDocumento === 91? (
                      <motion.div 
                        key="dni"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2"
                      >
                        
                        <Input
                          {...register("dni", {
                            required: "El número de DNI es obligatorio",
                            minLength: { value: 8, message: "Debe tener 8 dígitos" },
                            maxLength: { value: 8, message: "Debe tener 8 dígitos" },
                            pattern: { value: /^[0-9]+$/, message: "Solo números" },
                          })}
                          placeholder="Ingrese el número de DNI"
                          className="w-full"
                        />
                        {errors.dni && 
                          <p className="text-red-500 text-sm">{errors.dni.message}</p>
                        }
                      </motion.div>
                    ) : selectedTipoDocumento === 2 ? (
                      <motion.div 
                        key="fileUpload"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2"
                      >
           
                        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative">
                          <input
                            type="file"
                            id="archivo"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          {!archivoFile ? (
                            <div className="flex flex-col items-center justify-center py-2">
                              <Upload className="h-8 w-8 text-slate-400 mb-2" />
                              <p className="text-sm text-slate-500">
                                Haga clic para subir o arrastre y suelte
                              </p>
                              <p className="text-xs text-slate-400">
                                JPG, PNG o PDF (máx. 5MB)
                              </p>
                            </div>
                          ) : isUploading ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-center">
                                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                                <span className="ml-2 text-sm text-slate-600 dark:text-slate-300">
                                  Subiendo archivo...
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-2">
                              <Check className="h-5 w-5 text-green-500" />
                              <span className="text-sm text-slate-600 dark:text-slate-300 truncate max-w-[180px]">
                                {archivoFile.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <div key="empty" className="hidden md:block"></div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {/* Nombres */}
                  <div className="space-y-2">
                   
                    <Input
                      {...register("nombre", { required: "Los nombres son obligatorios" })}
                      placeholder="Ingrese nombres"
                      className="w-full"
                    />
                    {errors.nombre && 
                      <p className="text-red-500 text-sm">{errors.nombre.message}</p>
                    }
                  </div>

                  {/* Apellidos */}
                  <div className="space-y-2">
                  
                    <Input
                      {...register("apellido", { required: "Los apellidos son obligatorios" })}
                      placeholder="Ingrese apellidos"
                      className="w-full"
                    />
                    {errors.apellido && 
                      <p className="text-red-500 text-sm">{errors.apellido.message}</p>
                    }
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {/* Teléfono */}
                  <div className="space-y-2">
                
                    <Input
                      {...register("telefono", {
                        required: "El teléfono es obligatorio",
                        minLength: { value: 7, message: "Debe tener al menos 7 dígitos" },
                        pattern: { value: /^[0-9]+$/, message: "Solo números" },
                      })}
                      placeholder="Ingrese teléfono"
                      className="w-full"
                    />
                    {errors.telefono && 
                      <p className="text-red-500 text-sm">{errors.telefono.message}</p>
                    }
                  </div>

                  {/* Fecha de Nacimiento */}
                  <div className="space-y-2 mt-2">
  <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700">
    Fecha de nacimiento
  </label>
  <Controller
    name="fechaNacimiento"
    control={control}
    render={({ field }) => (
      <input
        type="date"
        id="fechaNacimiento"
        className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
        value={field.value ? field.value.split('T')[0] : ''} // solo YYYY-MM-DD
        onChange={(e) => field.onChange(e.target.value)}
      />
    )}
  />
</div>

                </div>

                <div className="space-y-2 mt-2">
  <Controller
    name="genero"
    control={control}
    render={({ field }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="px-4 py-2 bg-gray-200 rounded cursor-pointer">
            {field.value || "Selecciona género"}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            onValueChange={field.onChange}
            value={field.value}
          >
            <DropdownMenuRadioItem value="Masculino">
              Masculino
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Femenino">
              Femenino
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="No_Binario">
              No Binario
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Otro">
              Otro
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )}
  />
</div>

                <div className="flex justify-end mt-6">
                  <Button 
                    type="button" 
                    onClick={nextTab}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Siguiente
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="ubicacion" className="space-y-4 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Departamento */}
                  <div className="space-y-2">
                   
                    <Controller
                      name="idDepartamento"
                      control={control}
                      rules={{ required: "Seleccione un departamento" }}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          value={field.value?.toString() || ""}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione departamento" />
                          </SelectTrigger>
                          <SelectContent>
                            {departamentos.map((dep) => (
                              <SelectItem key={dep.id} value={dep.id.toString()}>
                                {dep.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.idDepartamento && 
                      <p className="text-red-500 text-sm">{errors.idDepartamento.message}</p>
                    }
                  </div>

                  {/* Provincia */}
                  <div className="space-y-2">
                  
                    <Controller
                      name="idProvincia"
                      control={control}
                      rules={{ required: "Seleccione una provincia" }}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          value={field.value?.toString() || ""}
                          disabled={!selectedDepartamento}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione provincia" />
                          </SelectTrigger>
                          <SelectContent>
                            {provincias.map((prov) => (
                              <SelectItem key={prov.id} value={prov.id.toString()}>
                                {prov.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.idProvincia && 
                      <p className="text-red-500 text-sm">{errors.idProvincia.message}</p>
                    }
                  </div>

                  {/* Distrito */}
                  <div className="space-y-2">
                    
                    <Controller
                      name="idDistrito"
                      control={control}
                      rules={{ required: "Seleccione un distrito" }}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          value={field.value?.toString() || ""}
                          disabled={!selectedProvincia}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione distrito" />
                          </SelectTrigger>
                          <SelectContent>
                            {distritos.map((dist) => (
                              <SelectItem key={dist.id} value={dist.id.toString()}>
                                {dist.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.idDistrito && 
                      <p className="text-red-500 text-sm">{errors.idDistrito.message}</p>
                    }
                  </div>
                </div>

                {/* Detalle Ubicación */}
                <div className="space-y-2 mt-2">
                  
                  <Input
                    {...register("detalleUbicacion", {
                      required: "El detalle de ubicación es obligatorio",
                      minLength: { value: 5, message: "Debe tener al menos 5 caracteres" },
                    })}
                    placeholder="Ejemplo: Calle Los Pinos 123, Mz. B, Lt. 5"
                    className="w-full"
                  />
                  {errors.detalleUbicacion && 
                    <p className="text-red-500 text-sm">{errors.detalleUbicacion.message}</p>
                  }
                </div>

                <div className="flex justify-between mt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={previousTab}
                  >
                    Anterior
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : "Guardar Registro"}
                  </Button>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </form>

        <AnimatePresence>
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-6 pb-6"
            >
               <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button>Mostrar alerta</Button>
  </AlertDialogTrigger>

  <AlertDialogContent>
    <AlertDialogTitle>Confirmación</AlertDialogTitle>
    <AlertDialogDescription>
      Registro guardado correctamente
    </AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction>Aceptar</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-6 pb-6"
            >
              <Alert className="bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-900 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDialogDescription>
                  Error al guardar el registro. Intente nuevamente.
                </AlertDialogDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <CardFooter className="flex flex-col items-center justify-center text-xs text-slate-500 border-t pt-4">
          <p>Sistema de Registro - 2025</p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};