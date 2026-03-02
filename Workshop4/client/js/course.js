const API_BASE       = "http://localhost:3001";
const API_CURSOS     = `${API_BASE}/api/cursos`;
const API_PROFESORES = `${API_BASE}/api/profesores`;

//  UTILIDADES 

/**
 * Muestra un objeto JSON en el elemento #result
 * @param {Object} obj 
 */
function showJSON(obj) {
    const el = document.getElementById("result");
    if (el) el.textContent = JSON.stringify(obj, null, 2);
}

/**
 * Obtiene el token del sessionStorage
 * @returns {string|null}
 */
function getToken() {
    return sessionStorage.getItem("authToken");
}

/**
 * Retorna los headers con el token de autenticación
 * @param {boolean} withContentType 
 * @returns {Object}
 */
function getHeaders(withContentType = false) {
    const headers = { "Authorization": `Bearer ${getToken()}` };
    if (withContentType) headers["Content-Type"] = "application/json";
    return headers;
}

// AUTENTICACIÓN 

// Verifica si hay token, si no redirige al login
 
function checkAuth() {
    if (!getToken()) window.location.href = "../login.html";
}

// Elimina el token y redirige al login
 
function logout() {
    sessionStorage.removeItem("authToken");
    window.location.href = "../login.html";
}

/**
 * Inicia sesión y guarda el token en sessionStorage
 * @param {Event} event 
 */
async function login(event) {
    event.preventDefault();

    const email    = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;

    if (!email || !password) {
        showJSON({ error: "Email y contraseña son requeridos." });
        return;
    }

    try {
        const res  = await fetch(`${API_BASE}/auth/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            showJSON({ error: "Error de autenticación", status: res.status, ...data });
            return;
        }

        if (data?.token) {
            sessionStorage.setItem("authToken", data.token);
            window.location.href = "pages/list_course.html";
        }

    } catch (err) {
        showJSON({ error: "No se pudo conectar a la API", detail: String(err) });
    }
}

/**
 * Registra un nuevo usuario
 * @param {Event} event 
 */
async function register(event) {
    event.preventDefault();

    const name     = document.getElementById("name")?.value.trim();
    const lastName = document.getElementById("lastName")?.value.trim();
    const email    = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;

    if (!name || !lastName || !email || !password) {
        showJSON({ error: "Todos los campos son requeridos." });
        return;
    }

    try {
        const res  = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, lastName, email, password }),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            showJSON({ error: "Error al registrar", status: res.status, ...data });
            return;
        }

        showJSON({ message: "Registro exitoso. Redirigiendo al login..." });
        setTimeout(() => window.location.href = "login.html", 2000);

    } catch (err) {
        showJSON({ error: "No se pudo conectar a la API", detail: String(err) });
    }
}

// PROFESORES

// Carga los profesores en el select #profesorSelect
 
async function cargarProfesores() {
    try {
        const res        = await fetch(API_PROFESORES, { headers: getHeaders() });
        const profesores = await res.json();
        const select     = document.getElementById("profesorSelect");

        if (!select) return;

        select.innerHTML = "<option value=''>-- Seleccione un profesor --</option>";
        profesores.forEach(p => {
            const option    = document.createElement("option");
            option.value    = p._id;
            option.textContent = `${p.nombre} ${p.apellidos}`;
            select.appendChild(option);
        });

    } catch (err) {
        showJSON({ error: "Error cargando profesores", detail: String(err) });
    }
}

// CURSOS 

//Lista todos los cursos en la tabla #tablaCursos
 
async function listarCursos() {
    try {
        const res    = await fetch(API_CURSOS, { headers: getHeaders() });
        const cursos = await res.json();
        const tabla  = document.getElementById("tablaCursos");

        if (!tabla) return;

        tabla.innerHTML = "";
        cursos.forEach(c => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${c.nombre}</td>
                <td>${c.codigo}</td>
                <td>${c.descripcion || ""}</td>
                <td>${c.profesor?.nombre || ""} ${c.profesor?.apellidos || ""}</td>
                <td>
                    <button onclick="irEditar('${c._id}')">✏️ Editar</button>
                    <button onclick="eliminarCurso('${c._id}')">🗑️ Eliminar</button>
                </td>
            `;
            tabla.appendChild(tr);
        });

    } catch (err) {
        showJSON({ error: "No se pudo conectar a la API", detail: String(err) });
    }
}

