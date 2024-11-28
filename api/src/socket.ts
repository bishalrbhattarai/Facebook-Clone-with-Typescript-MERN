import { Server } from "socket.io";

const configureSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "*"], // Frontend URL
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  // Optional: Return the io instance for further usage
};

export default configureSocket;
