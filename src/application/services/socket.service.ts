import { Socket } from 'socket.io';
import { WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { SocketClientActionEnum } from '../../infrastructure/transport/const/socket.client.action.enum';

@WebSocketGateway()
export class SocketService {
  private static logger = new Logger('SocketManager');
  private static sockets: Socket[] = [];

  public sendMessages(payload: string): void {
    const userSockets: Socket[] | undefined = SocketService.sockets;

    if (userSockets) {
      for (const socket of userSockets) {
        socket.emit(SocketClientActionEnum.ALARM, payload);
      }
    }
  }

  public static handleDisconnect(client: Socket): void {
    const socketId: number | undefined = SocketService.sockets.findIndex(
      socket => socket === client,
    );
    if (socketId) {
      SocketService.sockets.splice(socketId, 1);
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  public static handleConnection(client: Socket): void {
    if (!SocketService.sockets.find(socket => socket === client)) {
      SocketService.sockets.push(client);
    }
    this.logger.log(`Client connected: ${client.id}`);
  }
}
