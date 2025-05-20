📦 Guía para Ejecutar el Proyecto - Next.js

Este proyecto ha sido creado con create-next-app y utiliza Next.js, Node.js, Prisma y PostgreSQL como base de datos.
✅ Requisitos previos

Antes de ejecutar el proyecto, asegúrese de tener instalado:

    Node.js: Descargar Node.js

    PostgreSQL: Descargar PostgreSQL

    Git (opcional, para clonar el repositorio)

🛠️ Pasos para levantar el proyecto

    Clonar el repositorio (si aplica)

git clone <url-del-repositorio>
cd <nombre-del-proyecto>

    Instalar dependencias

npm install
# o
yarn install

    Configurar la base de datos PostgreSQL

    Crear una base de datos en PostgreSQL.

    Configurar las variables de entorno en un archivo .env (el archivo .env.example puede servir de guía):

DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_de_la_bd"

    Ejecutar migraciones e insertar datos semilla

npx prisma migrate dev
npx prisma db seed

Esto creará las tablas necesarias y poblará la base de datos con datos iniciales para pruebas.

    Levantar el servidor de desarrollo

npm run dev
# o
yarn dev

Luego abre http://localhost:3000 en tu navegador para ver el resultado.
🧪 Datos de prueba

Este proyecto cuenta con un archivo seed.ts para insertar datos de prueba automáticamente en la base de datos. Esto permite probar las funcionalidades del sistema sin necesidad de registrar manualmente datos.
📚 Recursos útiles

    Documentación de Next.js

    Documentación de Prisma

    Documentación de PostgreSQL

    Documentación de Vercel
Cree un archivo en la raiz del proyecto llamado .env 
con estos valores

DATABASE_URL="postgresql://postgres:root@localhost:5432/dbRestaurante"

EMAIL_USER=esthefanysarmiento66@gmail.com
EMAIL_PASS=zzbgrgjmjbxnmhmt
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_SECRET="G9ciBjfcaw5rSwy2vwtI3H+MnWthJPbhNy5I91tkrro="


