import { createContext } from "preact";
import { io } from "socket.io-client";

export const SocketContext = createContext<ReturnType<typeof io>>(io());
