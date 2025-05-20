
import bcrypt from 'bcryptjs';

import prisma from '../lib/prisma';
import { DepartamentoSeed } from './seed-departamento';
import { DistritoData } from './seed-distrito';
import { ProvinciaData } from './seed-provincia';
import { DiaSemana, Genero, Rol } from '@prisma/client';

async function main() {
  await prisma.empleadoDiaSemana.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.empleado.deleteMany();
  await prisma.documentoAdjunto.deleteMany();
  await prisma.persona.deleteMany();
  await prisma.ausencia.deleteMany();
  await prisma.tipo_insumo.deleteMany();
  await prisma.direccionUbicacion.deleteMany();
  await prisma.distrito.deleteMany();
  await prisma.provincia.deleteMany();
  await prisma.departamento.deleteMany();
  await prisma.pais.deleteMany();
  await prisma.tipo_Documento_Adjunto.deleteMany();
  await prisma.tipo_Documento.deleteMany();

  await prisma.tipo_Documento.createMany({
    data: [
      { nombreTipoDocumento: "DNI", descripcion: "Documento Nacional de Identidad para ciudadanos peruanos", nacionalidadAproximada: "Peruano" },
      { nombreTipoDocumento: "Carné de Extranjería", descripcion: "Documento de identificación para extranjeros residentes", nacionalidadAproximada: "Extranjero" },
      { nombreTipoDocumento: "Pasaporte", descripcion: "Documento internacional de viaje para peruanos y extranjeros", nacionalidadAproximada: "Ambos" },
      { nombreTipoDocumento: "Permiso Temporal de Permanencia (PTP)", descripcion: "Documento temporal para extranjeros en proceso migratorio", nacionalidadAproximada: "Extranjero" },
      { nombreTipoDocumento: "Cédula Diplomática", descripcion: "Documento de identidad para diplomáticos acreditados en el país", nacionalidadAproximada: "Extranjero" },
    ]
  });

  await prisma.tipo_Documento_Adjunto.createMany({
    data: [
      { nombreTipo: "Pasaporte", descripcion: "Documento internacional para viajes" },
      { nombreTipo: "Carné de Extranjería", descripcion: "Documento de identificación para extranjeros residentes" },
      { nombreTipo: "Permiso Temporal de Permanencia (PTP)", descripcion: "Documento temporal para extranjeros" },
      { nombreTipo: "Cédula Diplomática", descripcion: "Documento de identidad para diplomáticos" }
    ]
  });

  const pais = await prisma.pais.create({ data: { nombrePais: 'Peru' } });

  const formattedDepartamentos = DepartamentoSeed.map(dep => ({ ...dep, idPais: pais.idPais }));
  await prisma.departamento.createMany({ data: formattedDepartamentos });

  const departamentos = await prisma.departamento.findMany();
  const formattedProvincias = ProvinciaData.map(prov => ({
    ...prov,
    idDepartamento: departamentos[0].idDepartamento,
  }));
  await prisma.provincia.createMany({ data: formattedProvincias });

  const provincias = await prisma.provincia.findMany();
  const formattedDistritos = DistritoData.map(dist => ({
    ...dist,
    idProvincia: provincias[0].idProvincia,
  }));
  await prisma.distrito.createMany({ data: formattedDistritos });

  const distritos = await prisma.distrito.findMany();
  const direcciones = distritos.slice(0, 14).map((distrito, index) => ({
    idDistrito: distrito.idDistrito,
    detalleUbicacion: `Dirección ${28 + index}`
  }));
  await prisma.direccionUbicacion.createMany({ data: direcciones });

  const tiposDoc = await prisma.tipo_Documento.findMany();
  const ubicaciones = await prisma.direccionUbicacion.findMany();

  const personasRaw = [
    { dirIndex: 9, docIndex: 1, nombre: "sasha", apellido: "garcia", dni: 12125242, telefono: "2222277", genero: "Femenino" },
    { dirIndex: 10, docIndex: 1, nombre: "Gerson", apellido: "vera", dni: 73482311, genero: "Masculino", fechaNacimiento: new Date("2000-10-10") },
    { dirIndex: 11, docIndex: 2, nombre: "sdadd", apellido: "sdsd", genero: "No_Binario", fechaNacimiento: new Date("2333-02-23") },
    { dirIndex: 12, docIndex: 1, nombre: "Gerson", apellido: "xsdadsda", dni: 45151059, genero: "Masculino", fechaNacimiento: new Date("0022-02-22") },
    { dirIndex: 13, docIndex: 2, nombre: "Gerson", apellido: "vera", genero: "Masculino", fechaNacimiento: new Date("2222-02-22") },
        { dirIndex: 14, docIndex: 1, nombre: "Jhon", apellido: "xsdadsda", dni: 74419269, genero: "Masculino", fechaNacimiento: new Date("0022-02-22") },

  ];

  const formattedPersonas = personasRaw.map(p => ({
    idDireccionUbicacion: ubicaciones[p.dirIndex]?.idDireccionUbicacion,
    idTipoDocumento: tiposDoc[p.docIndex - 1]?.idTipoDocumento,
    nombre: p.nombre,
    apellido: p.apellido,
    telefono: p.telefono ?? '987654321',
    dni: p.dni,
    genero: p.genero as Genero,
    fechaNacimiento: p.fechaNacimiento
  }));

  await prisma.persona.createMany({ data: formattedPersonas });

  const personas = await prisma.persona.findMany();

  const empleadosRaw = [
    {
      dni: 73482311,
      rol: Rol.Administrador,
      horario: '09:00 - 17:00',
      dias: [DiaSemana.Lunes, DiaSemana.Martes, DiaSemana.Miercoles, DiaSemana.Jueves, DiaSemana.Viernes],
    },
    {
      dni: 12125242,
      rol: Rol.Mesero,
      horario: '12:00 - 20:00',
      dias: [DiaSemana.Martes, DiaSemana.Jueves, DiaSemana.Sabado],
    },
    {
      dni: 45151059,
      rol: Rol.Cocinero,
      horario: '08:00 - 16:00',
      dias: [DiaSemana.Lunes, DiaSemana.Martes, DiaSemana.Miercoles, DiaSemana.Jueves, DiaSemana.Viernes],
    },
       {
      dni: 74419269,
      rol: Rol.RRHH,
      horario: '08:00 - 16:00',
      dias: [DiaSemana.Lunes, DiaSemana.Martes, DiaSemana.Miercoles, DiaSemana.Jueves, DiaSemana.Viernes],
    },
    {
      nombre: "sdadd",
      apellido: "sdsd",
      rol: Rol.RRHH,
      horario: '09:00 - 15:00',
      dias: [DiaSemana.Lunes, DiaSemana.Martes, DiaSemana.Miercoles],
    },
  ];

  for (const emp of empleadosRaw) {
    const persona = emp.dni
      ? personas.find(p => p.dni === emp.dni)
      : personas.find(p =>
          p.nombre.trim().toLowerCase() === emp.nombre?.trim().toLowerCase() &&
          p.apellido.trim().toLowerCase() === emp.apellido?.trim().toLowerCase()
        );

    if (!persona) {
      console.warn(`❌ Persona no encontrada para el empleado ${emp.dni ?? emp.nombre + ' ' + emp.apellido}`);
      continue;
    }

    try {
      await prisma.empleado.create({
        data: {
          idPersona: persona.idPersona,
          rol: emp.rol,
          horario: emp.horario,
          estado: true,
          diasTrabajo: {
            create: emp.dias.map(d => ({ dia: d })),
          },
        },
      });
    } catch (error) {
      console.error(`⚠️ Error al crear empleado para persona ${persona.nombre} ${persona.apellido}:`, error);
    }
  }

  const empleados = await prisma.empleado.findMany({ include: { persona: true } });

  const usuariosRaw = [
    {
      dni: 73482311,
      correo: 'admin@example.com',
      userName: 'admin',
      contrasena: 'admin123'
    },
    {
      dni: 12125242,
      correo: 'cocinero@example.com',
      userName: 'cocinero',
      contrasena: 'cocinero456'
    },
    {
      dni: 45151059,
      correo: 'rrhh@example.com',
      userName: 'rrhh',
      contrasena: 'rrhh789'
    }
  ];

  for (const usuario of usuariosRaw) {
    const empleado = empleados.find(e => e.persona?.dni === usuario.dni);
    if (!empleado) {
      console.warn(`Empleado con DNI ${usuario.dni} no encontrado`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(usuario.contrasena, 12);
    await prisma.usuario.create({
      data: {
        idEmpleado: empleado.idEmpleado,
        correo: usuario.correo,
        userName: usuario.userName,
        contrasena: hashedPassword,
        isActive: true
      }
    });
  }

  console.log('✅ Seed ejecutado correctamente');
}

(() => {
  if (process.env.NODE_ENV === 'production') return;
  main();
})();