// un nuevo curso
 
async function guardarCurso() {
    const nombre      = document.getElementById("nombre")?.value.trim();
    const codigo      = document.getElementById("codigo")?.value.trim();
    const descripcion = document.getElementById("descripcion")?.value.trim();
    const profesor    = document.getElementById("profesorSelect")?.value;

    if (!nombre || !codigo || !profesor) {
        showJSON({ error: "Nombre, código y profesor son requeridos." });
        return;
    }

    try {
        const res = await fetch(API_CURSOS, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify({ nombre, codigo, descripcion, profesor })
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            showJSON({ error: "Error al crear curso", ...data });
            return;
        }

        alert("Curso creado correctamente ✅");
        window.location.href = "list_course.html";

    } catch (err) {
        showJSON({ error: "No se pudo conectar a la API", detail: String(err) });
    }
}

/**
 Redirige a la página de edición guardando el ID en sessionStorage
 @param {string} id 
 */
function irEditar(id) {
    sessionStorage.setItem("cursoEditarId", id);
    window.location.href = "edit_course.html";
}

// Carga los datos del curso a editar

async function cargarCursoEditar() {
    const id = sessionStorage.getItem("cursoEditarId");

    if (!id) {
        alert("ID de curso no encontrado.");
        window.location.href = "list_course.html";
        return;
    }

    try {
        const res   = await fetch(`${API_CURSOS}/${id}`, { headers: getHeaders() });
        const curso = await res.json();

        document.getElementById("cursoId").value     = curso._id;
        document.getElementById("nombre").value      = curso.nombre      ?? "";
        document.getElementById("codigo").value      = curso.codigo      ?? "";
        document.getElementById("descripcion").value = curso.descripcion ?? "";

        await cargarProfesores();
        document.getElementById("profesorSelect").value = curso.profesor?._id || curso.profesor || "";

        showJSON(curso);

    } catch (err) {
        showJSON({ error: "Error cargando el curso", detail: String(err) });
    }
}

// Actualiza el curso con los datos del formulario
 
async function actualizarCurso() {
    const id          = document.getElementById("cursoId")?.value;
    const nombre      = document.getElementById("nombre")?.value.trim();
    const codigo      = document.getElementById("codigo")?.value.trim();
    const descripcion = document.getElementById("descripcion")?.value.trim();
    const profesor    = document.getElementById("profesorSelect")?.value;

    if (!nombre || !codigo || !profesor) {
        showJSON({ error: "Nombre, código y profesor son requeridos." });
        return;
    }

    try {
        const res = await fetch(`${API_CURSOS}/${id}`, {
            method: "PUT",
            headers: getHeaders(true),
            body: JSON.stringify({ nombre, codigo, descripcion, profesor })
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            showJSON({ error: "Error al actualizar", ...data });
            return;
        }

        sessionStorage.removeItem("cursoEditarId");
        alert("Curso actualizado correctamente ✅");
        window.location.href = "list_course.html";

    } catch (err) {
        showJSON({ error: "No se pudo conectar a la API", detail: String(err) });
    }
}

/**
 * Elimina un curso por ID
 * @param {string} id 
 */
async function eliminarCurso(id) {
    if (!confirm("¿Seguro que deseas eliminar este curso?")) return;

    try {
        const res  = await fetch(`${API_CURSOS}/${id}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            showJSON({ error: "Error al eliminar", ...data });
            return;
        }

        alert("Curso eliminado correctamente 🗑️");
        listarCursos();

    } catch (err) {
        showJSON({ error: "Error al eliminar", detail: String(err) });
    }
}

//  INICIALIZAR FORMULARIOS 
document.addEventListener("DOMContentLoaded", () => {
    const loginForm    = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm)    loginForm.addEventListener("submit", login);
    if (registerForm) registerForm.addEventListener("submit", register);
});