const API_URL = "http://127.0.0.1:5000/api/agents";

function fetchAgents() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const agentTableBody = document.getElementById("agentTableBody");
            agentTableBody.innerHTML = "";

            // Update agent count display
            updateAgentCount(data.length);

            data.forEach(agent => {
                const row = `
                    <tr>
                        <td class="border px-4 py-2">${agent.email}</td>
                        <td class="border px-4 py-2">${agent.telephone}</td>
                        <td class="border px-4 py-2">
                            <button onclick="deleteAgent('${agent.id}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Supprimer</button>
                        </td>
                    </tr>
                `;
                agentTableBody.innerHTML += row;
            });
        })
        .catch(error => console.error("Erreur lors du chargement :", error));
}

function updateAgentCount(count) {
    let countElement = document.getElementById("agentCount");
    if (!countElement) {
        // Create it only once, inject before the table container
        countElement = document.createElement("p");
        countElement.id = "agentCount";
        countElement.className = "text-lg font-semibold mb-4 text-primary dark:text-darkPrimary";
        const container = document.querySelector(".max-w-4xl.mx-auto.mt-10");
        container.insertBefore(countElement, container.firstChild);
    }
    countElement.textContent = `Nombre d'agents ajoutés : ${count}`;
}

function addAgent(event) {
    event.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const email = document.getElementById("email").value.trim();
    const telephone = document.getElementById("telephone").value.trim();

    if (!nom || !prenom || !email || !telephone) {
        alert("Remplis tous les champs.");
        return;
    }

    const newAgent = { nom, prenom, email, telephone };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAgent)
    })
    .then(response => {
        if (!response.ok) throw new Error("Erreur ajout agent.");
        return response.json();
    })
    .then(() => {
        document.getElementById("agentForm").reset();
        fetchAgents();
    })
    .catch(error => console.error("Erreur :", error));
}

function deleteAgent(id) {
    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) throw new Error("Erreur suppression.");
        return response.json();
    })
    .then(() => fetchAgents())
    .catch(error => console.error("Erreur :", error));
}

document.addEventListener("DOMContentLoaded", fetchAgents);
