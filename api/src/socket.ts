import { Server } from "socket.io";

const OnlineSet = new Set();

const configureSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "*"], // Frontend URL
      methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("the connected id is" + socket.handshake.auth.id);

    OnlineSet.add(socket.handshake.auth.id);

    io.emit("joined", `The User new with ${socket.handshake.auth.id}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.handshake.auth.id}`);
      OnlineSet.delete(socket.handshake.auth.id);
    });
  });

  // Optional: Return the io instance for further usage
};

export default configureSocket;
