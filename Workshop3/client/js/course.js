const API_CURSOS = "http://localhost:3001/api/cursos";
const API_PROFESORES = "http://localhost:3001/api/profesores";

//LISTAR CURSOS

async function listarCursos() {
    const res = await fetch(API_CURSOS);
    const cursos = await res.json();

    const tabla = document.getElementById("tablaCursos");
    tabla.innerHTML = "";

    cursos.forEach(c => {
        tabla.innerHTML += `
            <tr>
                <td>${c.nombre}</td>
                <td>${c.codigo}</td>
                <td>${c.descripcion}</td>
                <td>${c.profesor?.nombre || ""} ${c.profesor?.apellidos || ""}</td>
                <td>
                    <button onclick="irEditar('${c._id}')">Editar</button>
                    <button onclick="eliminarCurso('${c._id}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

//CARGAR PROFESORES

async function cargarProfesores() {
    const res = await fetch(API_PROFESORES);
    const profesores = await res.json();

    const select = document.getElementById("profesorSelect");
    select.innerHTML = "<option value=''>Seleccione Profesor</option>";

    profesores.forEach(p => {
        select.innerHTML += `
            <option value="${p._id}">
                ${p.nombre} ${p.apellidos}
            </option>
        `;
    });
}

//CREAR CURSO

async function guardarCurso() {

    const curso = {
        nombre: document.getElementById("nombre").value,
        codigo: document.getElementById("codigo").value,
        descripcion: document.getElementById("descripcion").value,
        profesor: document.getElementById("profesorSelect").value
    };

    const res = await fetch(API_CURSOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(curso)
    });

    if (res.ok) {
        alert("Curso creado correctamente ✅");
        window.location.href = "list_course.html";
    } else {
        alert("Error al crear curso ❌");
    }
}

//ELIMINAR

async function eliminarCurso(id) {

    if (!confirm("¿Seguro que deseas eliminar este curso?")) return;

    const res = await fetch(`${API_CURSOS}/${id}`, {
        method: "DELETE"
    });

    if (res.ok) {
        alert("Curso eliminado correctamente 🗑️");
        listarCursos();
    } else {
        alert("Error al eliminar ❌");
    }
}

//IR A EDITAR

function irEditar(id) {
    //Guardamos el ID en localStorage para evitar problemas con la URL
    localStorage.setItem("cursoEditarId", id);
    window.location.href = "http://localhost:3000/pages/edit_course.html";
}

//CARGAR CURSO PARA EDITAR

async function cargarCursoEditar() {

    // leer el ID desde localStorage
    const id = localStorage.getItem("cursoEditarId");

    if (!id) {
        alert("ID no encontrado");
        return;
    }

    const res = await fetch(`${API_CURSOS}/${id}`);
    const curso = await res.json();

    document.getElementById("cursoId").value = curso._id;
    document.getElementById("nombre").value = curso.nombre;
    document.getElementById("codigo").value = curso.codigo;
    document.getElementById("descripcion").value = curso.descripcion;

    document.getElementById("profesorSelect").value = curso.profesor?._id || curso.profesor;
}

//ACTUALIZAR

async function actualizarCurso() {

    const id = document.getElementById("cursoId").value;

    const curso = {
        nombre: document.getElementById("nombre").value,
        codigo: document.getElementById("codigo").value,
        descripcion: document.getElementById("descripcion").value,
        profesor: document.getElementById("profesorSelect").value
    };

    const res = await fetch(`${API_CURSOS}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(curso)
    });

    if (res.ok) {

        localStorage.removeItem("cursoEditarId");
        alert("Curso actualizado correctamente ✅");
        window.location.href = "list_course.html";
    } else {
        alert("Error al actualizar ❌");
    }
}