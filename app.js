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
                <button onclick="cargarGastoEnFormulario(${gasto.id}, '${gasto.descripcion}', ${gasto.monto}, ${gasto.categoria_id}, '${gasto.fecha}')">Editar</button>
                <button onclick="eliminarGasto(${gasto.id})" >Eliminar</button>
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

async function eliminarGasto(id) {
  const response = await fetch("src/controllers/api.php", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
    }),
  });

  const data = await response.json();
  console.log(data);

  await cargarGastos();
}

function cargarGastoEnFormulario(id, descripcion, monto, categoria_id, fecha) {
  document.getElementById("gasto-id").value = id;
  document.getElementById("descripcion").value = descripcion;
  document.getElementById("monto").value = monto;
  document.getElementById("categoria_id").value = categoria_id;
  document.getElementById("fecha").value = fecha;
}

async function actualizarGasto(id, descripcion, monto, categoria_id, fecha) {
  const response = await fetch("src/controllers/api.php", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
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

    const id = document.getElementById("gasto-id").value;
    const descripcion = document.getElementById("descripcion").value;
    const monto = document.getElementById("monto").value;
    const categoria_id = document.getElementById("categoria_id").value;
    const fecha = document.getElementById("fecha").value;

    // await guardarGasto(descripcion, monto, categoria_id, fecha);

    if (id === "") {
      // ¿qué función llamarías acá, para el caso "gasto nuevo"?
      await guardarGasto(descripcion, monto, categoria_id, fecha);
    } else {
      // ¿qué función llamarías acá, para el caso "edición"?
      await actualizarGasto(id, descripcion, monto, categoria_id, fecha);
    }

    cargarGastos();
    document.getElementById("form-gasto").reset();
  });

cargarGastos();
