import { Socket } from 'socket.io';
import { WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { SocketClientActionEnum } from '../../infrastructure/transport/const/socket.client.action.enum';
import { WebsocketTransport } from '../../infrastructure/transport/websocket.transport';

@WebSocketGateway()
export class SocketService {
  constructor(private websocketTransport: WebsocketTransport) {}
  private static logger = new Logger('SocketManager');

  public async sendMessages(payload: string): Promise<void> {
    await this.websocketTransport.SayToAll(
      SocketClientActionEnum.ALARM,
      payload,
    );
  }

  public static handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  public static handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
