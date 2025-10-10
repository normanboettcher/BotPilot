import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    console.log('🔌 Creating new socket instance');
    socket = io('http://localhost:5005', { transports: ['websocket'] });
  }
  return socket;
};
