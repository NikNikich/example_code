import { Socket } from 'socket.io';

export class SocketService {
  constructor(private socket: Socket) {}

  async setMessages(msg: string): Promise<void> {
    this.socket.emit('message', msg);
  }
}
