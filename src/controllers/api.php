<?php

require_once __DIR__ . '/../models/Gasto.php';

/**
 * API REST para gestionar gastos personales.
 * Maneja operaciones CRUD sobre los gastos según el método HTTP recibido.
 */

$metodo = $_SERVER['REQUEST_METHOD'];

switch ($metodo) {
    /**
     * GET: Devuelve la lista completa de gastos en formato JSON.
     */
    case 'GET':
        $gastos = Gasto::listarTodos();

        header('Content-Type: application/json');
        echo json_encode($gastos);

        break;

    /**
     * POST: Crea un nuevo gasto a partir de los datos recibidos en JSON.
     */
    case 'POST':
        $datos = json_decode(file_get_contents('php://input'), true);
        $gasto = new Gasto(null, $datos['descripcion'], $datos['monto'], $datos['categoria_id'], $datos['fecha']);
        $gasto->guardar();

        header('Content-Type: application/json');
        echo json_encode($gasto);

        break;

    /**
     * PUT: Actualiza un gasto existente identificado por su id.
     */
    case 'PUT':
        $datos = json_decode(file_get_contents('php://input'), true);
        $gasto = new Gasto($datos['id'], $datos['descripcion'], $datos['monto'], $datos['categoria_id'], $datos['fecha']);
        $gasto->actualizar();

        header('Content-Type: application/json');
        echo json_encode($gasto);
        break;

    /**
     * DELETE: Elimina un gasto por su id.
     */
    case 'DELETE':
        $datos = json_decode(file_get_contents('php://input'), true);
        $gasto = new Gasto($datos['id'], '', 0, 0, '');
        $gasto->eliminar();

        header('Content-Type: application/json');
        echo json_encode(['mensaje' => 'Gasto eliminado correctamente']);
        break;

    default:
        break;
}
