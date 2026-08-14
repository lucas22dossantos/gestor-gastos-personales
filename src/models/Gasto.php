<?php

require_once __DIR__ . '/Database.php';
class Gasto
{
    // ID del gasto. Puede ser null mientras aún no existe en la BD.
    public ?int $id;

    // Descripción breve del gasto, por ejemplo: 'Supermercado'.
    public string $descripcion;

    // Monto del gasto. Se guarda como decimal con dos decimales.
    public float $monto;

    // ID de la categoría a la que pertenece el gasto.
    public int $categoria_id;

    // Fecha en la que se registró el gasto.
    public string $fecha;

    // Constructor: recibe los datos del gasto y los guarda en el objeto.
    public function __construct(?int $id, string $descripcion, float $monto, int $categoria_id, string $fecha)
    {
        $this->id = $id;
        $this->descripcion = $descripcion;
        $this->monto = $monto;
        $this->categoria_id = $categoria_id;
        $this->fecha = $fecha;
    }

    // Guarda este gasto en la base de datos.
    // Luego actualiza el id del objeto con el ID generado por MySQL.
    public function guardar(): void
    {
        $sql = "INSERT INTO gastos (descripcion, monto, categoria_id, fecha) VALUES (?, ?, ?, ?)";

        $params = [$this->descripcion, $this->monto, $this->categoria_id, $this->fecha];

        Database::query($sql, $params);

        $this->id = Database::lastInsertId();
    }


    public static function listarTodos(): array
    {
        $sql = "SELECT * FROM gastos";
        $stmt = Database::query($sql);
        $filas = $stmt->fetchAll();
        $gastos = [];

        foreach ($filas as $fila) {

            $gastos[] = new Gasto(

                id: $fila['id'],
                descripcion: $fila['descripcion'],
                monto: $fila['monto'],
                categoria_id: $fila['categoria_id'],
                fecha: $fila['fecha']
            );
        }

        return $gastos;
    }

    public function actualizar(): void
    {
        $sql = "UPDATE gastos SET descripcion = ?, monto = ?, categoria_id = ?, fecha = ? WHERE id = ?";

        $params = [$this->descripcion, $this->monto, $this->categoria_id, $this->fecha, $this->id];

        Database::query($sql, $params);
    }

    public function eliminar(): void
    {

        $sql = 'DELETE FROM gastos WHERE id = ?';
        $params = [$this->id];
        Database::query($sql, $params);
    }
}
