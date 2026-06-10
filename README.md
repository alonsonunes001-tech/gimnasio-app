# 🏋️ Gimnasio App

Sistema de gestión de gimnasio con registro de socios, planes y membresías.

## Stack tecnológico

- **API:** Node.js + Express + Sequelize + PostgreSQL
- **Cliente:** React + Vite + Axios
- **Auth:** JWT + bcryptjs

## Requisitos previos

- Node.js instalado
- PostgreSQL instalado

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

- API: http://localhost:3000
- Cliente: http://localhost:5174

## Matriz de avance

| ID | Requisito | Estado | Pantalla web |
|----|-----------|--------|--------------|
| GEN-01 | Proyecto inicializado | ✅ Desarrollado | No aplica |
| GEN-02 | Base de datos conectada | ✅ Desarrollado | No aplica |
| GEN-03 | Primera migración ejecutada | ✅ Desarrollado | No aplica |
| GEN-04 | Registro de usuario | ✅ Desarrollado | No aplica |
| GEN-05 | Login con JWT | ✅ Desarrollado | No aplica |
| GEN-06 | Rutas protegidas por JWT | ✅ Desarrollado | No aplica |
| rq-01 | Modelo Socio | ✅ Desarrollado | No aplica |
| rq-02 | Modelo Membresía | ✅ Desarrollado | No aplica |
| rq-03 | CRUD socios | ✅ Desarrollado | ✅ Sí |
| rq-04 | CRUD clases | ⏳ Pendiente | — |
| rq-05 | Validar membresía vigente | ⏳ Pendiente | — |
| rq-06 | Cupo lleno en clase | ⏳ Pendiente | — |
| rq-07 | Filtros socios/clases | ⏳ Pendiente | — |
| rq-08 | Panel socios y membresías | ✅ Desarrollado | ✅ Sí |
| rq-09 | Flujo transaccional | ⏳ Pendiente | — |
| rq-10 | Funcionalidad avanzada | ⏳ Pendiente | — |

**Progreso Hito 2:** 10/23 requisitos desarrollados (43.5%)