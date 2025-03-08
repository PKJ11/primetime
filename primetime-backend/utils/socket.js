const socketio = require("socket.io");

let io;

const initSocket = (server) => {
    io = socketio(server, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket"],
    });
  
    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);
  
      // Handle joining a game room
      socket.on("joinGame", (gameCode) => {
        socket.join(gameCode);
        console.log(`Player joined game room: ${gameCode}`);
      });
  
      // Handle chat messages
      socket.on("sendMessage", ({ gameCode, playerName, message }) => {
        console.log(`Received message from ${playerName} in room ${gameCode}: ${message}`);
        io.to(gameCode).emit("receiveMessage", { playerName, message });
      });
  
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  };
const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { initSocket, getIO };