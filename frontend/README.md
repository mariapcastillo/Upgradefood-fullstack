🍣 UpgradeHub Final Project
Plataforma Web para Gestión de Restaurante Japonés

Proyecto final desarrollado como parte del Bootcamp de Desarrollo Full Stack de UpgradeHub.

Esta aplicación permite la gestión integral de un restaurante japonés, incluyendo reservas, menús, reseñas, gestión de usuarios y panel administrativo completo.

📌 Descripción del Proyecto

La aplicación simula el entorno real de un restaurante moderno con:

Gestión de reservas online

Sistema de reseñas por cliente

Panel administrativo avanzado

Gestión de menús y platos

Gestión de mesas

Autenticación segura con JWT

Envío automático de emails (confirmaciones y cancelaciones)

Panel de usuario con edición de datos personales

Cambio de contraseña seguro

El sistema está dividido en:

Frontend: Angular (SPA moderna)

Backend: FastAPI (Python)

Base de datos: MySQL

Deploy Backend: Railway

Deploy Frontend: (añadir si lo subes a Vercel / Firebase / etc.)

🏗️ Arquitectura
🔹 Frontend

Angular Standalone Components

Reactive Forms

Signals

Guards (authGuard)

HTTP Interceptors (JWT automático)

SweetAlert2 para feedback visual

Diseño oscuro personalizado

🔹 Backend

FastAPI

Arquitectura por capas:

routes

controllers

services

models

core

Autenticación con JWT

Hash de contraseñas

Validaciones con Pydantic

Emails con Resend

Control de roles (admin / cliente)

👤 Roles del Sistema
Cliente

Registro y login

Realizar reservas

Cancelar reservas

Escribir reseñas tras la fecha de la reserva

Editar reseñas propias

Editar datos personales

Cambiar contraseña

Administrador

Gestión completa de reservas

Gestión de mesas

Crear, editar y eliminar menús

Asignar platos a menús

Gestión de reseñas

Visualización global de datos

🔐 Autenticación y Seguridad

Login con JWT

Interceptor en Angular para enviar automáticamente el token

Control de acceso por rol

Hash de contraseñas en backend

Endpoint seguro para cambio de contraseña

Validación de propietario o admin en endpoints protegidos

📧 Sistema de Emails

Se envían emails automáticos para:

Confirmación de reserva

El envío se realiza desde backend usando Resend.

🗃️ Base de Datos

Tablas principales:

usuarios

reservas

resenas

menus

platos

mesas

menus_platos (relación)

⚙️ Instalación Local
1️⃣ Backend
cd ProyectoUpgrade
python -m venv .venv
source .venv/Scripts/activate # Windows
pip install -r requirements.txt
fastapi dev main.py

Servidor en:

http://127.0.0.1:8000

2️⃣ Frontend
cd FrontedProyectoFinal
npm install
ng serve

App en:

http://localhost:4200

🌍 Variables de Entorno (Backend)

Crear archivo .env:

SECRET_KEY=tu_clave
ALGORITHM=HS256
RESEND_API_KEY=tu_api_key
DATABASE_URL=...

🚀 Deploy
Backend

Deploy en Railway conectado a GitHub.
Cada push a main genera redeploy automático.

Frontend

(Completar según hosting usado)

Vercel / Firebase / etc.

📊 Funcionalidades Clave

✔ CRUD completo de reservas
✔ Gestión de estados (confirmada)
✔ Panel administrativo profesional
✔ Reseñas vinculadas a reservas
✔ Panel de datos personales editable
✔ Cambio de contraseña sin cerrar sesión
✔ Sistema de roles
✔ Emails transaccionales
✔ Arquitectura limpia y escalable

🎯 Retos Técnicos Superados

Gestión de JWT con Interceptor

Control de permisos por rol y propietario

Integración backend ↔ frontend desde fases tempranas

Manejo de estados en reservas

Emails asíncronos

Manejo correcto de null vs undefined en Angular

Tipado fuerte en TypeScript

Gestión avanzada de formularios reactivos

Deploy en entorno real

📈 Posibles Mejoras Futuras

Dashboard con métricas (gráficas)

Sistema de recuperación de contraseña

Filtros avanzados en panel admin

Notificaciones en tiempo real

Integración con pagos online

Tests unitarios y e2e

Dockerización completa

🏁 Conclusión

Este proyecto representa la aplicación práctica de los conocimientos adquiridos durante el bootcamp, integrando frontend moderno, backend robusto, base de datos relacional y despliegue en entorno real.

Se ha priorizado:

Seguridad

Escalabilidad

Organización del código

Experiencia de usuario

Buenas prácticas profesionales
