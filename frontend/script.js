const socket = io("http://localhost:5000");

// Get docId from URL (from Share link)
const urlParams = new URLSearchParams(window.location.search);
const docId = urlParams.get("doc") || "default";

// Join the document room
socket.emit("joinDoc", docId);

const editor = document.getElementById("editor");

// Load existing content when joining
socket.on("loadDoc", (content) => {
  editor.value = content;
});

// Send edits to server whenever you type
editor.addEventListener("input", () => {
  socket.emit("editDoc", { docId, content: editor.value });
});

// Receive updates from other users in real time
socket.on("updateDoc", (content) => {
  editor.value = content;
});

// --- Optional: keep old code-change support if needed ---
editor.addEventListener("keyup", () => {
  socket.emit("code-change", editor.value);
});

socket.on("code-change", (data) => {
  editor.value = data;
});























