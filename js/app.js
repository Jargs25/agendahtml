const formularioContactos = document.querySelector('#contacto'),
    listadoContactos = document.querySelector('#listado-contactos tbody'),
    inputBuscador = document.querySelector('#buscar');
eventListeners();

function eventListeners() {
    //Cuando el formulario de crear o editar se ejecuta.
    formularioContactos.addEventListener('submit', leerFormulario);
    //Listener para eliminar el contacto
    if (listadoContactos)
        listadoContactos.addEventListener('click', eliminarContacto);
    inputBuscador.addEventListener('input', buscarContactos);
    numeroContactos();
}

function leerFormulario(e) {
    e.preventDefault();
    // console.log("Presionaste!");
    const nombre = document.querySelector("#nombre").value,
        empresa = document.querySelector("#empresa").value,
        telefono = document.querySelector("#telefono").value,
        accion = document.querySelector("#accion").value;

    if (nombre === '' || empresa === '' || telefono === '') {
        // 2 parametros: texto y clase;
        mostrarNotificacion('Todos los campos son obligatorios', 'error');
    } else {
        // Para la validacion, crear llamado a Ajax.
        const infoContacto = new FormData();
        infoContacto.append('nombre', nombre);
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);

        // console.log(infoContacto);
        //Saca una copia y muestra su contenido.
        // console.log(...infoContacto);

        if (accion === 'crear') {
            //Creamos un contacto
            insertarBD(infoContacto);
        } else {
            const idRegistro = document.querySelector('#id').value;
            infoContacto.append('id', idRegistro);
            actualizarRegistro(infoContacto);
        }
        // mostrarNotificacion('Contacto creado correctamente', 'exito');
    }
}
/* Inserta en BD por Ajax */
function insertarBD(datos) {
    var form = {};
    datos.forEach(function(value, key) {
        form[key] = value;
    });
    const nuevoContacto = document.createElement('tr');
    nuevoContacto.innerHTML = `
                <td>${form.nombre}</td>
                <td>${form.empresa}</td>
                <td>${form.telefono}</td>
            `;
    //Contenedor botones
    const contenedorBotones = document.createElement('td');
    //Crear icono editar
    const iconoEditar = document.createElement('i');
    iconoEditar.classList.add('fas', 'fa-pen-square');
    //Crea el enlace para editar
    const btnEditar = document.createElement('a');
    btnEditar.appendChild(iconoEditar);
    btnEditar.href = `#`;
    btnEditar.classList.add('btn', 'btn-editar');
    //Agregar al padre
    contenedorBotones.appendChild(btnEditar);

    //Crear icono editar
    const iconoEliminar = document.createElement('i');
    iconoEliminar.classList.add('fas', 'fa-trash-alt');
    //Crear boton eliminar
    const btnEliminar = document.createElement('button');
    btnEliminar.appendChild(iconoEliminar);
    btnEliminar.classList.add('btn', 'btn-borrar');
    //Agregar a padre
    contenedorBotones.appendChild(btnEliminar);
    //Agregar a tr
    nuevoContacto.appendChild(contenedorBotones);
    // Agregar a la lista de contactos (table)
    listadoContactos.appendChild(nuevoContacto);
    // Resetear el form
    document.querySelector('form').reset();
    // Mostrar notificación
    mostrarNotificacion('Contacto Creado Correctamente', 'correcto');
    //Actualizar el número
    numeroContactos();
}

function eliminarContacto(e) {
    if (e.target.parentElement.classList.contains('btn-borrar')) {
        const id = e.target.parentElement.getAttribute('data-id');
        console.log(id);
        const respuesta = confirm('¿Estás Seguro (a)?');

        if (respuesta) {
            e.target.parentElement.parentElement.parentElement.remove();
            mostrarNotificacion('Contacto eliminado', 'correcto');
            numeroContactos();
        }
    }
}

function mostrarNotificacion(mensaje, clase) {
    const notificacion = document.createElement('div');
    notificacion.classList.add(clase, 'notificacion', 'sombra');
    notificacion.textContent = mensaje;

    // Formulario
    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

    // Ocultar y mostrar notificacion.
    setTimeout(() => {
        notificacion.classList.add('visible');
        setTimeout(() => {
            notificacion.classList.remove('visible');
            setTimeout(() => {
                notificacion.remove();
            }, 500);
        }, 3000);
    }, 100);
}
//Buscador
function buscarContactos(e) {
    // console.log(e.target.value);
    const expresion = new RegExp(e.target.value, "i"),
        registros = document.querySelectorAll('tbody tr');

    registros.forEach(registro => {
        registro.style.display = 'none';
        if (registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1) {
            registro.style.display = 'table-row';
        }
        numeroContactos();
    });
}
//Mustra el numero de contactos
function numeroContactos() {
    const totalContactos = document.querySelectorAll('tbody tr'),
        contenedorNumero = document.querySelector('.total-contactos span');

    let total = 0;

    totalContactos.forEach(contacto => {
        if (contacto.style.display === '' || contacto.style.display === 'table-row') {
            total++;
        }
    });

    // console.log(total);
    contenedorNumero.textContent = total;
}