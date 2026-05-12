import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Notification } from './entities/notification.entity';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/notifications' })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected via WS: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected via WS: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, userId: string) {
    client.join(userId);
    console.log(`Client ${client.id} joined room ${userId}`);
    return { event: 'joined', data: userId };
  }

  sendToUser(userId: string, notification: Notification) {
    this.server.to(userId).emit('notification', notification);
  }

  sendToAll(notification: Notification) {
    this.server.emit('notification', notification);
  }
}
