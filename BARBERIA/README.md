1. Servidor (Backend)
El backend utiliza Express y SQLite con modo WAL para evitar bloqueos de base de datos.

Abre una terminal y navega a la carpeta del servidor:

Bash
cd backend
Instala las dependencias (si es la primera vez):

Bash
npm install express cors sqlite3
Inicia el servidor:

Bash
node index.js
Deberías ver el mensaje: "Conectado a BARBERIA.DB con éxito".

2. Cliente (Frontend)
La interfaz está construida en Angular y se conecta al puerto 3000.

Abre una nueva terminal y navega a la carpeta del proyecto Angular:

Bash
cd BARBERIA
Instala las dependencias:

Bash
npm install
Inicia la aplicación:

Bash
ng serve
Abre tu navegador en: http://localhost:4200