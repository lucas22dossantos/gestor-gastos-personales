-- Base de datos para el gestor de gastos personales
CREATE DATABASE IF NOT EXISTS gestor_gastos;
USE gestor_gastos;

-- Tabla de categorias: permite agregar categorias nuevas sin modificar la estructura
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de gastos: cada gasto pertenece a una categoria (relacion por categoria_id)
CREATE TABLE gastos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    categoria_id INT NOT NULL,
    fecha DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Categorias iniciales
INSERT INTO categorias (nombre) VALUES
('vivienda'),
('alimento'),
('transporte'),
('salud'),
('entretenimiento'),
('otros');

-- Gastos de ejemplo para probar el proyecto desde el arranque
INSERT INTO gastos (descripcion, monto, categoria_id, fecha) VALUES
('Alquiler mensual', 150000.00, 1, '2026-08-01'),
('Supermercado', 25000.50, 2, '2026-08-03'),
('Nafta', 18000.00, 3, '2026-08-05'),
('Consulta medica', 12000.00, 4, '2026-08-06'),
('Suscripcion streaming', 4500.00, 5, '2026-08-07');