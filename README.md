# API MiniBlog

API REST construida con Node.js, Express y PostgreSQL para gestionar `authors` y `posts` — Proyecto Integrador Módulo 2, Henry Bootcamp.

**URL en producción:** https://proyectom2joseferrer-production.up.railway.app
**Documentación interactiva (Swagger UI):** https://proyectom2joseferrer-production.up.railway.app/api-docs

## Descripción del proyecto

DevSpark necesita una API estable para su servicio de contenidos MiniBlog, que permita gestionar usuarios (`authors`) y publicaciones (`posts`) mediante operaciones CRUD completas, con validaciones básicas, documentación OpenAPI y tests automatizados.

La API expone 11 endpoints en total: 5 para `authors`, 6 para `posts` (incluyendo un endpoint con JOIN para listar los posts de un author específico).

## Stack técnico

- **Node.js** + **Express** — servidor y enrutamiento
- **PostgreSQL** + **pg** — persistencia de datos, con queries parametrizadas
- **Jest** + **Supertest** — tests automatizados
- **Swagger UI** + **OpenAPI 3.0** — documentación interactiva
- **Railway** — hosting y base de datos en producción

## Requisitos previos

- Node.js (v18 o superior recomendado)
- PostgreSQL instalado localmente
- npm

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/joseferrer-webdevelopment/proyectoM2_JoseFerrer.git
cd proyectoM2_JoseFerrer
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y completa tus propios valores:

```bash
cp .env.example .env
```

Variables necesarias en `.env`:

```
PORT=3000
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog
```

### 4. Crear la base de datos y las tablas

Crea la base de datos en PostgreSQL:

```sql
CREATE DATABASE miniblog;
```

Corre el script de creación de tablas (desde psql, conectado a la base `miniblog`):

```sql
\i db/setup.sql
```

### 5. Cargar datos de prueba (seed)

```sql
\i db/seed.sql
```

### 6. Levantar el servidor

```bash
npm run dev
```

El servidor queda disponible en `http://localhost:3000`.

## Cómo ejecutar los tests

```bash
npm test
```

Corre la suite de Jest + Supertest, incluyendo:

- Endpoints de authors
- Endpoints de posts
- Validaciones de middlewares
- Manejo de errores

Los tests usan la base de datos configurada en `.env`, y cierran el pool de conexión automáticamente al finalizar (`afterAll`).

## Cómo ver la documentación OpenAPI

Con el servidor corriendo (local o en producción), visita:

```
http://localhost:3000/api-docs
```

o en producción:

```
https://proyectom2joseferrer-production.up.railway.app/api-docs
```

Ahí se puede ver cada endpoint documentado (parámetros, body esperado, respuestas posibles) y probarlo directamente desde la interfaz. El selector de servidor (arriba de la página) cambia automáticamente entre `localhost` y la URL de producción según el entorno en el que corra la app.

## Endpoints disponibles

### Authors

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/authors` | Listar todos los authors |
| GET | `/authors/:id` | Detalle de un author |
| POST | `/authors` | Crear un author |
| PUT | `/authors/:id` | Actualizar un author |
| DELETE | `/authors/:id` | Eliminar un author (borra sus posts en cascada) |

### Posts

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/posts` | Listar todos los posts |
| GET | `/posts/:id` | Detalle de un post |
| GET | `/posts/author/:authorId` | Posts de un author específico (JOIN con authors) |
| POST | `/posts` | Crear un post (valida que el author exista) |
| PUT | `/posts/:id` | Actualizar un post |
| DELETE | `/posts/:id` | Eliminar un post |

## Middlewares implementados

La API utiliza middlewares para centralizar la validación de datos de entrada y el manejo de errores, evitando repetir esta lógica en cada controller.

### `validateAuthor`

Valida los datos enviados al crear o actualizar un author (`POST /authors`, `PUT /authors/:id`):

- `name` es obligatorio, no puede estar vacío, y solo puede contener letras y espacios (incluye tildes y ñ).
- `email` es obligatorio, no puede estar vacío, y debe tener un formato válido (`usuario@dominio.com`). Se normaliza automáticamente a minúsculas y sin espacios extremos antes de guardarse.
- `bio` es opcional, pero si se envía, debe ser de tipo texto.

Ejemplos de error (status `400`):
```json
{ "error": "name es obligatorio y no puede estar vacío" }
{ "error": "El nombre solo puede contener letras y espacios" }
{ "error": "email debe tener un formato válido" }
```

### `validatePost`

Valida los datos enviados al crear o actualizar un post (`POST /posts`, `PUT /posts/:id`):

- `title` y `content` son obligatorios en ambos casos, y no pueden estar vacíos.
- `authorId` es obligatorio y debe ser un entero positivo **solo al crear** (`POST`); no se exige ni se modifica al actualizar (`PUT`), ya que el post no cambia de dueño.
- `published` debe ser booleano si se envía; al actualizar (`PUT`) es obligatorio que sea booleano, al crear (`POST`) es opcional (por defecto `false` si no se envía).

Ejemplos de error (status `400`):
```json
{ "error": "authorId debe ser un número entero positivo" }
{ "error": "title es obligatorio y no puede estar vacío" }
{ "error": "content es obligatorio y no puede estar vacío" }
{ "error": "published debe ser booleano" }
```

