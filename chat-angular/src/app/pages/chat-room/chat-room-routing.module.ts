import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatRoomPage } from './chat-room.page';

const routes: Routes = [
  {
    path: ':nickname', // path는 :nickname parameter 사용
    component: ChatRoomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoomPageRoutingModule {}
