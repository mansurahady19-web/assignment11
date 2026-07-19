const API_URL = "https://jsonplaceholder.typicode.com/users";

const contactForm = document.getElementById("contactForm");
const contactsList = document.getElementById("contactsList");
const searchInput = document.getElementById("search");
const formTitle = document.getElementById("formTitle");
const contactId = document.getElementById("contactId");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const cancelBtn = document.getElementById("cancelBtn");

let contacts = [];

// 1. FETCH ALL CONTACTS - GET
async function fetchContacts() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch");
    contacts = await res.json();
    displayContacts(contacts);
  } catch (err) {
    contactsList.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
}

// 2. DISPLAY CONTACTS
function displayContacts(data) {
  if (data.length === 0) {
    contactsList.innerHTML = "<p>No contacts found</p>";
    return;
  }
  contactsList.innerHTML = data.map(contact => `
    <div class="contact-card">
      <h3>${contact.name}</h3>
      <p>📧 ${contact.email}</p>
      <p>📞 ${contact.phone}</p>
      <div class="card-btns">
        <button class="edit" onclick="editContact(${contact.id})">Edit</button>
        <button class="delete" onclick="deleteContact(${contact.id})">Delete</button>
      </div>
    </div>
  `).join("");
}

// 3. ADD / UPDATE CONTACT - POST / PUT
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const contact = {
    name: nameInput.value,
    email: emailInput.value,
    phone: phoneInput.value
  };

  const id = contactId.value;

  try {
    if (id) {
      // UPDATE - PUT
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact)
      });
      alert("Contact updated!");
    } else {
      // ADD - POST
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact)
      });
      alert("Contact added!");
    }
    resetForm();
    fetchContacts();
  } catch (err) {
    alert("Error saving contact");
  }
});

// 4. EDIT CONTACT - Fill form
function editContact(id) {
  const contact = contacts.find(c => c.id === id);
  contactId.value = contact.id;
  nameInput.value = contact.name;
  emailInput.value = contact.email;
  phoneInput.value = contact.phone;
  formTitle.innerText = "Update Contact";
}

// 5. DELETE CONTACT - DELETE
async function deleteContact(id) {
  if (!confirm("Delete this contact?")) return;
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    alert("Contact deleted!");
    fetchContacts();
  } catch (err) {
    alert("Error deleting contact");
  }
}

// 6. SEARCH CONTACTS
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  const filtered = contacts.filter(c => 
    c.name.toLowerCase().includes(term) || 
    c.email.toLowerCase().includes(term) ||
    c.phone.includes(term)
  );
  displayContacts(filtered);
});

// 7. RESET FORM
function resetForm() {
  contactForm.reset();
  contactId.value = "";
  formTitle.innerText = "Add New Contact";
}

cancelBtn.addEventListener("click", resetForm);

// Load contacts on page load
fetchContacts();