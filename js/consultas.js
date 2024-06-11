const listaConsultas = document.getElementById('lista-consultas');
const mascota = document.getElementById('mascota');
const veterinaria = document.getElementById('veterinaria');
const historia = document.getElementById('historia');
const diagnostico = document.getElementById('diagnostico');
const btnGuardar = document.getElementById('btn-guardar');
const indice = document.getElementById('indice');
const formulario = document.getElementById('formulario');

let consultas = [];
let mascotas = [];
let veterinarias = [];

const url = 'http://localhost:5000';

async function listarConsultas() {
  const entidad = "consultas";
  try {
    const respuesta = await fetch(`${url}/${entidad}`);
    const consultaDelServidor = await respuesta.json();

    if (Array.isArray(consultaDelServidor)) {
      consultas = consultaDelServidor;
    }

    if (respuesta.ok) {
      const htmlConsultas = consultas.map((consulta, indice) =>
        `<tr>
                <th scope="row">${indice}</th>
                <td>${consulta.mascota.nombre}</td>
                <td>${consulta.veterinaria.nombre}</td>
                <td>${consulta.diagnostico}</td>
                <td>${consulta.fechaCreacion}</td>
                <td>${consulta.fechaEdicion}</td>
                <td>
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <button type="button" class="editar btn btn-info">editar</button>
                    </div>
                </td>
            </tr>`
      ).join("");
      listaConsultas.innerHTML = htmlConsultas;
      Array.from(document.getElementsByClassName('editar')).forEach((botonEditar, index) => botonEditar.onclick = editar(index));
    }
  } catch (error) {
    $(".alert").show();
  }
}






async function listarMascotas() {
  const entidad = "mascotas";
  try {
    const respuesta = await fetch(`${url}/${entidad}`);
    const mascotaDelServidor = await respuesta.json();

    if (Array.isArray(mascotaDelServidor)) {
      mascotas = mascotaDelServidor;
    }

    if (respuesta.ok) {
      mascotas.forEach((_mascota, indice) => {
        const optionActual = document.createElement("option");
        optionActual.innerHTML = _mascota.nombre;
        optionActual.value = indice;
        mascota.appendChild(optionActual);
      })
    }
  } catch (error) {
    $(".alert").show();
  }
}





async function listarVeterinarias() {
  const entidad = "veterinarias";
  try {
    const respuesta = await fetch(`${url}/${entidad}`);
    const veterinariaDelServidor = await respuesta.json();

    if (Array.isArray(veterinariaDelServidor)) {
      veterinarias = veterinariaDelServidor;
    }

    if (respuesta.ok) {
      veterinarias.forEach((_veterinaria, indice) => {
        const optionActual = document.createElement("option");
        optionActual.innerHTML = _veterinaria.nombre;
        optionActual.value = indice;
        veterinaria.appendChild(optionActual);
      })
    }
  } catch (error) {
    $(".alert").show();
  }
}


async function enviarDatos(evento) {
  const entidad = "consultas"
  evento.preventDefault();
  try {
    const datos = {
      mascota: mascota.value,
      veterinaria: veterinaria.value,
      historia: historia.value,
      diagnostico: diagnostico.value,
    };
    if (validar(datos) === true) {
      let method = 'POST';
      let urlEnvio = `${url}/${entidad}`;
      const accion = btnGuardar.innerHTML;

      if (accion === 'Editar') {
        method = 'PUT'
        consultas[indice.value] = datos;
        urlEnvio = `${url}/${entidad}/${indice.value}`
      }

      const respuesta = await fetch(urlEnvio, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos),
      })

      if (respuesta.ok) {
        listarConsultas();
        resetModal();
      }
      formulario.classList.add('was-validated')
      return
    }
    $(".alert").show();
    /* resetModal() */
  } catch (error) {
    $(".alert").show();
  }
}



function editar(index) {
  return function cuandoCliqueo() {
    btnGuardar.innerHTML = 'Editar'
    $('#exampleModalCenter').modal('toggle');
    const consulta = consultas[index];
    indice.value = index;
    mascota.value = consulta.mascota.id;
    veterinaria.value = consulta.veterinaria.id;
    historia.value = consulta.historia;
    diagnostico.value = consulta.diagnostico;
  }
}


function resetModal() {
  btnGuardar.innerHTML = 'Crear';

  [indice, mascota, veterinaria, historia, diagnostico].forEach(
    (inputActual)=>{
      inputActual.value = "";
      inputActual.classList.remove("is-invalid");
      inputActual.classList.remove("is-valid");


    }
  );
  $('.alert').hide();
  $('#exampleModalCenter').modal('toggle');
}
  

  
  



function validar(datos) {
  if (typeof datos != 'object') return false;
  let respuesta = true;
  for (let llave in datos) {
    if(datos[llave].length === 0){
      document.getElementById(llave).classList.add('is-invalid');
      respuesta = false;
    } else {
      document.getElementById(llave).classList.remove('is-invalid');
      document.getElementById(llave).classList.add('is-valid');
    }
  }
  if(respuesta === true) $(".alert-warning").hide();
  return respuesta
}

listarConsultas();
listarMascotas();
listarVeterinarias();


btnGuardar.onclick = enviarDatos;