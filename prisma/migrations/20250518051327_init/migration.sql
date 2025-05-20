-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('Administrador', 'Cocinero', 'Mesero', 'Limpieza', 'Asistente', 'RRHH');

-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('Masculino', 'Femenino', 'Otro', 'No Binario');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo');

-- CreateEnum
CREATE TYPE "TipoAusencia" AS ENUM ('Vacaciones', 'Permiso', 'Licencia_por_Enfermedad', 'Otro');

-- CreateEnum
CREATE TYPE "EstadoAusencia" AS ENUM ('Pendiente', 'Aprobado', 'Rechazado');

-- CreateEnum
CREATE TYPE "EstadoOrden" AS ENUM ('Pendiente', 'Parcial', 'Completada', 'Cancelada');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('Entrada', 'Salida', 'Ajuste', 'Merma', 'Transferencia');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('Pendiente', 'EnPreparacion', 'Listo', 'Entregado', 'Cancelado');

-- CreateTable
CREATE TABLE "Pais" (
    "idPais" SERIAL NOT NULL,
    "nombrePais" VARCHAR(100) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Pais_pkey" PRIMARY KEY ("idPais")
);

-- CreateTable
CREATE TABLE "Departamento" (
    "idDepartamento" SERIAL NOT NULL,
    "idPais" INTEGER NOT NULL,
    "nombreDepartamento" VARCHAR(100) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Departamento_pkey" PRIMARY KEY ("idDepartamento")
);

-- CreateTable
CREATE TABLE "Provincia" (
    "idProvincia" SERIAL NOT NULL,
    "idDepartamento" INTEGER NOT NULL,
    "nombreProvincia" VARCHAR(100) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Provincia_pkey" PRIMARY KEY ("idProvincia")
);

-- CreateTable
CREATE TABLE "Distrito" (
    "idDistrito" SERIAL NOT NULL,
    "idProvincia" INTEGER NOT NULL,
    "nombreDistrito" VARCHAR(100) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Distrito_pkey" PRIMARY KEY ("idDistrito")
);

-- CreateTable
CREATE TABLE "DireccionUbicacion" (
    "idDireccionUbicacion" SERIAL NOT NULL,
    "idDistrito" INTEGER NOT NULL,
    "detalleUbicacion" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DireccionUbicacion_pkey" PRIMARY KEY ("idDireccionUbicacion")
);

-- CreateTable
CREATE TABLE "Tipo_Documento" (
    "idTipoDocumento" SERIAL NOT NULL,
    "nombreTipoDocumento" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "nacionalidadAproximada" TEXT,

    CONSTRAINT "Tipo_Documento_pkey" PRIMARY KEY ("idTipoDocumento")
);

-- CreateTable
CREATE TABLE "Tipo_Documento_Adjunto" (
    "idTipoDocumentoAdjunto" SERIAL NOT NULL,
    "nombreTipo" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Tipo_Documento_Adjunto_pkey" PRIMARY KEY ("idTipoDocumentoAdjunto")
);

-- CreateTable
CREATE TABLE "DocumentoAdjunto" (
    "idDocumentoAdjunto" SERIAL NOT NULL,
    "idPersona" INTEGER NOT NULL,
    "idTipoDocumentoAdjunto" INTEGER NOT NULL,
    "nombreArchivo" VARCHAR(255) NOT NULL,
    "rutaArchivo" VARCHAR(255) NOT NULL,
    "fechaSubida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DocumentoAdjunto_pkey" PRIMARY KEY ("idDocumentoAdjunto")
);

-- CreateTable
CREATE TABLE "Persona" (
    "idPersona" SERIAL NOT NULL,
    "idDireccionUbicacion" INTEGER,
    "idTipoDocumento" INTEGER,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "dni" INTEGER,
    "telefono" CHAR(9),
    "genero" "Genero",
    "fechaNacimiento" TIMESTAMP(3),
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("idPersona")
);

