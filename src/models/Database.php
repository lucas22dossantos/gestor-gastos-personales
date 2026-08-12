<?php

// Carga las credenciales de conexión desde src/config.php.

require_once __DIR__ . '/../config.php';

class Database
{
    // Guarda la única instancia de PDO para toda la aplicación.
    private static ?PDO $instancia = null;

    // Devuelve la conexión PDO. Si ya existe, la reutiliza.
    public static function getConnection(): PDO
    {
        if (self::$instancia === null) {
            // Construimos el DSN usando los datos de config.php.
            $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', DB_HOST, DB_NAME);

            // Creamos la conexión PDO con las credenciales definidas.
            self::$instancia = new PDO($dsn, DB_USER, DB_PASS);

            // Lanza excepciones cuando ocurre un error en la base de datos.
            self::$instancia->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Devuelve los resultados como arrays asociativos por defecto.
            self::$instancia->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        }

        return self::$instancia;
    }

    // Método auxiliar para ejecutar consultas preparadas.
    // Recibe la consulta SQL y los parámetros, y devuelve el statement ejecutado.
    public static function query(string $sql, array $params = []): PDOStatement
    {
        $stmt = self::getConnection()->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    // Devuelve el ID generado por la última inserción.
    public static function lastInsertId(): string
    {
        return self::getConnection()->lastInsertId();
    }
}
