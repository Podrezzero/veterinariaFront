const nombre = document.getElementById('nombre');
const documento = document.getElementById('documento');
const apellido = document.getElementById('apellido');
const indice = document.getElementById('indice');
const form = document.getElementById('form');
const btnGuardar = document.getElementById('btn-guardar');
const listaDuenos = document.getElementById('lista-duenos');
const url = 'http://localhost:5000/duenos';

let duenos = [];


async function listarDuenos() {
  try {
    const respuesta = await fetch(url);
    const duenosDelServer = await respuesta.json();
    if (Array.isArray(duenosDelServer)) {
      duenos = duenosDelServer;
    }
    if (duenos.length > 0) {
      const htmlDuenos = duenos.map((dueno, index) => `<tr>
      <th scope="row">${index}</th>
      <td>${dueno.documento}</td>
      <td>${dueno.nombre}</td>
      <td>${dueno.apellido}</td>
      <td>
          <div class="btn-group" role="group" aria-label="Basic example">
              <button type="button" class="btn btn-info editar"><i class="fas fa-edit"></i></button>
              <button type="button" class="btn btn-danger eliminar"><i class="far fa-trash-alt"></i></button>
          </div>
      </td>
    </tr>`).join("");
      listaDuenos.innerHTML = htmlDuenos;
      Array.from(document.getElementsByClassName('editar')).forEach((botonEditar, index) => botonEditar.onclick = editar(index));
      Array.from(document.getElementsByClassName('eliminar')).forEach((botonEliminar, index) => botonEliminar.onclick = eliminar(index));
      return
    }
    listaDuenos.innerHTML = `<tr>
      <td colspan ="5">No hay Dueños</td>
    </tr>`
  } catch (error) {

  }

}

async function enviarDatos(evento) {
  evento.preventDefault();
  try {
    const datos = {
      documento: documento.value,
      nombre: nombre.value,
      apellido: apellido.value
    };

    let method = 'POST';
    let urlEnvio = url;
    const accion = btnGuardar.innerHTML;
    if (accion === 'Editar') {
      method = 'PUT'
      duenos[indice.value] = datos;
      urlEnvio = `${url}/${indice.value}`
    }

    const respuesta = await fetch(urlEnvio, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos),
    })

    if (respuesta.ok) {
      listarDuenos();
      resetModal();
    }

  } catch (error) {
    $(".alert").show();
  }
}

function editar(index) {
  return function cuandoCliqueo() {
    btnGuardar.innerHTML = 'Editar'
    $('#exampleModalCenter').modal('toggle');
    const dueno = duenos[index];
    indice.value = index;
    documento.value = dueno.documento;
    nombre.value = dueno.nombre;
    apellido.value = dueno.apellido;
  }
}

function resetModal() {
  documento.value = '';
  indice.value = '';
  nombre.value = '';
  apellido.value = '';
  documento.value = '';
  btnGuardar.innerHTML = 'Crear'
}

function eliminar(index) {
  urlEnvio = `${url}/${index}`
  try {
    return async function clickEnEliminar() {
      const respuesta = await fetch(urlEnvio, {
        method: "DELETE",
      })
      if (respuesta.ok) {
        listarDuenos();
        resetModal();
      }
    }
  } catch (error) {
    $(".alert").show();
  }
} 

listarDuenos();

form.onsubmit = enviarDatos; 
 btnGuardar.onclick = enviarDatos; 