### `validateParams`

Verifica que los parámetros recibidos por la URL (`:id` en authors/posts, `:authorId` en `/posts/author/:authorId`) sean números enteros positivos antes de que la petición llegue al controller, evitando consultas innecesarias a la base de datos con valores inválidos.

Ejemplo de error (status `400`):
```json
{ "error": "id debe ser un número entero positivo" }
```

### `errorHandler` y `notFoundHandler`

- **`errorHandler`** — middleware de error centralizado (4 argumentos `error, req, res, next`) que traduce errores reales de PostgreSQL a respuestas HTTP consistentes:
  - Código `23505` (violación de restricción única, ej. email duplicado) → `409 Conflict`: `{ "error": "Ya existe un registro con esos datos únicos" }`
  - Código `22P02` (tipo de dato inválido) o body malformado → `400 Bad Request`: `{ "error": "La solicitud contiene datos inválidos" }`
  - Cualquier otro error no controlado → `500 Internal Server Error`: `{ "error": "Error interno del servidor" }`
- **`notFoundHandler`** — responde `404` con `{ "error": "Ruta no encontrada" }` para cualquier ruta que no exista en la API.

Los controllers no manejan el status `500` directamente: delegan los errores con `next(error)`, y es `errorHandler` quien decide la respuesta final según el tipo de error recibido.


## Guía de deployment en Railway

### Servicios utilizados

1. **Servicio de la API** — desplegado directamente desde el repositorio de GitHub, con auto-deploy en cada push a `main`.
2. **Servicio de PostgreSQL** — base de datos gestionada por Railway, provisionada como un servicio adicional dentro del mismo proyecto.

### Variables de entorno en Railway

Railway inyecta automáticamente la variable `DATABASE_URL` (conexión interna) al conectar el servicio de PostgreSQL con el servicio de la API. El código detecta su presencia y decide la configuración de conexión según el entorno:

```javascript
const pool = new Pool(process.env.DATABASE_URL ? dbConnectionProduction : dbConnectionLocal);
```

- Si `DATABASE_URL` existe (producción/Railway) → usa esa cadena de conexión completa.
- Si no existe (desarrollo local) → arma la conexión con las variables sueltas del `.env` (`DB_USER`, `DB_HOST`, etc.).

Este mismo patrón de detección de entorno se reutiliza para seleccionar dinámicamente la URL mostrada en Swagger UI.

Adicionalmente, se configuró la variable `PORT`, que Railway asigna automáticamente en tiempo de ejecución (el código usa `process.env.PORT || 3000` como respaldo).

### Internal URL vs Public URL

- **Internal URL** (`DATABASE_URL`, con host `postgres.railway.internal`): usada por la propia API para conectarse a la base de datos dentro de la red privada de Railway. Solo accesible entre servicios del mismo proyecto Railway.
- **Public URL** (`DATABASE_PUBLIC_URL`): usada para conectarse a la base de datos desde fuera de Railway (por ejemplo, desde `psql` en la máquina local) para correr los scripts de `setup.sql` y `seed.sql` contra la base de datos remota.

### Pasos realizados para el deploy

1. Conectar el repositorio de GitHub al proyecto de Railway.
2. Agregar un servicio de PostgreSQL dentro del mismo proyecto de Railway.
3. Confirmar que `DATABASE_URL` quedó disponible automáticamente para el servicio de la API.
4. Conectar con `psql` a la `DATABASE_PUBLIC_URL` para correr `db/setup.sql` y `db/seed.sql` contra la base de datos remota.
5. Verificar el funcionamiento probando los endpoints en la URL pública generada por Railway.

## Registro de uso de IA en el proyecto

Este proyecto se desarrolló con acompañamiento activo de Claude (Anthropic) como tutor técnico a lo largo de todo el proceso, con el siguiente enfoque:

- **Explicación de conceptos antes de escribir código**: arquitectura en capas (routes/controllers/services), foreign keys, JOINs, pool de conexiones, async/await, SQL injection y parametrización de queries, testing con Jest/Supertest, y detección de entorno para deployment.
- **Escritura de código propia con revisión guiada**: la mayoría de los archivos (services, controllers, rutas, tests) fueron escritos por el autor del proyecto, con corrección de errores explicada paso a paso (ej. orden de parámetros en queries SQL, discordancia de nombres entre archivos, status codes HTTP incorrectos, encoding de caracteres UTF-8).
- **Generación asistida de documentación**: el archivo `openapi.yaml` fue generado con asistencia de IA a partir del código real ya funcional del proyecto, y revisado para confirmar que reflejaba fielmente cada endpoint, sus parámetros y sus posibles respuestas.
- **Debugging colaborativo**: errores reales encontrados durante el desarrollo (rutas mal exportadas, parámetros desalineados, problemas de encoding en PostgreSQL, conexión a bases de datos remotas en Railway) se resolvieron identificando la causa antes de aplicar la corrección, no copiando soluciones sin entenderlas.

El objetivo del uso de IA en este proyecto fue acelerar y profundizar el aprendizaje de conceptos nuevos (PostgreSQL, arquitectura backend, testing, deployment), no sustituir la escritura ni la comprensión del código por parte del autor.

## Autor

José Ferrer — Henry Bootcamp, Módulo 2
