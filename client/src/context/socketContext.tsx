import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "../hooks/hook";

// Define a TypeScript interface for the SocketContext
interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

// Create context with default values
const SocketContext = createContext<SocketContextType | any>(undefined);

// Define the type for the provider props
interface SocketProviderProps {
  children: ReactNode;
}

// SocketProvider component
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const user = useAppSelector((state) => state.user.user);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://localhost:3000", {
      auth: {
        id: user?._id,
      },
      withCredentials: true,
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected!");
      setConnected(true);
    });

    setSocket(newSocket);

    // Cleanup socket connection on component unmount
    return () => {
      newSocket.disconnect();
      setConnected(false);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to access socket context
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
