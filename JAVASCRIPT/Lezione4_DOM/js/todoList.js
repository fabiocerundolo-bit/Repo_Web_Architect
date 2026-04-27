/* ============================================================
   TodoList – script04_TodoList.js
   Funzioni: addItem, saveItems, loadItems, deleteItem, renderList
   Persistenza: localStorage
   ============================================================ */

/** @type {Array<{id: number, testo: string, data: string, completato: boolean}>} */
let items = [];

// ── Helpers ──────────────────────────────────────────────────

function saveItems() {
    localStorage.setItem("todoItems", JSON.stringify(items));
}

function loadItems() {
    const raw = localStorage.getItem("todoItems");
    items = raw ? JSON.parse(raw) : [];
    renderList();
}

// ── Render ───────────────────────────────────────────────────

function renderList() {
    const todoList = document.getElementById("todoList");
    todoList.innerHTML = "";

    items.forEach(item => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        if (item.completato) li.classList.add("completato");

        // Testo + data
        const span = document.createElement("span");
        span.className = "todo-text";
        span.textContent = item.testo + (item.data ? "  📅 " + item.data : "");

        // Click sul testo → toggle completato
        span.addEventListener("click", function () {
            item.completato = !item.completato;
            saveItems();
            renderList();
        });

        // Bottone elimina
        const btnDel = document.createElement("button");
        btnDel.className = "btn btn-danger btn-sm ms-2";
        btnDel.textContent = "✕";
        btnDel.addEventListener("click", function (e) {
            e.stopPropagation();
            deleteItem(item.id);
        });

        li.appendChild(span);
        li.appendChild(btnDel);
        todoList.appendChild(li);
    });
}

// ── CRUD ─────────────────────────────────────────────────────

function addItem() {
    const itemInput = document.getElementById("itemInput");
    const dataInput = document.getElementById("dataInput");

    const testo = itemInput.value.trim();
    if (!testo) {
        itemInput.focus();
        itemInput.classList.add("is-invalid");
        return;
    }
    itemInput.classList.remove("is-invalid");

    const nuovoItem = {
        id: Date.now(),
        testo: testo,
        data: dataInput.value.trim(),
        completato: false
    };

    items.push(nuovoItem);
    saveItems();
    renderList();

    // Reset campi
    itemInput.value = "";
    dataInput.value = "";
    itemInput.focus();
}

function deleteItem(id) {
    items = items.filter(i => i.id !== id);
    saveItems();
    renderList();
}

// ── Init ─────────────────────────────────────────────────────

// Supporto tasto Invio nel campo itemInput
function handleKeypress(event) {
    if (event.key === "Enter") {
        addItem();
    }
}

document.addEventListener("DOMContentLoaded", loadItems);
