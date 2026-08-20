const categorias = {
  1: "Vivienda",
  2: "Alimento",
  3: "Transporte",
  4: "Salud",
  5: "Entretenimiento",
  6: "Otros",
};

async function cargarGastos() {
  // ¿qué línea usarías para pedir los datos a tu api.php?
  const urlGastos = `src/controllers/api.php`;
  // ¿qué línea usarías para convertir la respuesta a JSON?
  const response = await fetch(urlGastos);
  const data = await response.json();

  document.getElementById("cuerpo-tabla-gastos").innerHTML = "";

  data.forEach(function (gasto) {
    const fila = `
        <tr>
            <td>${gasto.descripcion}</td>
            <td>${gasto.monto}</td>
            <td>${categorias[gasto.categoria_id]}</td>
            <td>${gasto.fecha}</td>
            <td>
                <button>Editar</button>
                <button>Eliminar</button>
            </td>
        </tr>
    `;

    document.getElementById("cuerpo-tabla-gastos").innerHTML += fila;
  });
}
cargarGastos();
