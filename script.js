const API_URL = "https://lpseudo-terrar-ia.hf.space/chat";

const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const container = document.getElementById('chat-container');

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // 1. Deshabilitar controles
    setLoading(true);

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
    } finally {
        // 2. Reestablecer controles al terminar (sea éxito o error)
        setLoading(false);
        container.scrollTop = container.scrollHeight;
        userInput.focus(); // Devolver el foco al input para seguir escribiendo
    }
}

// Función para bloquear/desbloquear la interfaz
function setLoading(isLoading) {
    if (isLoading) {
        userInput.disabled = true;
        sendButton.disabled = true;
        sendButton.innerText = "Wait...";
        sendButton.classList.add('opacity-50', 'cursor-not-allowed');
        userInput.classList.add('bg-gray-800');
    } else {
        userInput.disabled = false;
        sendButton.disabled = false;
        sendButton.innerText = "Enviar";
        sendButton.classList.remove('opacity-50', 'cursor-not-allowed');
        userInput.classList.remove('bg-gray-800');
    }
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
    if (e.key === 'Enter' && !userInput.disabled) sendMessage();
});