// La URL se inyectará mediante GitHub Actions por seguridad
const API_URL = "API_URL_PLACEHOLDER";

const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const container = document.getElementById('chat-container');

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Mostrar mensaje del usuario
    appendMessage("Tú", message, "bg-blue-900 ml-auto");
    userInput.value = "";

    // Mostrar estado "Escribiendo..."
    const typingId = "typing-" + Date.now();
    appendMessage("Guía", "Escribiendo...", "bg-gray-800", typingId);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) throw new Error("Error en la respuesta");

        const data = await response.json();
        
        // Reemplazar "Escribiendo..." con la respuesta real
        document.getElementById(typingId).innerHTML = `<strong>Guía:</strong> <br> ${data.response}`;
    } catch (error) {
        document.getElementById(typingId).innerText = "Error: No se pudo conectar con la API.";
        console.error(error);
    }
    
    container.scrollTop = container.scrollHeight;
}

function appendMessage(sender, text, bgColor, id = "") {
    const div = document.createElement('div');
    div.className = `${bgColor} p-3 rounded-lg max-w-[80%] message-fade`;
    if (id) div.id = id;
    
    div.innerHTML = `<strong>${sender}:</strong> <br> ${text}`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// Eventos
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});