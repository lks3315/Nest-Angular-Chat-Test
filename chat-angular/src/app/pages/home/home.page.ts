import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {Socket} from "ngx-socket-io";
import {MaxLength} from "class-validator";
import {Trim} from "class-sanitizer";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @MaxLength(20, {message: '닉네임이 너무 깁니다.'})
  @Trim()
  nickname: string = '';

  constructor(
    private router: Router, private socket: Socket
  ) {}

  joinChat() {
    this.socket.connect();
    this.socket.emit('set-nickname', this.nickname);
    this.router.navigateByUrl(`chat-room/${this.nickname}`);
  }
}
