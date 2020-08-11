import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Socket} from "ngx-socket-io";
import {ToastController} from "@ionic/angular";
import {MaxLength, validate} from "class-validator";
import {Trim} from "class-sanitizer";

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit, OnDestroy {

  messages = [];

  @MaxLength(20, {message: '닉네임이 너무 깁니다.'})
  @Trim()
  nickname = '';

  @MaxLength(50, {message: '메시지가 너무 깁니다.'})
  @Trim()
  message = '';

  constructor(
    private route: ActivatedRoute,
    private socket: Socket,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.nickname = params.nickname;
    });

    this.socket.on('message', message => this.messages.push(message));

    this.socket.on('users-changed', (data) => {
      const user = data['user'];
      if (data['event'] === 'left') {
        this.showToast(`${user}님이 나가셨습니다.`);
      } else {
        this.showToast(`${user}님이 참가했습니다.`);
      }
    });
  }

  sendMessage() {
    this.socket.emit('add-message', {text: this.message});
    this.message = '';
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }

  async showToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

}
