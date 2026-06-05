// Verifica en la consola de tu navegador si aparece este mensaje al cargar:
console.log("Script cargado - Versión 2.1 (Bloqueo Activo)");

const API_URL = "https://lpseudo-terrar-ia.hf.space/chat";

const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const container = document.getElementById('chat-container');

// NIVEL 1: Variable de control global
let isProcessing = false;

async function sendMessage() {
    const message = userInput.value.trim();
    
    // Evitar envío si está vacío o si ya hay una petición en curso
    if (!message || isProcessing) {
        console.log("Envío bloqueado: isProcessing =", isProcessing);
        return;
    }

    try {
        // ACTIVAR BLOQUEO
        isProcessing = true;
        setLoading(true);
        console.log("Procesando mensaje...");

        // Mostrar mensaje del usuario
        appendMessage("Tú", message, "bg-blue-900 ml-auto");
        userInput.value = "";

        // Mostrar estado "Escribiendo..."
        const typingId = "typing-" + Date.now();
        appendMessage("Guía", "Escribiendo...", "bg-gray-800", typingId);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) throw new Error("Error en la API");

        const data = await response.json();
        
        // Reemplazar "Escribiendo..." con la respuesta
        const typingDiv = document.getElementById(typingId);
        if (typingDiv) {
            typingDiv.innerHTML = `<strong>Guía:</strong> <br> ${data.response}`;
        }

    } catch (error) {
        console.error("Error en sendMessage:", error);
        appendMessage("Sistema", "Error: No se pudo conectar con la API.", "bg-red-900");
    } finally {
        // DESACTIVAR BLOQUEO
        isProcessing = false;
        setLoading(false);
        console.log("Bloqueo liberado.");
        
        container.scrollTop = container.scrollHeight;
        // Forzar el foco de vuelta al input después de un breve delay
        setTimeout(() => userInput.focus(), 100);
    }
}

function setLoading(isLoading) {
    if (isLoading) {
        // NIVEL 2: Atributos HTML
        userInput.disabled = true;
        sendButton.disabled = true;
        
        // NIVEL 3: Feedback Visual extremo
        sendButton.innerText = "⏳";
        sendButton.classList.replace('bg-green-600', 'bg-gray-600');
        userInput.classList.add('opacity-50', 'cursor-not-allowed');
        userInput.blur(); // Quita el cursor del input
    } else {
        userInput.disabled = false;
        sendButton.disabled = false;
        
        sendButton.innerText = "Enviar";
        sendButton.classList.replace('bg-gray-600', 'bg-green-600');
        userInput.classList.remove('opacity-50', 'cursor-not-allowed');
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

// Escuchadores de eventos mejorados
sendButton.addEventListener('click', (e) => {
    e.preventDefault();
    sendMessage();
});

userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Evita el salto de línea siempre
        if (!isProcessing) {
            sendMessage();
        }
    }
});