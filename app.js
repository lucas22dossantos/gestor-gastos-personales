// Mapa local para mostrar el nombre de cada categoría recibida desde la API.
const categorias = {
  1: "Vivienda",
  2: "Alimento",
  3: "Transporte",
  4: "Salud",
  5: "Entretenimiento",
  6: "Otros",
};

// Conserva todos los gastos descargados para poder aplicar filtros sin consultar
// nuevamente la API.
let data = [];

// Renderiza una lista de gastos y actualiza sus totales en la interfaz.
function mostrarGastos(listaGastos) {
  document.getElementById("cuerpo-tabla-gastos").innerHTML = "";

  // Estos acumuladores se calculan sobre la lista completa o sobre el filtro activo.
  let total = 0;
  const totalesPorCategoria = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

  listaGastos.forEach(function (gasto) {
    const fila = `
            <tr>
                <td>${gasto.descripcion}</td>
                <td>${gasto.monto}</td>
                <td>${categorias[gasto.categoria_id]}</td>
                <td>${gasto.fecha}</td>
                <td>
                    <button onclick="cargarGastoEnFormulario(${gasto.id}, '${gasto.descripcion}', ${gasto.monto}, ${gasto.categoria_id}, '${gasto.fecha}')">Editar</button>
                    <button onclick="eliminarGasto(${gasto.id})">Eliminar</button>
                </td>
            </tr>
        `;
    document.getElementById("cuerpo-tabla-gastos").innerHTML += fila;

    total += Number(gasto.monto);
    totalesPorCategoria[gasto.categoria_id] += Number(gasto.monto);
  });

  // Actualiza el total general y el resumen de cada categoría.
  document.getElementById("total-gastado").innerHTML = total.toFixed(2);

  document.getElementById("lista-totales-categoria").innerHTML = "";
  for (let clave in totalesPorCategoria) {
    const item = `<li>${categorias[clave]}: $${totalesPorCategoria[clave].toFixed(2)}</li>`;
    document.getElementById("lista-totales-categoria").innerHTML += item;
  }
}

// Obtiene los gastos de la API y reconstruye las filas de la tabla.
async function cargarGastos() {
  const urlGastos = `src/controllers/api.php`;
  const response = await fetch(urlGastos);
  data = await response.json();

  mostrarGastos(data);
}

// Envía un nuevo gasto al backend mediante una petición POST.
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

// Elimina un gasto por su identificador mediante una petición DELETE.
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

// Copia los datos del gasto seleccionado en los campos del formulario para editarlo.
function cargarGastoEnFormulario(id, descripcion, monto, categoria_id, fecha) {
  document.getElementById("gasto-id").value = id;
  document.getElementById("descripcion").value = descripcion;
  document.getElementById("monto").value = monto;
  document.getElementById("categoria_id").value = categoria_id;
  document.getElementById("fecha").value = fecha;
}

// Envía los cambios de un gasto existente mediante una petición PUT.
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

    // Valida los campos antes de enviar datos al backend.
    if (descripcion.trim() === "") {
      alert("La descripción no puede estar vacía.");
      return;
    }

    if (monto.trim() === "" || Number(monto) <= 0) {
      alert("El monto debe ser un número mayor a cero.");
      return;
    }

    if (categoria_id.trim() === "" || Number(categoria_id) <= 0) {
      alert("La categorias no puede estar vacía.");
      return;
    }

    if (fecha.trim() === "") {
      alert("La fecha no puede estar vacía.");
      return;
    }

    if (id === "") {
      await guardarGasto(descripcion, monto, categoria_id, fecha);
    } else {
      await actualizarGasto(id, descripcion, monto, categoria_id, fecha);
    }

    cargarGastos();
    document.getElementById("form-gasto").reset();
  });

document
  .getElementById("filtro-categoria")
  .addEventListener("change", function () {
    // Filtra la copia local y vuelve a renderizar la tabla y sus totales.
    const categoriaSeleccionada =
      document.getElementById("filtro-categoria").value;

    if (categoriaSeleccionada === "todas") {
      mostrarGastos(data);
    } else {
      const gastosFiltrados = data.filter(function (gasto) {
        return gasto.categoria_id == categoriaSeleccionada;
      });
      mostrarGastos(gastosFiltrados);
    }
  });

cargarGastos();
