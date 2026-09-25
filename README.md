# BIRDWATCH

Aplicación web educativa para registrar, consultar y gestionar avistamientos de aves del Zoológico Santa Cruz y ecoparques aliados. Incluye una interfaz pública, módulos administrativos según el rol y un foro comunitario.

## Integrantes

- Juan Camilo Salinas Alarcon
- Astrid Yohana Alonso Buenaventura

Institución: Servicio Nacional de Aprendizaje — SENA
Ficha: 3229877

## Funcionalidades

- Portada pública con información institucional y carrusel de aves.
- Registro, inicio de sesión y recuperación de contraseña.
- Panel personalizado para administradores, administradores de parque y visitantes.
- Creación, edición, consulta y eliminación de parques.
- Registro y gestión de avistamientos con imagen, especie, parque, fecha y descripción.
- Publicación y consulta de mensajes en el foro comunitario.
- Administración de usuarios y asignación de roles.
- Gestión del aviso de cookies.
- Diseño adaptable para ordenador y dispositivos móviles.

## Roles

| Rol | Funcionalidades principales |
| --- | --- |
| Administrador | Gestión de usuarios, roles, parques, avistamientos y foro. |
| Administrador de Parque | Gestión de avistamientos del parque asignado, consulta de usuarios y participación en el foro. |
| Visitante | Consulta de avistamientos y participación en el foro. |
| Público | Acceso a la portada, términos, registro, inicio de sesión y recuperación de contraseña. |

## Tecnologías

### Frontend

- React 19 y React DOM.
- Create React App 5 y Webpack.
- JavaScript y JSX.
- CSS3 con diseño adaptable.
- Jest y Testing Library.

### Backend

- Node.js 20 o superior.
- Express 4 y CORS.
- Firebase Firestore.
- Nodemailer y Gmail.
- dotenv para cargar la configuración desde el archivo `.env`.
- Nodemon para desarrollo.

## Estructura

