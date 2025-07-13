const participantes = [];
const pins = {};
let asignaciones = {};

// Elementos del DOM
const nombreInput = document.getElementById('nombreInput');
const pinInput = document.getElementById('pinInput');
const agregarBtn = document.getElementById('agregarBtn');
const listaParticipantes = document.getElementById('listaParticipantes');
const sortearBtn = document.getElementById('sortearBtn');
const consultaNombre = document.getElementById('consultaNombre');
const consultaPin = document.getElementById('consultaPin');
const consultarBtn = document.getElementById('consultarBtn');
const resultadoConsulta = document.getElementById('resultadoConsulta');
const borrarBtn = document.getElementById('borrarBtn');
const reiniciarBtn = document.getElementById('reiniciarBtn');
const adminBtn = document.getElementById('adminBtn');
const cerrarAdminBtn = document.getElementById('cerrarAdminBtn');
const listaAsignaciones = document.getElementById('listaAsignaciones');

// Secciones
const registroSeccion = document.getElementById('registroSeccion');
const consultaSeccion = document.getElementById('consultaSeccion');
const accionesGlobales = document.getElementById('accionesGlobales');
const adminSeccion = document.getElementById('adminSeccion');

// Modales
const modalMensaje = document.getElementById('modalMensaje');
const modalTexto = document.getElementById('modalTexto');
const modalAceptar = document.getElementById('modalAceptar');
const modalCancelar = document.getElementById('modalCancelar');

const modalEntrada = document.getElementById('modalEntrada');
const modalEntradaTexto = document.getElementById('modalEntradaTexto');
const modalEntradaInput = document.getElementById('modalEntradaInput');
const modalEntradaAceptar = document.getElementById('modalEntradaAceptar');
const modalEntradaCancelar = document.getElementById('modalEntradaCancelar');

// Mostrar modal de confirmación
function mostrarConfirmacion(mensaje, callback) {
  modalTexto.textContent = mensaje;
  modalMensaje.style.display = 'flex';
  modalAceptar.onclick = () => {
    modalMensaje.style.display = 'none';
    callback(true);
  };
  modalCancelar.style.display = 'inline-block';
  modalCancelar.onclick = () => {
    modalMensaje.style.display = 'none';
    callback(false);
  };
}

// Mostrar modal de entrada
function mostrarEntrada(mensaje, callback) {
  modalEntradaTexto.textContent = mensaje;
  modalEntradaInput.value = '';
  modalEntrada.style.display = 'flex';

  modalEntradaAceptar.onclick = () => {
    const valor = modalEntradaInput.value.trim();
    modalEntrada.style.display = 'none';
    callback(valor);
  };
  modalEntradaCancelar.onclick = () => {
    modalEntrada.style.display = 'none';
    callback(null);
  };
}

// Agregar participante
agregarBtn.addEventListener('click', () => {
  const nombre = nombreInput.value.trim();
  const pin = pinInput.value.trim();

  if (!nombre || !/^\d{4}$/.test(pin)) {
    alert("Debes ingresar un nombre y un PIN de 4 dígitos.");
    return;
  }

  if (participantes.includes(nombre)) {
    alert("Ese nombre ya fue agregado.");
    return;
  }

  participantes.push(nombre);
  pins[nombre] = pin;

  const li = document.createElement('li');
  li.textContent = nombre;
  listaParticipantes.appendChild(li);

  nombreInput.value = '';
  pinInput.value = '';

  if (participantes.length >= 3) {
    sortearBtn.disabled = false;
  }
});

// Realizar el sorteo
sortearBtn.addEventListener('click', () => {
  if (participantes.length < 2) {
    alert("Se necesitan al menos 2 participantes.");
    return;
  }

  const copia = [...participantes];
  let mezclado;

  do {
    mezclado = [...copia].sort(() => Math.random() - 0.5);
  } while (participantes.some((nombre, i) => nombre === mezclado[i]));

  asignaciones = {};
  participantes.forEach((nombre, i) => {
    asignaciones[nombre] = mezclado[i];
  });

  // Ocultar registro, mostrar consulta y acciones
  registroSeccion.style.display = 'none';
  consultaSeccion.style.display = 'block';
  accionesGlobales.style.display = 'block';
  adminBtn.style.display = 'inline-block';

  agregarBtn.disabled = true;
  sortearBtn.disabled = true;
});

// Consultar asignación individual
consultarBtn.addEventListener('click', () => {
  const nombre = consultaNombre.value.trim();
  const pin = consultaPin.value.trim();

  if (!participantes.includes(nombre)) {
    resultadoConsulta.textContent = '❌ Nombre no encontrado.';
    borrarBtn.style.display = 'inline-block';
    return;
  }

  if (pins[nombre] !== pin) {
    resultadoConsulta.textContent = '🔐 PIN incorrecto.';
    borrarBtn.style.display = 'inline-block';
    return;
  }

  resultadoConsulta.textContent = `🎁 Te toca regalar a ${asignaciones[nombre]}.`;
  borrarBtn.style.display = 'inline-block';
});

// Borrar resultado
borrarBtn.addEventListener('click', () => {
  resultadoConsulta.textContent = '';
  consultaNombre.value = '';
  consultaPin.value = '';
  borrarBtn.style.display = 'none';
});

// Reiniciar todo con confirmación
reiniciarBtn.addEventListener('click', () => {
  mostrarConfirmacion("¿Estás seguro de que deseas reiniciar todo?", (confirmado) => {
    if (!confirmado) return;

    participantes.length = 0;
    Object.keys(pins).forEach(k => delete pins[k]);
    asignaciones = {};

    listaParticipantes.innerHTML = '';
    listaAsignaciones.innerHTML = '';
    resultadoConsulta.textContent = '';
    consultaNombre.value = '';
    consultaPin.value = '';
    nombreInput.value = '';
    pinInput.value = '';

    registroSeccion.style.display = 'block';
    consultaSeccion.style.display = 'none';
    accionesGlobales.style.display = 'none';
    adminSeccion.style.display = 'none';

    agregarBtn.disabled = false;
    sortearBtn.disabled = true;
    borrarBtn.style.display = 'none';
    adminBtn.style.display = 'none';
  });
});

// Modo admin
adminBtn.addEventListener('click', () => {
  mostrarEntrada("Ingresa la clave de administrador:", (clave) => {
    if (clave === "admin1234") {
      listaAsignaciones.innerHTML = '';
      for (const nombre in asignaciones) {
        const li = document.createElement('li');
        li.textContent = `${nombre} → ${asignaciones[nombre]}`;
        listaAsignaciones.appendChild(li);
      }
      adminSeccion.style.display = 'block';
    } else if (clave !== null) {
      alert("❌ Clave incorrecta.");
    }
  });
});

// Cerrar modo admin
cerrarAdminBtn.addEventListener('click', () => {
  adminSeccion.style.display = 'none';
});
