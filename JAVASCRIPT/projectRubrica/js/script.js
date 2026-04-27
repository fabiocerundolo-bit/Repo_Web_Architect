const STORAGE_KEY = "rubricaContatti";

const formSection = document.querySelector("#formSection");
const listSection = document.querySelector("#listSection");
const contactForm = document.querySelector("#contactForm");
const contactsGrid = document.querySelector("#contactsGrid");
const alertBox = document.querySelector("#alertBox");
const btnShowContacts = document.querySelector("#btnShowContacts");
const btnShowForm = document.querySelector("#btnShowForm");
const btnDeleteSelected = document.querySelector("#btnDeleteSelected");
const avatarPicker = document.querySelector("#avatarPicker");
const avatarFeedback = document.querySelector("#avatarFeedback");

const fullNameInput = document.querySelector("#fullName");
const phoneInput = document.querySelector("#phone");
const emailInput = document.querySelector("#email");

const avatarOptions = [
    "https://mockmind-api.uifaces.co/content/human/80.jpg",
    "https://mockmind-api.uifaces.co/content/human/219.jpg",
    "https://mockmind-api.uifaces.co/content/human/222.jpg",
    "https://mockmind-api.uifaces.co/content/human/92.jpg",
    "https://mockmind-api.uifaces.co/content/human/125.jpg",
    "https://mockmind-api.uifaces.co/content/human/128.jpg"
];

function readContacts() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        return [];
    }

    try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeContacts(contacts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

function getContactKey(contact, index) {
    return contact.id ?? String(index);
}

function showAlert(message, type = "info") {
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = message;
    alertBox.classList.remove("d-none");
}

function hideAlert() {
    alertBox.classList.add("d-none");
}

function showFormSection() {
    formSection.classList.remove("d-none");
    listSection.classList.add("d-none");
}

function showListSection() {
    formSection.classList.add("d-none");
    listSection.classList.remove("d-none");
    renderContacts();
}

function renderAvatarPicker() {
    avatarPicker.innerHTML = avatarOptions
        .map((avatarUrl, index) => {
            const inputId = `avatar-${index}`;

            return `
                <div class="avatar-picker-item">
                    <input class="btn-check" type="radio" name="avatarChoice" id="${inputId}" value="${avatarUrl}" ${index === 0 ? "required" : ""}>
                    <label class="avatar-choice-label" for="${inputId}">
                        <img src="${avatarUrl}" alt="Avatar UI Faces ${index + 1}">
                    </label>
                </div>
            `;
        })
        .join("");
}

function getSelectedAvatar() {
    const selectedAvatar = document.querySelector('input[name="avatarChoice"]:checked');
    return selectedAvatar ? selectedAvatar.value : "";
}

function updateDeleteButtonState() {
    const selectedCount = contactsGrid.querySelectorAll(".contact-select:checked").length;
    btnDeleteSelected.disabled = selectedCount === 0;
}

function deleteSelectedContacts() {
    const selectedKeys = Array.from(contactsGrid.querySelectorAll(".contact-select:checked"))
        .map((checkbox) => checkbox.dataset.contactKey);

    if (selectedKeys.length === 0) {
        showAlert("Seleziona almeno un contatto da eliminare.", "warning");
        return;
    }

    const contacts = readContacts();
    const remainingContacts = contacts.filter((contact, index) => {
        return !selectedKeys.includes(getContactKey(contact, index));
    });

    writeContacts(remainingContacts);
    showAlert(`${selectedKeys.length} contatto/i eliminato/i correttamente.`, "success");
    renderContacts();
}

function deleteSingleContact(contactKey) {
    const contacts = readContacts();
    const remainingContacts = contacts.filter((contact, index) => {
        return getContactKey(contact, index) !== contactKey;
    });

    writeContacts(remainingContacts);
    showAlert("Contatto eliminato correttamente.", "success");
    renderContacts();
}

function isDuplicateContact(contacts, phone, email) {
    const normalizedPhone = phone.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    return contacts.some((contact) => {
        return (
            contact.phone.trim().toLowerCase() === normalizedPhone ||
            contact.email.trim().toLowerCase() === normalizedEmail
        );
    });
}

function getAvatarOrFallback(avatarUrl) {
    if (avatarUrl && avatarUrl.trim() !== "") {
        return avatarUrl.trim();
    }
    return "https://via.placeholder.com/56?text=U";
}

function renderContacts() {
    const contacts = readContacts();
    contactsGrid.innerHTML = "";
    btnDeleteSelected.disabled = true;

    if (contacts.length === 0) {
        contactsGrid.innerHTML = "<p class='text-muted mb-0'>Nessun contatto salvato.</p>";
        return;
    }

    contacts.forEach((contact, index) => {
        const contactKey = getContactKey(contact, index);
        const col = document.createElement("div");
        col.className = "col-12 col-md-6";

        col.innerHTML = `
            <article class="contact-card d-flex gap-3 align-items-start">
                <img class="avatar-thumb" src="${getAvatarOrFallback(contact.avatar)}" alt="Avatar di ${contact.fullName}">
                <div class="flex-grow-1">
                    <div class="form-check mb-2">
                        <input class="form-check-input contact-select" type="checkbox" value="${contactKey}" data-contact-key="${contactKey}">
                        <label class="form-check-label small text-muted">Seleziona per eliminare</label>
                    </div>
                    <h3 class="h6 mb-1">${contact.fullName}</h3>
                    <p class="mb-1"><strong>Telefono:</strong> ${contact.phone}</p>
                    <p class="mb-0"><strong>Email:</strong> ${contact.email}</p>
                    <button type="button" class="btn btn-sm btn-outline-danger mt-3 delete-contact-btn" data-contact-key="${contactKey}">Elimina contatto</button>
                </div>
            </article>
        `;

        contactsGrid.appendChild(col);
    });

    updateDeleteButtonState();
}

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    hideAlert();
    avatarFeedback.classList.add("d-none");

    if (!contactForm.checkValidity()) {
        contactForm.classList.add("was-validated");
        if (!getSelectedAvatar()) {
            avatarFeedback.classList.remove("d-none");
        }
        return;
    }

    const selectedAvatar = getSelectedAvatar();

    if (!selectedAvatar) {
        avatarFeedback.classList.remove("d-none");
        showAlert("Seleziona un avatar UI Faces prima di salvare.", "warning");
        return;
    }

    const contacts = readContacts();
    const newContact = {
        id: crypto.randomUUID(),
        fullName: fullNameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        avatar: selectedAvatar
    };

    if (isDuplicateContact(contacts, newContact.phone, newContact.email)) {
        showAlert("Contatto già presente: telefono o email duplicati.", "warning");
        return;
    }

    contacts.push(newContact);
    writeContacts(contacts);

    showAlert("Contatto salvato correttamente.", "success");
    contactForm.reset();
    contactForm.classList.remove("was-validated");
    avatarFeedback.classList.add("d-none");
});

btnShowContacts.addEventListener("click", () => {
    hideAlert();
    showListSection();
});

btnShowForm.addEventListener("click", () => {
    hideAlert();
    showFormSection();
});

contactsGrid.addEventListener("change", (event) => {
    if (event.target.classList.contains("contact-select")) {
        updateDeleteButtonState();
    }
});

contactsGrid.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".delete-contact-btn");
    if (!deleteButton) {
        return;
    }

    deleteSingleContact(deleteButton.dataset.contactKey);
});

btnDeleteSelected.addEventListener("click", deleteSelectedContacts);

renderAvatarPicker();
