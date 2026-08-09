# Gestor de Gastos Personales

## Objetivo del proyecto

Aplicación web para registrar y controlar gastos personales, organizados por categoría,
con balance general. Lo armé como proyecto de práctica personal, para reforzar un stack
completo (frontend + backend + base de datos) construyendo cada parte desde cero, sin
partir de una plantilla ni de código ya hecho.

La idea es que sea algo que yo mismo podría usar para llevar el control
de mis gastos — y al mismo tiempo, una forma de practicar de punta a punta cómo se arma
un proyecto: diseñar la base de datos, construir la API, y conectar todo con el frontend.

Este proyecto me sirve para reforzar:

- CRUD completo (crear, leer, actualizar, eliminar) con PHP + MySQL
- Cálculos sobre arrays en JS (totales, balances, agrupación por categoría)
- Separación de responsabilidades: backend (API) vs frontend (interfaz)
- Validaciones tanto en frontend (UX) como en backend (seguridad real)
- Diseño de base de datos desde cero (no un esquema ya dado)

## Tecnologías

- **Frontend:** HTML, CSS, JavaScript (vanilla, sin frameworks)
- **Backend:** PHP (API REST simple)
- **Base de datos:** MySQL

## Funcionalidades

### Nivel 1 — CRUD básico

- [ ] Registrar un gasto: descripción, monto, categoría, fecha
- [ ] Listar todos los gastos registrados
- [ ] Editar un gasto existente
- [ ] Eliminar un gasto
- [ ] Validación de campos obligatorios (frontend Y backend)

### Nivel 2 — Cálculos y organización

- [ ] Mostrar el total gastado (suma de todos los gastos)
- [ ] Agrupar y mostrar el total gastado por categoría
- [ ] Filtrar gastos por categoría
- [ ] Filtrar gastos por rango de fechas

### Nivel 3 — Extra

- [ ] Definir un presupuesto mensual y mostrar cuánto queda disponible
- [ ] Alerta visual si el gasto supera el presupuesto
- [ ] Gráfico simple de gastos por categoría (barras con CSS o alguna librería liviana)

## Estructura de base de datos (borrador inicial, sujeto a ajuste)

```sql
CREATE TABLE gastos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Estructura de archivos (a definir mientras se construye)

```
/
├── index.html
├── style.css
├── app.js
├── src/
│   ├── controllers/
│   │   └── api.php
│   └── models/
│       ├── Database.php
│       └── Gasto.php
├── sql/
│   └── database.sql
└── README.md
```

## Estado del proyecto

🚧 En construcción — proyecto personal de práctica, construido de a poco mientras
sigo aprendiendo desarrollo web full-stack.
