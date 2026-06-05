// Mantener la URL o usar el placeholder para el Action
const API_URL = "https://lpseudo-terrar-ia.hf.space/chat";

const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const container = document.getElementById('chat-container');

// VARIABLE DE CONTROL: Evita múltiples ejecuciones
let isProcessing = false;

async function sendMessage() {
    const message = userInput.value.trim();
    
    // Si ya estamos procesando O el mensaje está vacío, no hacer nada
    if (isProcessing || !message) return;

    // 1. Bloquear inmediatamente
    isProcessing = true;
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
        // 2. Liberar el control
        isProcessing = false;
        setLoading(false);
        container.scrollTop = container.scrollHeight;
        userInput.focus(); 
    }
}

function setLoading(isLoading) {
    if (isLoading) {
        userInput.disabled = true;
        sendButton.disabled = true;
        sendButton.innerText = "...";
        // Añadimos pointer-events: none para asegurar que no se pueda clickear
        sendButton.style.pointerEvents = "none"; 
        userInput.classList.add('opacity-50', 'bg-gray-800');
    } else {
        userInput.disabled = false;
        sendButton.disabled = false;
        sendButton.innerText = "Enviar";
        sendButton.style.pointerEvents = "auto";
        userInput.classList.remove('opacity-50', 'bg-gray-800');
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
sendButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevenir cualquier comportamiento por defecto
    sendMessage();
});

userInput.addEventListener('keydown', (e) => {
    // Usamos keydown que es más rápido que keypress
    if (e.key === 'Enter') {
        if (isProcessing) {
            e.preventDefault(); // Evita que se escriba el salto de línea si está bloqueado
        } else {
            sendMessage();
        }
    }
});