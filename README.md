🍽️ Guía de Instalación: Sistema de Restaurante con Control de Inventario
📋 Descripción General
Este sistema está diseñado para la gestión integral de un restaurante, con enfoque especializado en control de inventario. Utiliza tecnologías modernas como Next.js, Prisma ORM y PostgreSQL para garantizar rendimiento y escalabilidad.

⚙️ Requisitos Previos
Node.js (v16.x o superior): Descargar Node.js
PostgreSQL (v13.x o superior): Descargar PostgreSQL
Git (opcional, para clonar el repositorio)
npm o yarn (instalado con Node.js)
🚀 Instalación y Configuración
1️⃣ Clonar el Repositorio
bash
git clone <url-del-repositorio>
cd <nombre-del-proyecto>
2️⃣ Instalar Dependencias
bash
npm install
# o
yarn install
3️⃣ Configurar Variables de Entorno
Cree un archivo .env en la raíz del proyecto con la siguiente información:

env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://postgres:root@localhost:5432/dbRestaurante"

# Configuración de correo para notificaciones
EMAIL_USER=esthefanysarmiento66@gmail.com
EMAIL_PASS=zzbgrgjmjbxnmhmt

# URL de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Secret para autenticación
AUTH_SECRET="G9ciBjfcaw5rSwy2vwtI3H+MnWthJPbhNy5I91tkrro="
4️⃣ Configurar PostgreSQL
Asegúrese de que el servicio PostgreSQL esté funcionando
Cree una base de datos llamada dbRestaurante:
sql
CREATE DATABASE "dbRestaurante";
Verifique las credenciales en el string de conexión (DATABASE_URL) para asegurarse de que coincidan con su configuración local
💾 Instalación y Configuración de Prisma
1️⃣ Instalar Prisma CLI (si no se instaló con las dependencias)
bash
npm install -g prisma
# o
yarn global add prisma
2️⃣ Inicializar Prisma en el Proyecto
bash
npx prisma init
3️⃣ Verificar el Esquema de Prisma
El archivo schema.prisma ya debe estar configurado con los modelos necesarios para el sistema de restaurante. Si necesita hacer ajustes, modifique el archivo ubicado en prisma/schema.prisma.

4️⃣ Generar Cliente Prisma
bash
npx prisma generate
Este comando genera el cliente de Prisma basado en su esquema actual, permitiendo que su aplicación interactúe con la base de datos.

🔄 Migración de la Base de Datos
1️⃣ Crear la Primera Migración
bash
npx prisma migrate dev --name init
Este comando:

Analiza su esquema Prisma actual
Crea un archivo de migración SQL en prisma/migrations
Aplica la migración a su base de datos
Genera el cliente Prisma
2️⃣ Para Migraciones Posteriores (cuando modifique el esquema)
bash
npx prisma migrate dev --name <nombre-descriptivo-del-cambio>
Ejemplos:

npx prisma migrate dev --name add_user_profile
npx prisma migrate dev --name update_inventory_schema
3️⃣ Visualizar la Base de Datos (opcional)
bash
npx prisma studio
Esto abre una interfaz web en http://localhost:5555 que le permite explorar y modificar sus datos.

🌱 Insertar Datos de Prueba
bash
npx prisma db seed
Nota: Para que este comando funcione, debe configurar un script de seed en su package.json:

json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
🏃‍♂️ Ejecutar la Aplicación
bash
npm run dev
# o
yarn dev
Visite http://localhost:3000 en su navegador para acceder al sistema.

🔍 Solución de Problemas Comunes
Error de Conexión a la Base de Datos
Verifique que PostgreSQL esté corriendo (pg_ctl status)
Confirme que las credenciales en DATABASE_URL sean correctas
Asegúrese de que la base de datos exista (\l en psql)
Error en Migraciones
bash
# Resetear la base de datos (⚠️ elimina todos los datos)
npx prisma migrate reset

# Forzar actualización (para entornos de desarrollo)
npx prisma db push --force-reset
Cliente Prisma Desactualizado
bash
npx prisma generate
📚 Recursos Adicionales
Documentación de Next.js
Documentación de Prisma
Guía de Migraciones Prisma
Documentación de PostgreSQL
🏗️ Estructura del Sistema
El sistema implementa el siguiente mapa de procesos, centrado en el control de inventario:

Mostrar imagen
El diagrama de procesos se puede visualizar en el artefacto "Mapa de Procesos" adjunto.
![imagen](https://github.com/user-attachments/assets/ea40ffa2-d157-42f2-a87b-6d6f43f0a063)

🤝 Soporte
Para preguntas o problemas relacionados con la instalación, contacte al equipo de desarrollo mediante los issues del repositorio.

