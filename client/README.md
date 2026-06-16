# 🏋️ Gimnasio App

Sistema de gestión de gimnasio con registro de socios, planes, clases y membresías.

## Stack tecnológico

- **API:** Node.js + Express + Sequelize + PostgreSQL
- **Cliente:** React + Vite + Axios
- **Auth:** JWT + bcryptjs

## URLs de producción

- **Frontend:** https://genuine-scone-5a21d9.netlify.app/
- **API:** https://gimnasio-app-production.up.railway.app/

## Credenciales de prueba

- **Email:** admin@gym.com
- **Password:** 123456

## Instalación local

### API
```bash
cd api
npm install
cp .env.example .env
# Editar .env con tus datos de BD y JWT_SECRET
npm run dev
```

### Cliente
```bash
cd client
npm install
npm run dev
```

- API local: http://localhost:3000
- Cliente local: http://localhost:5173

## Matriz de avance

| ID | Requisito | Estado | Pantalla web |
|----|-----------|--------|--------------|
| GEN-01 | Estructura del repositorio y README | ✅ Desarrollado | No aplica |
| GEN-02 | Variables de entorno y .env.example | ✅ Desarrollado | No aplica |
| GEN-03 | Conexión a BD y migraciones iniciales | ✅ Desarrollado | No aplica |
| GEN-04 | Registro de usuario | ✅ Desarrollado | No aplica |
| GEN-05 | Login y emisión JWT | ✅ Desarrollado | ✅ Sí |
| GEN-06 | Middleware de autenticación | ✅ Desarrollado | No aplica |
| GEN-07 | Restablecer contraseña | ✅ Desarrollado | ✅ Sí |
| GEN-08 | Manejo centralizado de errores | ✅ Desarrollado | No aplica |
| GEN-09 | CRUD REST y pantallas web | ✅ Desarrollado | ✅ Sí |
| GEN-10 | Validaciones de entrada | ✅ Desarrollado | No aplica |
| GEN-11 | Colección Postman | ✅ Desarrollado | No aplica |
| GEN-12 | Evolución de esquema | ✅ Desarrollado | No aplica |
| GEN-13 | Despliegue API+BD Railway y front Netlify | ✅ Desarrollado | ✅ Sí |
| rq-01 | Modelo Socio | ✅ Desarrollado | No aplica |
| rq-02 | Modelo Membresía | ✅ Desarrollado | No aplica |
| rq-03 | CRUD socios | ✅ Desarrollado | ✅ Sí |
| rq-04 | CRUD clases | ✅ Desarrollado | ✅ Sí |
| rq-05 | Validar membresía vigente | ✅ Desarrollado | ✅ Sí |
| rq-06 | Cupo lleno en clase | ✅ Desarrollado | ✅ Sí |
| rq-07 | Filtros socios/clases | ✅ Desarrollado | ✅ Sí |
| rq-08 | Panel socios y membresías | ✅ Desarrollado | ✅ Sí |
| rq-09 | Renovar membresía / inscribir a clase | ✅ Desarrollado | ✅ Sí |
| rq-10 | Reporte de ocupación | ✅ Desarrollado | ✅ Sí |

**Progreso Hito 3:** 23/23 requisitos desarrollados (100%)