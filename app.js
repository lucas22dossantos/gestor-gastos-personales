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

async function guardarGasto(descripcion, monto, categoria_id, fecha) {
  const response = await fetch("src/controllers/api.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      descripcion: descripcion,
      monto: monto,
      categoria_id: categoria_id,
      fecha: fecha,
    }),
  });

  const data = await response.json();
  console.log(data);
}

document
  .getElementById("form-gasto")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const descripcion = document.getElementById("descripcion").value;
    const monto = document.getElementById("monto").value;
    const categoria_id = document.getElementById("categoria_id").value;
    const fecha = document.getElementById("fecha").value;

    await guardarGasto(descripcion, monto, categoria_id, fecha);

    cargarGastos();
  });

cargarGastos();
