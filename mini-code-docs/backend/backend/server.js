const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Store documents in memory
const documents = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Old feature: broadcast code changes
  socket.on("code-change", (data) => {
    socket.broadcast.emit("code-change", data);
  });

  // New feature: join a document room
  socket.on("joinDoc", (docId) => {
    socket.join(docId);

    if (!documents[docId]) {
      documents[docId] = "";
    }

    // Send current content to the new user
    socket.emit("loadDoc", documents[docId]);
  });

  // New feature: handle edits in a document
  socket.on("editDoc", ({ docId, content }) => {
    documents[docId] = content;
    socket.to(docId).emit("updateDoc", content);
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));


















