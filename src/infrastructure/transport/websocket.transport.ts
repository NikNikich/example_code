import { INestApplication, Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { SocketService } from '../../application/services/socket.service';

@Injectable()
export class WebsocketTransport {
  private logger = new Logger('WebsocketTransport');
  private socketIOServer: Server;

  public async listen(app: INestApplication): Promise<void> {
    this.socketIOServer = new Server(app.getHttpServer());

    try {
      this.socketIOServer.on('connection', async socket => {
        this.logger.log('Some user connected');
        SocketService.handleConnection(socket);
        socket.on('disconnect', () => {
          SocketService.handleDisconnect(socket);
        });
      });
    } catch (e) {
      this.logger.log(e);
    }
  }

  public async SayToAll(event: string, message: string): Promise<void> {
    this.socketIOServer.emit(event, message);
  }
}
