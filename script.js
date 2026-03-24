const chat = document.getElementById("chat");
const typingDiv = document.getElementById("typing");
const roomSelect = document.getElementById("room");

const username = prompt("Enter your name:");
const socket = new WebSocket("ws://localhost:8000/ws");

// -------------------------
// Connection Established
// -------------------------
socket.onopen = () => {
    socket.send(JSON.stringify({
        type: "join",
        username: username,
        room: roomSelect.value
    }));
};

// -------------------------
// Receive Messages
// -------------------------
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const div = document.createElement("div");

    if (data.type === "chat") {
        div.innerHTML = "<b>" + data.username + ":</b> " + data.message;
        chat.appendChild(div);
    }

    if (data.type === "system") {
        div.classList.add("system");
        div.innerText = data.message;
        chat.appendChild(div);
    }

    if (data.type === "typing") {
        typingDiv.innerText = data.username + " is typing...";
    }

    if (data.type === "stop_typing") {
        typingDiv.innerText = "";
    }

    chat.scrollTop = chat.scrollHeight;
};

// -------------------------
// Send Message
// -------------------------
function sendMessage() {
    const msgInput = document.getElementById("msg");
    const msg = msgInput.value.trim();

    if (msg === "") return;

    socket.send(JSON.stringify({
        type: "chat",
        message: msg
    }));

    socket.send(JSON.stringify({
        type: "stop_typing"
    }));

    msgInput.value = "";
}

// -------------------------
// Typing Indicator
// -------------------------
document.getElementById("msg").addEventListener("input", () => {
    socket.send(JSON.stringify({ type: "typing" }));
});

// -------------------------
// Send on Enter key
// -------------------------
document.getElementById("msg").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});
