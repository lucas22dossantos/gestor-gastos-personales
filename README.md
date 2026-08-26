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

- [x] Registrar un gasto: descripción, monto, categoría, fecha
- [x] Listar todos los gastos registrados
- [x] Editar un gasto existente
- [x] Eliminar un gasto
- [x] Validación de campos obligatorios (backend)
- [x] Validación de campos obligatorios (frontend)

### Nivel 2 — Cálculos y organización

- [x] Mostrar el total gastado (suma de todos los gastos)
- [x] Agrupar y mostrar el total gastado por categoría
- [x] Filtrar gastos por categoría
- [x] Filtrar gastos por rango de fechas

### Nivel 3 — Extra

- [x] Definir un presupuesto mensual y mostrar cuánto queda disponible
- [ ] Alerta visual si el gasto supera el presupuesto
- [ ] Gráfico simple de gastos por categoría (barras con CSS o alguna librería liviana)

## Estructura de base de datos (borrador inicial, sujeto a ajuste)

```sql
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE gastos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    categoria_id INT NOT NULL,
    fecha DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
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

✅ Backend completo (API REST + CRUD) probado y funcionando con XAMPP.
🚧 Falta: frontend (HTML/CSS/JS) para consumir la API.
