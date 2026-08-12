<?php


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
}
