# Agile H001 - Plataforma de Experiencias Locales

Este repositorio contiene el código fuente completo para la plataforma de gestión de experiencias locales. El sistema está dividido en dos componentes principales: una API RESTful (Backend) y una aplicación web (Frontend), soportados por una base de datos PostgreSQL containerizada.

## 📂 Estructura del Proyecto

El proyecto está organizado en dos directorios principales:

* **`local-experiences-api`**: Backend desarrollado en **NestJS**. Maneja la lógica de negocio, autenticación (JWT), conexión a base de datos y endpoints REST.
* **`local-experiences-app`**: Frontend desarrollado en **React + Vite**. Interfaz de usuario para turistas y proveedores de experiencias, utilizando Bootstrap para los estilos.

---
# Link de acceso al tablero de Kanban

https://app.clickup.com/9017402089/v/li/901707051763

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu entorno:

1.  **[Node.js](https://nodejs.org/)** (v18 o superior recomendado).
2.  **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (necesario para ejecutar la base de datos PostgreSQL).
3.  **npm** (incluido con Node.js).

---

## 🚀 Guía de Inicio Rápido

Para levantar el entorno completo, se necesitará **dos terminales** abiertas, y, preferentemente, Docker Destop corriendo.

### Paso 1: Levantar el Backend y la Base de Datos

En tu **primera terminal**:

1.  Entre a la carpeta del API:
    ```bash
    cd local-experiences-api
    ```

2.  Instale las dependencias del servidor:
    ```bash
    npm install
    ```

3.  Levante la base de datos PostgreSQL usando Docker:
    ```bash
    docker-compose up -d
    ```
    > **Nota:** Esto creará un contenedor llamado `local_experiences_db` exponiendo el puerto **5436** (para no conflictos con puertos por defecto).

4.  Inicie el servidor en modo desarrollo:
    ```bash
    npm run start:dev
    ```
    ✅ El Backend estará corriendo en: `http://localhost:3000`

---

### Paso 2: Levantar el Frontend

En tu **segunda terminal**:

1.  Entre a la carpeta de la aplicación web:
    ```bash
    cd local-experiences-app
    ```

2.  Instale las dependencias del cliente:
    ```bash
    npm install
    ```

3.  Inicie el servidor de desarrollo de Vite:
    ```bash
    npm run dev
    ```
    ✅ El Frontend estará disponible en: `http://localhost:5173`

---