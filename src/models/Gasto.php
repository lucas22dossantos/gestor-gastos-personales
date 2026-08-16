<?php

require_once __DIR__ . '/Database.php';

/**
 * Modelo que representa un gasto personal registrado por el usuario.
 */
class Gasto
{
    public ?int $id;
    public string $descripcion;
    public float $monto;
    public int $categoria_id;
    public string $fecha;

    /**
     * Crea un nuevo gasto con los datos básicos.
     */
    public function __construct(?int $id, string $descripcion, float $monto, int $categoria_id, string $fecha)
    {
        $this->id = $id;
        $this->descripcion = $descripcion;
        $this->monto = $monto;
        $this->categoria_id = $categoria_id;
        $this->fecha = $fecha;
    }

    /**
     * Guarda el gasto en la base de datos.
     *
     * @throws InvalidArgumentException si los datos no son válidos.
     */
    public function guardar(): void
    {
        $this->validar();

        $sql = "INSERT INTO gastos (descripcion, monto, categoria_id, fecha) VALUES (?, ?, ?, ?)";
        $params = [$this->descripcion, $this->monto, $this->categoria_id, $this->fecha];

        Database::query($sql, $params);
        $this->id = (int) Database::lastInsertId();
    }

    /**
     * Devuelve la lista completa de gastos.
     */
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

    /**
     * Actualiza un gasto existente por su id.
     *
     * @throws InvalidArgumentException si los datos no son válidos.
     */
    public function actualizar(): void
    {
        $this->validar();

        $sql = "UPDATE gastos SET descripcion = ?, monto = ?, categoria_id = ?, fecha = ? WHERE id = ?";
        $params = [$this->descripcion, $this->monto, $this->categoria_id, $this->fecha, $this->id];

        Database::query($sql, $params);
    }

    /**
     * Elimina el gasto actual según su id.
     */
    public function eliminar(): void
    {
        $sql = 'DELETE FROM gastos WHERE id = ?';
        $params = [$this->id];

        Database::query($sql, $params);
    }

    /**
     * Valida que el gasto tenga datos correctos antes de persistirlo.
     *
     * @throws InvalidArgumentException si alguna regla no se cumple.
     */
    public function validar(): void
    {
        if (trim($this->descripcion) === '') {
            throw new InvalidArgumentException('La descripción no puede estar vacía.');
        }

        if (!is_numeric($this->monto) || $this->monto <= 0) {
            throw new InvalidArgumentException('El monto debe ser un número positivo.');
        }

        if (!is_numeric($this->categoria_id) || $this->categoria_id <= 0) {
            throw new InvalidArgumentException('La categoría debe ser un número válido.');
        }

        if (trim($this->fecha) === '') {
            throw new InvalidArgumentException('La fecha no puede estar vacía.');
        }

        $fecha = DateTime::createFromFormat('Y-m-d', $this->fecha);

        if ($fecha === false || $fecha->format('Y-m-d') !== $this->fecha) {
            throw new InvalidArgumentException('La fecha debe tener el formato YYYY-MM-DD.');
        }
    }
}
