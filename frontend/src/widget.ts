import type {BotResponse} from "./types.ts";

const createChatWidget = () => {
    const button = document.createElement('button');
    const container = document.createElement('div');
    const chatBox = document.createElement('div');
    const input = document.createElement('input');
    const sendBtn = document.createElement('button');
    const response = document.createElement('div');

    // Styles und IDs
    button.id = 'chatbot-toggle';
    button.innerText = '💬';

    container.id = 'chatbot-container';
    chatBox.id = 'chatbox';
    input.placeholder = 'Frage eingeben...';
    input.id = 'chatbot-input';
    sendBtn.innerText = '➤';
    sendBtn.id = 'chatbot-send';
    response.id = 'chatbot-response';

    chatBox.appendChild(input);
    chatBox.appendChild(sendBtn);
    chatBox.appendChild(response);
    container.appendChild(button);
    container.appendChild(chatBox);
    document.body.appendChild(container);

    // Anzeige-Logik
    button.onclick = () => {
        chatBox.classList.toggle('visible');
    };

    // Anfrage senden
    sendBtn.onclick = async () => {
        const frage = input.value;
        if (!frage) return;

        const res = await fetch(`http://localhost:8000/chat?q=${encodeURIComponent(frage)}`);
        const data = await res.json() as BotResponse;
        response.innerText = data.response;
    };
};

window.addEventListener('DOMContentLoaded', createChatWidget);