```text
birdwatch-app/
├── backend/
│   ├── .env.example
│   ├── firebase.js
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
├── .gitignore
├── package.json
└── README.md
```

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.
- Un proyecto de Firebase con Firestore habilitado.
- Una cuenta de Gmail con contraseña de aplicación para el envío de correos.
- Acceso a Internet para cargar Firebase y los recursos utilizados por la interfaz.

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/salinasalarconjuancamilo-wq/birdwatch-app.git
cd birdwatch-app
```

Instalar las dependencias de la raíz, el backend y el frontend:

```bash
npm install
cd backend
npm install
cd ../frontend
npm install
```

## Configuración del backend

El backend lee su configuración sensible desde el archivo `backend/.env`, que nunca se sube al repositorio. `backend/.env.example` contiene los nombres de todas las variables con valores de ejemplo.

1. Crear el archivo local de entorno a partir del ejemplo:

   ```bash
   cd backend
   cp .env.example .env
   ```

   En Windows PowerShell:

   ```powershell
   cd backend
   Copy-Item .env.example .env
   ```

2. Editar `backend/.env` y reemplazar cada valor de ejemplo por los datos reales de tu proyecto:

   | Variable | Descripción |
   | --- | --- |
   | `FIREBASE_API_KEY` | Clave de API de la aplicación web de Firebase. |
   | `FIREBASE_AUTH_DOMAIN` | Dominio de autenticación del proyecto. |
   | `FIREBASE_PROJECT_ID` | Identificador del proyecto de Firebase. |
   | `FIREBASE_STORAGE_BUCKET` | Bucket de almacenamiento del proyecto. |
   | `FIREBASE_MESSAGING_SENDER_ID` | Identificador del emisor de mensajes. |
   | `FIREBASE_APP_ID` | Identificador de la aplicación web. |
   | `FIREBASE_MEASUREMENT_ID` | Identificador de medición de Analytics. |
   | `CORREO_REMITE` | Cuenta de Gmail que envía los correos. |
   | `CONTRASEÑA_CORREO` | Contraseña de aplicación de esa cuenta de Gmail. |

   Los valores de Firebase se obtienen en Firebase Console → Project settings → General → Your apps → SDK setup and configuration. La contraseña de aplicación se genera en la cuenta de Google con Contraseñas de aplicación activadas.

3. Reiniciar el backend para que cargue el archivo `.env`:

   ```bash
   cd backend
   npm start
   ```

Sin este paso, el backend se inicia sin credenciales y no puede conectarse a Firestore ni enviar correos. No subas `.env` al repositorio.

## Ejecución

Abrir una terminal para el backend:

```bash
cd backend
npm start
```

El servidor Express queda disponible en:

```text
http://localhost:5001
```

Abrir otra terminal para el frontend:

```bash
cd frontend
npm start
```

La interfaz queda disponible en:

```text
http://localhost:3000
```

## Scripts disponibles

### Frontend

```bash
npm start
npm run build
npm test
npm test -- --watchAll=false
```

### Backend

```bash
npm start
```

## API REST

El backend expone 23 rutas bajo el prefijo `/api`:

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/api/registro` | Registra un usuario. |
| POST | `/api/login` | Valida las credenciales. |
| POST | `/api/verificar-sesion` | Consulta la sesión por correo. |
| POST | `/api/enviar-codigo` | Envía un código de recuperación. |
| POST | `/api/verificar-codigo` | Verifica el código recibido. |
| POST | `/api/cambiar-contrasena` | Actualiza la contraseña. |
| GET | `/api/listar-usuarios` | Lista los usuarios. |
| POST | `/api/actualizar-rol` | Cambia el rol de un usuario. |
| POST | `/api/parques/crear` | Crea un parque. |
| GET | `/api/parques/listar` | Lista los parques. |
| POST | `/api/parques/obtener-por-admin` | Obtiene el parque asignado. |
| POST | `/api/parques/actualizar` | Actualiza un parque. |
| POST | `/api/parques/asignar-admin` | Asigna un administrador al parque. |
| POST | `/api/parques/eliminar` | Elimina un parque. |
| POST | `/api/avistamientos/crear` | Crea un avistamiento. |
| GET | `/api/avistamientos/listar` | Lista los avistamientos. |
| POST | `/api/avistamientos/actualizar` | Actualiza un avistamiento. |
| POST | `/api/avistamientos/eliminar` | Elimina un avistamiento. |
| POST | `/api/actualizar-usuario` | Actualiza el perfil de un usuario. |
| POST | `/api/eliminar-usuario` | Elimina un usuario. |
| POST | `/api/foro/publicar` | Crea una publicación. |
| GET | `/api/foro/listar` | Lista las publicaciones. |
| POST | `/api/foro/eliminar` | Elimina una publicación. |

## Base de datos

Firestore utiliza las colecciones lógicas `usuarios`, `parques`, `avistamientos` y `publicaciones`. Las relaciones se realizan mediante correos e identificadores de documento.

## Configuración y seguridad

- No subas claves de Firebase, contraseñas de aplicación de Gmail, tokens ni archivos `.env` al repositorio.
- Revisa las reglas de seguridad de Firestore antes de publicar la aplicación.
- La configuración sensible ya se carga desde `backend/.env`; en producción utiliza un gestor de secretos en lugar de un archivo.
- Rota la clave de API de Firebase y la contraseña de aplicación de Gmail si fueron publicadas en alguna versión anterior del repositorio.
- Configura CORS únicamente con los orígenes autorizados.
- Protege los endpoints con autenticación y autorización del lado del servidor.
- Sustituye el hash SHA-256 actual por bcrypt, scrypt o Argon2id.
- No registres contraseñas, códigos de recuperación ni otros secretos en la consola.

## Estado del proyecto

El frontend compila en el puerto 3000 y el backend responde en el puerto 5001. Antes de una publicación en producción se deben reforzar los controles de acceso, la gestión de secretos, la validación de entradas y las pruebas automatizadas.
