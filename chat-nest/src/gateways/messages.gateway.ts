import {OnGatewayDisconnect, SubscribeMessage, WebSocketGateway} from '@nestjs/websockets';
import {Socket} from "socket.io";

// 모든 함수는 클라이언트가 서버에 연결된 후에만 이벤트를 수신하는 게이트웨이 클래스에 wrapping 될 수 있도록 한다.
// 클라이언트가 이벤트를 보내면 서버가 작업을 하는 순서

@WebSocketGateway()
export class MessagesGateway implements OnGatewayDisconnect{

  nicknames: Map<string, string> = new Map();

  // 연결 해제를 위한 이벤트 처리 기능 설정
  handleDisconnect(client: Socket) {
    client.server.emit('users-changed', {user: this.nicknames[client.id], event: 'left'});
    this.nicknames.delete(client.id);
  }

  // 이벤트에 대한 Subscriber 설정, (채팅에 참여할 유저)
  @SubscribeMessage('set-nickname')
  setNickname(client: Socket, nickname: string) {
    this.nicknames[client.id] = nickname;

    // client.server.emit ==> 모든 클라이언트의 값을 브로드캐스팅 하는 역할
    client.server.emit('users-changed', {user: nickname, event: 'joined'});
  }

  // 메시지 추가 이벤트에 대한 Subscriber 설정
  @SubscribeMessage('add-message')
  addMessage(client: Socket, message) {
    client.server.emit('message', {text: message.text, from: this.nicknames[client.id], created: new Date()});
  }
}
