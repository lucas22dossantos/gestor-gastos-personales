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

// Lee el presupuesto guardado en el navegador y lo muestra en el formulario.
function cargarPresupuesto() {
  const presupuestoGuardado = localStorage.getItem("presupuesto");

  if (presupuestoGuardado !== null) {
    document.getElementById("presupuesto").value = presupuestoGuardado;
  }
}

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

  // Limpia y reconstruye el resumen para que coincida con los gastos visibles.
  document.getElementById("lista-totales-categoria").innerHTML = "";
  for (let clave in totalesPorCategoria) {
    const item = `<li>${categorias[clave]}: $${totalesPorCategoria[clave].toFixed(2)}</li>`;
    document.getElementById("lista-totales-categoria").innerHTML += item;
  }

  mostrarGraficoCategorias(totalesPorCategoria);
}

// Genera una barra para cada categoría a partir de sus totales acumulados.
function mostrarGraficoCategorias(totalesPorCategoria) {
  // Busca el gasto más alto para usarlo como referencia del ancho de las barras.
  let maximo = 0;

  for (let clave in totalesPorCategoria) {
    if (totalesPorCategoria[clave] > maximo) {
      maximo = totalesPorCategoria[clave];
    }
  }

  // Limpia el gráfico anterior antes de mostrar los valores actualizados.
  document.getElementById("grafico-categorias").innerHTML = "";

  for (let clave in totalesPorCategoria) {
    // Calcula el ancho relativo; si no hay gastos, todas las barras quedan en cero.
    const valor = totalesPorCategoria[clave];
    const porcentaje = maximo > 0 ? (valor / maximo) * 100 : 0;

    const fila = `
            <div class="barra-fila">
                <span class="barra-etiqueta">${categorias[clave]}</span>
                <div class="barra-contenedor">
                    <div class="barra-relleno" style="width: ${porcentaje}%;"></div>
                </div>
                <span class="barra-valor">$${valor.toFixed(2)}</span>
            </div>
        `;

    document.getElementById("grafico-categorias").innerHTML += fila;
  }
}

// Calcula cuánto presupuesto queda después de restar los gastos del mes actual.
// También guarda el presupuesto en el navegador para conservarlo al recargar.
function actualizarDisponible() {
  const presupuesto = Number(document.getElementById("presupuesto").value) || 0;
  const hoy = new Date();
  const mesActual = hoy.getMonth() + 1;
  const anioActual = hoy.getFullYear();
  const mesTexto = String(mesActual).padStart(2, "0");
  const mesActualString = `${anioActual}-${mesTexto}`;

  const gastosDelMes = data.filter(function (gasto) {
    return gasto.fecha.substring(0, 7) === mesActualString;
  });

  // localStorage conserva este valor en este navegador, sin enviarlo a la API.
  localStorage.setItem("presupuesto", presupuesto);

  let totalDelMes = 0;

  gastosDelMes.forEach(function (gasto) {
    totalDelMes += Number(gasto.monto);
  });

  const disponible = presupuesto - totalDelMes;

  document.getElementById("disponible").innerHTML = disponible.toFixed(2);
}

// Obtiene los gastos de la API y reconstruye las filas de la tabla.
async function cargarGastos() {
  const urlGastos = `src/controllers/api.php`;
  const response = await fetch(urlGastos);
  data = await response.json();

  mostrarGastos(data);
  actualizarDisponible();
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

    // Decide si la operación debe crear un gasto o actualizar uno existente.
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

document
  .getElementById("btn-filtrar-fecha")
  .addEventListener("click", function () {
    // Filtra los gastos guardados usando las fechas ingresadas por el usuario.
    const desde = document.getElementById("filtro-desde").value;
    const hasta = document.getElementById("filtro-hasta").value;

    // Si no se indican fechas, vuelve a mostrar todos los gastos.
    if (desde === "" && hasta === "") {
      mostrarGastos(data);
      return;
    }

    // Las fechas ISO (AAAA-MM-DD) se pueden comparar directamente como texto.
    const gastosFiltrados = data.filter(function (gasto) {
      return gasto.fecha >= desde && gasto.fecha <= hasta;
    });

    mostrarGastos(gastosFiltrados);
  });

document
  .getElementById("presupuesto")
  // Recalcula y guarda el presupuesto cada vez que cambia su valor.
  .addEventListener("input", actualizarDisponible);

// Recupera el presupuesto antes de cargar los gastos y calcular lo disponible.
cargarPresupuesto();
cargarGastos();