-- CreateTable
CREATE TABLE "Empleado" (
    "idEmpleado" SERIAL NOT NULL,
    "idPersona" INTEGER NOT NULL,
    "rol" "Rol" NOT NULL,
    "horario" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "sueldo" DOUBLE PRECISION,
    "contratoInicio" TIMESTAMP(3),
    "contratoFinal" TIMESTAMP(3),

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("idEmpleado")
);

-- CreateTable
CREATE TABLE "EmpleadoDiaSemana" (
    "id" SERIAL NOT NULL,
    "idEmpleado" INTEGER NOT NULL,
    "dia" "DiaSemana" NOT NULL,

    CONSTRAINT "EmpleadoDiaSemana_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departamento_rrhh" (
    "idDepartamentoRRHH" SERIAL NOT NULL,
    "nombreDepartamento" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Departamento_rrhh_pkey" PRIMARY KEY ("idDepartamentoRRHH")
);

-- CreateTable
CREATE TABLE "Puesto_trabajo" (
    "idPuestoTrabajo" SERIAL NOT NULL,
    "idDepartamentoRRHH" INTEGER NOT NULL,
    "nombrePuesto" TEXT NOT NULL,
    "descripcionPuesto" TEXT NOT NULL,
    "requisitos" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Puesto_trabajo_pkey" PRIMARY KEY ("idPuestoTrabajo")
);

-- CreateTable
CREATE TABLE "InfoEmpleadoRRHH" (
    "idInfoEmpleadoRRHH" SERIAL NOT NULL,
    "idEmpleado" INTEGER NOT NULL,
    "idPuestoTrabajo" INTEGER,
    "fechaContratacion" TIMESTAMP(3),
    "salario" DECIMAL(10,2),
    "tipoContrato" VARCHAR(50),
    "departamentoAsignado" VARCHAR(100),
    "fechaFinContrato" TIMESTAMP(3),

    CONSTRAINT "InfoEmpleadoRRHH_pkey" PRIMARY KEY ("idInfoEmpleadoRRHH")
);

-- CreateTable
CREATE TABLE "EvaluacionDesempeno" (
    "idEvaluacion" SERIAL NOT NULL,
    "idEmpleado" INTEGER NOT NULL,
    "fechaEvaluacion" TIMESTAMP(3) NOT NULL,
    "evaluador" VARCHAR(100),
    "comentarios" TEXT,
    "puntuacionGeneral" DECIMAL(3,2),
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EvaluacionDesempeno_pkey" PRIMARY KEY ("idEvaluacion")
);

-- CreateTable
CREATE TABLE "HistorialEmpleado" (
    "idHistorial" SERIAL NOT NULL,
    "idEmpleado" INTEGER NOT NULL,
    "fechaCambio" TIMESTAMP(3) NOT NULL,
    "tipoCambio" VARCHAR(100) NOT NULL,
    "descripcionCambio" TEXT,
    "idPuestoTrabajoAnterior" INTEGER,
    "idPuestoTrabajoNuevo" INTEGER,
    "salarioAnterior" DECIMAL(10,2),
    "salarioNuevo" DECIMAL(10,2),

    CONSTRAINT "HistorialEmpleado_pkey" PRIMARY KEY ("idHistorial")
);

-- CreateTable
CREATE TABLE "Capacitacion" (
    "idCapacitacion" SERIAL NOT NULL,
    "nombreCurso" VARCHAR(100) NOT NULL,
    "descripcionCurso" TEXT,
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Capacitacion_pkey" PRIMARY KEY ("idCapacitacion")
);

-- CreateTable
CREATE TABLE "EmpleadoCapacitacion" (
    "idEmpleadoCapacitacion" SERIAL NOT NULL,
    "idEmpleado" INTEGER NOT NULL,
    "idCapacitacion" INTEGER NOT NULL,
    "fechaRealizacion" TIMESTAMP(3),
    "resultado" VARCHAR(50),

    CONSTRAINT "EmpleadoCapacitacion_pkey" PRIMARY KEY ("idEmpleadoCapacitacion")
);

-- CreateTable
CREATE TABLE "Ausencia" (
    "idAusencia" SERIAL NOT NULL,
    "idEmpleado" INTEGER NOT NULL,
    "tipoAusencia" "TipoAusencia" NOT NULL,
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),
    "motivo" TEXT,
    "estado" "EstadoAusencia" NOT NULL DEFAULT 'Pendiente',

    CONSTRAINT "Ausencia_pkey" PRIMARY KEY ("idAusencia")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "idUsuario" SERIAL NOT NULL,
    "idEmpleado" INTEGER NOT NULL,
    "correo" VARCHAR(150) NOT NULL,
    "userName" VARCHAR(100),
    "contrasena" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "verificationTokenExpiry" TIMESTAMP(3),
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "resetPasswordToken" TEXT,
    "resetPasswordExpires" TIMESTAMP(3),
    "resetRequestedIp" TEXT,
    "resetRequestedUserAgent" TEXT,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "MensajeInterno" (
    "idMensaje" SERIAL NOT NULL,
    "idRemitente" INTEGER,
    "idDestinatario" INTEGER,
    "asunto" VARCHAR(150),
    "contenido" TEXT,
    "fechaEnvio" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leido" BOOLEAN NOT NULL DEFAULT true,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MensajeInterno_pkey" PRIMARY KEY ("idMensaje")
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "idNotificacion" SERIAL NOT NULL,
    "idUsuario" INTEGER,
    "correo" TEXT NOT NULL,
    "mensaje" TEXT,
    "tipo" VARCHAR(50),
    "fecha" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leido" BOOLEAN NOT NULL DEFAULT true,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("idNotificacion")
);

-- CreateTable
CREATE TABLE "MensajeChat" (
    "idMensaje" SERIAL NOT NULL,
    "idRemitente" INTEGER,
    "idReceptor" INTEGER,
    "contenido" TEXT,
    "fechaEnvio" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MensajeChat_pkey" PRIMARY KEY ("idMensaje")
);

-- CreateTable
CREATE TABLE "Tipo_proveedor" (
    "idTipoProveedor" SERIAL NOT NULL,
    "nombreTipo" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Tipo_proveedor_pkey" PRIMARY KEY ("idTipoProveedor")
);

-- CreateTable
CREATE TABLE "Proveedores" (
    "idProveedores" SERIAL NOT NULL,
    "idTipoProveedor" INTEGER,
    "nombreProveedor" VARCHAR(100) NOT NULL,
    "ruc" VARCHAR(15),
    "telefono" CHAR(9),
    "correo" VARCHAR(150),
    "direccion" TEXT,
    "personaContacto" VARCHAR(100),
    "telefonoContacto" CHAR(9),
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Proveedores_pkey" PRIMARY KEY ("idProveedores")
);

-- CreateTable
CREATE TABLE "OrdenCompra" (
    "idOrdenCompra" SERIAL NOT NULL,
    "idProveedor" INTEGER NOT NULL,
    "numeroOrden" VARCHAR(20) NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaEntrega" TIMESTAMP(3),
    "estado" "EstadoOrden" NOT NULL DEFAULT 'Pendiente',
    "observaciones" TEXT,
    "montoTotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "OrdenCompra_pkey" PRIMARY KEY ("idOrdenCompra")
);

-- CreateTable
CREATE TABLE "DetalleOrdenCompra" (
    "idDetalleOrden" SERIAL NOT NULL,
    "idOrdenCompra" INTEGER NOT NULL,
    "idInsumo" INTEGER NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "cantidadRecibida" DECIMAL(10,2),

    CONSTRAINT "DetalleOrdenCompra_pkey" PRIMARY KEY ("idDetalleOrden")
);

-- CreateTable
CREATE TABLE "Tipo_insumo" (
    "idTipoInsumo" SERIAL NOT NULL,
    "nombreTipo" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Tipo_insumo_pkey" PRIMARY KEY ("idTipoInsumo")
);

-- CreateTable
CREATE TABLE "UnidadMedida" (
    "idUnidadMedida" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "abreviatura" VARCHAR(10) NOT NULL,
    "descripcion" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UnidadMedida_pkey" PRIMARY KEY ("idUnidadMedida")
);

-- CreateTable
CREATE TABLE "Insumo" (
    "idInsumo" SERIAL NOT NULL,
    "idTipoInsumo" INTEGER NOT NULL,
    "idProveedor" INTEGER,
    "idUnidadMedida" INTEGER NOT NULL,
    "codigoInsumo" VARCHAR(50),
    "nombreInsumo" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "imagenInsumo" VARCHAR(255),
    "stock" DECIMAL(10,2) NOT NULL,
    "stockMinimo" DECIMAL(10,2) NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "ubicacionAlmacen" VARCHAR(100),
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Insumo_pkey" PRIMARY KEY ("idInsumo")
);

-- CreateTable
CREATE TABLE "Inventario" (
    "idInventario" SERIAL NOT NULL,
    "idInsumo" INTEGER NOT NULL,
    "idProveedor" INTEGER,
    "lote" VARCHAR(50),
    "cantidad" DECIMAL(10,2) NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaCaducidad" TIMESTAMP(3),
    "precioCompra" DECIMAL(10,2) NOT NULL,
    "facturaCompra" VARCHAR(50),
    "ubicacion" VARCHAR(100),
    "observaciones" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Inventario_pkey" PRIMARY KEY ("idInventario")
);

-- CreateTable
CREATE TABLE "InventarioAuditoria" (
    "idAuditoria" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "fechaAuditoria" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipoAuditoria" VARCHAR(50) NOT NULL,
    "observaciones" TEXT,
    "resultado" TEXT,

    CONSTRAINT "InventarioAuditoria_pkey" PRIMARY KEY ("idAuditoria")
);

-- CreateTable
CREATE TABLE "DetalleAuditoriaInventario" (
    "idDetalleAuditoria" SERIAL NOT NULL,
    "idAuditoria" INTEGER NOT NULL,
    "idInsumo" INTEGER NOT NULL,
    "stockSistema" DECIMAL(10,2) NOT NULL,
    "stockFisico" DECIMAL(10,2) NOT NULL,
    "diferencia" DECIMAL(10,2) NOT NULL,
    "observaciones" TEXT,

    CONSTRAINT "DetalleAuditoriaInventario_pkey" PRIMARY KEY ("idDetalleAuditoria")
);

-- CreateTable
CREATE TABLE "MovimientoInventario" (
    "idMovimiento" SERIAL NOT NULL,
    "idInsumo" INTEGER NOT NULL,
    "idEmpleado" INTEGER NOT NULL,
    "tipoMovimiento" "TipoMovimiento" NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "fechaMovimiento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idReferencia" INTEGER,
    "tipoReferencia" VARCHAR(50),
    "motivo" TEXT,
    "observaciones" TEXT,

    CONSTRAINT "MovimientoInventario_pkey" PRIMARY KEY ("idMovimiento")
);

-- CreateTable
CREATE TABLE "Merma" (
    "idMerma" SERIAL NOT NULL,
    "idInsumo" INTEGER NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivo" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "costoEstimado" DECIMAL(10,2),

    CONSTRAINT "Merma_pkey" PRIMARY KEY ("idMerma")
);

-- CreateTable
CREATE TABLE "Tipo_producto" (
    "idTipoProducto" SERIAL NOT NULL,
    "nombreTipo" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Tipo_producto_pkey" PRIMARY KEY ("idTipoProducto")
);

-- CreateTable
CREATE TABLE "Producto" (
    "idProducto" SERIAL NOT NULL,
    "idTipoProducto" INTEGER NOT NULL,
    "codigoProducto" VARCHAR(50),
    "nombreProducto" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL,
    "imagen" VARCHAR(255),
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("idProducto")
);

-- CreateTable
CREATE TABLE "Tipo_platillo" (
    "idTipoPlatillo" SERIAL NOT NULL,
    "nombreTipo" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Tipo_platillo_pkey" PRIMARY KEY ("idTipoPlatillo")
);

-- CreateTable
CREATE TABLE "Menu" (
    "idMenu" SERIAL NOT NULL,
    "idTipoPlatillo" INTEGER NOT NULL,
    "nombreMenu" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "imagenMenu" VARCHAR(255),
    "precio" DECIMAL(10,2) NOT NULL,
    "tiempoPreparacion" INTEGER,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("idMenu")
);

-- CreateTable
CREATE TABLE "RecetaIngrediente" (
    "idReceta" SERIAL NOT NULL,
    "idMenu" INTEGER NOT NULL,
    "idInsumo" INTEGER NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "observaciones" TEXT,

    CONSTRAINT "RecetaIngrediente_pkey" PRIMARY KEY ("idReceta")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "idPedido" SERIAL NOT NULL,
    "idUsuario" INTEGER,
    "idPersona" INTEGER,
    "idMenu" INTEGER,
    "idProducto" INTEGER,
    "numeroPedido" VARCHAR(20),
    "fechaPedido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "horaEntrega" TIMESTAMP(3),
    "observaciones" TEXT,
    "estadoPedido" "EstadoPedido" NOT NULL DEFAULT 'Pendiente',
    "mesa" VARCHAR(10),
    "esParaLlevar" BOOLEAN NOT NULL DEFAULT false,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("idPedido")
);

-- CreateTable
CREATE TABLE "DetallePedido" (
    "idDetallePedido" SERIAL NOT NULL,
    "idPedido" INTEGER NOT NULL,
    "idMenu" INTEGER,
    "cantidad" INTEGER NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "descuento" DECIMAL(10,2),
    "observaciones" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DetallePedido_pkey" PRIMARY KEY ("idDetallePedido")
);

-- CreateTable
CREATE TABLE "Tipo_pago" (
    "idTipoPago" SERIAL NOT NULL,
    "nombreTipo" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Tipo_pago_pkey" PRIMARY KEY ("idTipoPago")
);

-- CreateTable
CREATE TABLE "Pago" (
    "idPago" SERIAL NOT NULL,
    "idTipoPago" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "referencia" VARCHAR(100),
    "fechaPago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("idPago")
);

-- CreateTable
CREATE TABLE "Venta" (
    "idVenta" SERIAL NOT NULL,
    "idPedido" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "idPersona" INTEGER,
    "idPago" INTEGER,
    "numeroVenta" VARCHAR(20),
    "fechaVenta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "igv" DECIMAL(10,2) NOT NULL,
    "descuento" DECIMAL(10,2),
    "total" DECIMAL(10,2) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Venta_pkey" PRIMARY KEY ("idVenta")
);

-- CreateTable
CREATE TABLE "Tipo_comprobante" (
    "idTipoComprobante" SERIAL NOT NULL,
    "nombreTipo" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "serieActual" VARCHAR(10),
    "correlativoActual" INTEGER,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Tipo_comprobante_pkey" PRIMARY KEY ("idTipoComprobante")
);

-- CreateTable
CREATE TABLE "Comprobante" (
    "idComprobante" SERIAL NOT NULL,
    "idVenta" INTEGER NOT NULL,
    "idTipoComprobante" INTEGER NOT NULL,
    "serie" VARCHAR(10) NOT NULL,
    "correlativo" INTEGER NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rucEmisor" VARCHAR(20),
    "razonSocialEmisor" VARCHAR(200),
    "rucCliente" VARCHAR(20),
    "razonSocialCliente" VARCHAR(200),
    "direccionCliente" VARCHAR(200),
    "subtotal" DECIMAL(10,2) NOT NULL,
    "igv" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Comprobante_pkey" PRIMARY KEY ("idComprobante")
);

-- CreateTable
CREATE TABLE "LogUsuario" (
    "idLog" SERIAL NOT NULL,
    "idUsuario" INTEGER,
    "accion" TEXT,
    "tabla" VARCHAR(100),
    "fechaHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" VARCHAR(50),
    "detalles" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "LogUsuario_pkey" PRIMARY KEY ("idLog")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tipo_Documento_nombreTipoDocumento_key" ON "Tipo_Documento"("nombreTipoDocumento");

-- CreateIndex
CREATE UNIQUE INDEX "Tipo_Documento_Adjunto_nombreTipo_key" ON "Tipo_Documento_Adjunto"("nombreTipo");

-- CreateIndex
CREATE INDEX "DocumentoAdjunto_idPersona_idx" ON "DocumentoAdjunto"("idPersona");

-- CreateIndex
CREATE INDEX "DocumentoAdjunto_idTipoDocumentoAdjunto_idx" ON "DocumentoAdjunto"("idTipoDocumentoAdjunto");

-- CreateIndex
CREATE UNIQUE INDEX "Persona_dni_key" ON "Persona"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_idPersona_key" ON "Empleado"("idPersona");

-- CreateIndex
CREATE UNIQUE INDEX "EmpleadoDiaSemana_idEmpleado_dia_key" ON "EmpleadoDiaSemana"("idEmpleado", "dia");

-- CreateIndex
CREATE UNIQUE INDEX "Departamento_rrhh_nombreDepartamento_key" ON "Departamento_rrhh"("nombreDepartamento");

-- CreateIndex
CREATE UNIQUE INDEX "InfoEmpleadoRRHH_idEmpleado_key" ON "InfoEmpleadoRRHH"("idEmpleado");

-- CreateIndex
CREATE UNIQUE INDEX "EmpleadoCapacitacion_idEmpleado_idCapacitacion_key" ON "EmpleadoCapacitacion"("idEmpleado", "idCapacitacion");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_idEmpleado_key" ON "Usuario"("idEmpleado");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_userName_key" ON "Usuario"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_verificationToken_key" ON "Usuario"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_resetPasswordToken_key" ON "Usuario"("resetPasswordToken");

-- CreateIndex
CREATE INDEX "Usuario_resetPasswordToken_idx" ON "Usuario"("resetPasswordToken");

-- CreateIndex
CREATE UNIQUE INDEX "RecetaIngrediente_idMenu_idInsumo_key" ON "RecetaIngrediente"("idMenu", "idInsumo");

-- CreateIndex
CREATE UNIQUE INDEX "Comprobante_serie_correlativo_idTipoComprobante_key" ON "Comprobante"("serie", "correlativo", "idTipoComprobante");

-- AddForeignKey
ALTER TABLE "Departamento" ADD CONSTRAINT "Departamento_idPais_fkey" FOREIGN KEY ("idPais") REFERENCES "Pais"("idPais") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provincia" ADD CONSTRAINT "Provincia_idDepartamento_fkey" FOREIGN KEY ("idDepartamento") REFERENCES "Departamento"("idDepartamento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Distrito" ADD CONSTRAINT "Distrito_idProvincia_fkey" FOREIGN KEY ("idProvincia") REFERENCES "Provincia"("idProvincia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DireccionUbicacion" ADD CONSTRAINT "DireccionUbicacion_idDistrito_fkey" FOREIGN KEY ("idDistrito") REFERENCES "Distrito"("idDistrito") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentoAdjunto" ADD CONSTRAINT "DocumentoAdjunto_idPersona_fkey" FOREIGN KEY ("idPersona") REFERENCES "Persona"("idPersona") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentoAdjunto" ADD CONSTRAINT "DocumentoAdjunto_idTipoDocumentoAdjunto_fkey" FOREIGN KEY ("idTipoDocumentoAdjunto") REFERENCES "Tipo_Documento_Adjunto"("idTipoDocumentoAdjunto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Persona" ADD CONSTRAINT "Persona_idDireccionUbicacion_fkey" FOREIGN KEY ("idDireccionUbicacion") REFERENCES "DireccionUbicacion"("idDireccionUbicacion") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Persona" ADD CONSTRAINT "Persona_idTipoDocumento_fkey" FOREIGN KEY ("idTipoDocumento") REFERENCES "Tipo_Documento"("idTipoDocumento") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empleado" ADD CONSTRAINT "Empleado_idPersona_fkey" FOREIGN KEY ("idPersona") REFERENCES "Persona"("idPersona") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmpleadoDiaSemana" ADD CONSTRAINT "EmpleadoDiaSemana_idEmpleado_fkey" FOREIGN KEY ("idEmpleado") REFERENCES "Empleado"("idEmpleado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Puesto_trabajo" ADD CONSTRAINT "Puesto_trabajo_idDepartamentoRRHH_fkey" FOREIGN KEY ("idDepartamentoRRHH") REFERENCES "Departamento_rrhh"("idDepartamentoRRHH") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InfoEmpleadoRRHH" ADD CONSTRAINT "InfoEmpleadoRRHH_idEmpleado_fkey" FOREIGN KEY ("idEmpleado") REFERENCES "Empleado"("idEmpleado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InfoEmpleadoRRHH" ADD CONSTRAINT "InfoEmpleadoRRHH_idPuestoTrabajo_fkey" FOREIGN KEY ("idPuestoTrabajo") REFERENCES "Puesto_trabajo"("idPuestoTrabajo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluacionDesempeno" ADD CONSTRAINT "EvaluacionDesempeno_idEmpleado_fkey" FOREIGN KEY ("idEmpleado") REFERENCES "Empleado"("idEmpleado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialEmpleado" ADD CONSTRAINT "HistorialEmpleado_idEmpleado_fkey" FOREIGN KEY ("idEmpleado") REFERENCES "Empleado"("idEmpleado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialEmpleado" ADD CONSTRAINT "HistorialEmpleado_idPuestoTrabajoAnterior_fkey" FOREIGN KEY ("idPuestoTrabajoAnterior") REFERENCES "Puesto_trabajo"("idPuestoTrabajo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialEmpleado" ADD CONSTRAINT "HistorialEmpleado_idPuestoTrabajoNuevo_fkey" FOREIGN KEY ("idPuestoTrabajoNuevo") REFERENCES "Puesto_trabajo"("idPuestoTrabajo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmpleadoCapacitacion" ADD CONSTRAINT "EmpleadoCapacitacion_idEmpleado_fkey" FOREIGN KEY ("idEmpleado") REFERENCES "Empleado"("idEmpleado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmpleadoCapacitacion" ADD CONSTRAINT "EmpleadoCapacitacion_idCapacitacion_fkey" FOREIGN KEY ("idCapacitacion") REFERENCES "Capacitacion"("idCapacitacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ausencia" ADD CONSTRAINT "Ausencia_idEmpleado_fkey" FOREIGN KEY ("idEmpleado") REFERENCES "Empleado"("idEmpleado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_idEmpleado_fkey" FOREIGN KEY ("idEmpleado") REFERENCES "Empleado"("idEmpleado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MensajeInterno" ADD CONSTRAINT "MensajeInterno_idRemitente_fkey" FOREIGN KEY ("idRemitente") REFERENCES "Usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MensajeInterno" ADD CONSTRAINT "MensajeInterno_idDestinatario_fkey" FOREIGN KEY ("idDestinatario") REFERENCES "Usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MensajeChat" ADD CONSTRAINT "MensajeChat_idRemitente_fkey" FOREIGN KEY ("idRemitente") REFERENCES "Usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MensajeChat" ADD CONSTRAINT "MensajeChat_idReceptor_fkey" FOREIGN KEY ("idReceptor") REFERENCES "Usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proveedores" ADD CONSTRAINT "Proveedores_idTipoProveedor_fkey" FOREIGN KEY ("idTipoProveedor") REFERENCES "Tipo_proveedor"("idTipoProveedor") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenCompra" ADD CONSTRAINT "OrdenCompra_idProveedor_fkey" FOREIGN KEY ("idProveedor") REFERENCES "Proveedores"("idProveedores") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleOrdenCompra" ADD CONSTRAINT "DetalleOrdenCompra_idOrdenCompra_fkey" FOREIGN KEY ("idOrdenCompra") REFERENCES "OrdenCompra"("idOrdenCompra") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleOrdenCompra" ADD CONSTRAINT "DetalleOrdenCompra_idInsumo_fkey" FOREIGN KEY ("idInsumo") REFERENCES "Insumo"("idInsumo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insumo" ADD CONSTRAINT "Insumo_idTipoInsumo_fkey" FOREIGN KEY ("idTipoInsumo") REFERENCES "Tipo_insumo"("idTipoInsumo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insumo" ADD CONSTRAINT "Insumo_idUnidadMedida_fkey" FOREIGN KEY ("idUnidadMedida") REFERENCES "UnidadMedida"("idUnidadMedida") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insumo" ADD CONSTRAINT "Insumo_idProveedor_fkey" FOREIGN KEY ("idProveedor") REFERENCES "Proveedores"("idProveedores") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "Inventario_idInsumo_fkey" FOREIGN KEY ("idInsumo") REFERENCES "Insumo"("idInsumo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "Inventario_idProveedor_fkey" FOREIGN KEY ("idProveedor") REFERENCES "Proveedores"("idProveedores") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventarioAuditoria" ADD CONSTRAINT "InventarioAuditoria_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleAuditoriaInventario" ADD CONSTRAINT "DetalleAuditoriaInventario_idAuditoria_fkey" FOREIGN KEY ("idAuditoria") REFERENCES "InventarioAuditoria"("idAuditoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_idInsumo_fkey" FOREIGN KEY ("idInsumo") REFERENCES "Insumo"("idInsumo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_idEmpleado_fkey" FOREIGN KEY ("idEmpleado") REFERENCES "Empleado"("idEmpleado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Merma" ADD CONSTRAINT "Merma_idInsumo_fkey" FOREIGN KEY ("idInsumo") REFERENCES "Insumo"("idInsumo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_idTipoProducto_fkey" FOREIGN KEY ("idTipoProducto") REFERENCES "Tipo_producto"("idTipoProducto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_idTipoPlatillo_fkey" FOREIGN KEY ("idTipoPlatillo") REFERENCES "Tipo_platillo"("idTipoPlatillo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecetaIngrediente" ADD CONSTRAINT "RecetaIngrediente_idMenu_fkey" FOREIGN KEY ("idMenu") REFERENCES "Menu"("idMenu") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecetaIngrediente" ADD CONSTRAINT "RecetaIngrediente_idInsumo_fkey" FOREIGN KEY ("idInsumo") REFERENCES "Insumo"("idInsumo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_idPersona_fkey" FOREIGN KEY ("idPersona") REFERENCES "Persona"("idPersona") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_idMenu_fkey" FOREIGN KEY ("idMenu") REFERENCES "Menu"("idMenu") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_idProducto_fkey" FOREIGN KEY ("idProducto") REFERENCES "Producto"("idProducto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallePedido" ADD CONSTRAINT "DetallePedido_idPedido_fkey" FOREIGN KEY ("idPedido") REFERENCES "Pedido"("idPedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallePedido" ADD CONSTRAINT "DetallePedido_idMenu_fkey" FOREIGN KEY ("idMenu") REFERENCES "Menu"("idMenu") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_idTipoPago_fkey" FOREIGN KEY ("idTipoPago") REFERENCES "Tipo_pago"("idTipoPago") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_idPago_fkey" FOREIGN KEY ("idPago") REFERENCES "Pago"("idPago") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_idPersona_fkey" FOREIGN KEY ("idPersona") REFERENCES "Persona"("idPersona") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_idPedido_fkey" FOREIGN KEY ("idPedido") REFERENCES "Pedido"("idPedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_idVenta_fkey" FOREIGN KEY ("idVenta") REFERENCES "Venta"("idVenta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_idTipoComprobante_fkey" FOREIGN KEY ("idTipoComprobante") REFERENCES "Tipo_comprobante"("idTipoComprobante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogUsuario" ADD CONSTRAINT "LogUsuario_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;
