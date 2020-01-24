import { Component, OnDestroy } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public userName = '';
  public isChatVisible = false;

  constructor(private chatService: ChatService) {
  }

  showChat() {
    if (!this.userName) {
      return;
    }
    this.chatService.createConnection(this.userName);
    this.isChatVisible = true;
  }
}
