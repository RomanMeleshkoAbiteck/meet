import {io} from 'socket.io-client';

const options = {
  "force new connection": true,
  reconnectionAttempts: "Infinity", // avoid having user reconnect manually in order to prevent dead clients after a server restart
  timeout : 10000, // before connect_error and connect_timeout are emitted.
  transports : ["websocket"],
  withCredentials: true, // Учитывает CORS и куки
  secure: true,
}

// const socket = io('http://localhost:7002', options);
const socket = io('https://meet.pp.ua', options);

export default socket;
