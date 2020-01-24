import { Component, OnInit, NgZone, OnDestroy, Input, HostListener } from '@angular/core';
import { Message } from '../models/message';
import { ChatService } from '../services/chat.service';
import { Subscription } from 'rxjs';
import { ChatUser } from '../models/chatUser';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  @Input() userName = '';
  messageText = '';
  date: string = new Date().getTime().toString();
  uniqueId: string;
  messages: Message[] = [];
  users: ChatUser[] = [];

  messagesSubscription: Subscription;
  usersSubscripiton: Subscription;

  constructor(private chatService: ChatService, private ngZone: NgZone) {
    this.receiveMessages();
    this.receiveUserList();
    this.uniqueId = this.chatService.connectionId;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.chatService.isConnectionEstablished) {
      this.chatService.stopConnection();
    }
    this.messagesSubscription.unsubscribe();
    this.usersSubscripiton.unsubscribe();
  }

  @HostListener('window:beforeunload', ['$event'])
  sendUserLeftMessage() {
    const message: Message = {
      date: new Date(),
      text: `${this.userName} has left this conversation`,
      type: 'system'
    };
    this.chatService.removeUser();
    this.chatService.sendMessage(message);
  }

  sendMessage() {
    if (!this.messageText) {
      return;
    }

    const message: Message = {
      clientUniqueId: this.uniqueId,
      userName: this.userName,
      type: 'sent',
      text: this.messageText,
      date: new Date(),
    };
    //this.uniqueId = uniqueId;
    this.messageText = '';
    this.chatService.sendMessage(message);
  }

  private receiveMessages() {
    this.messagesSubscription = this.chatService.messageReceived.subscribe((message: Message) => {
      this.ngZone.run(() => {
        if (message.clientUniqueId !== this.uniqueId && message.type !== 'system') {
          message.type = 'received';
        }
        this.messages.push(message);
      });
    });
  }

  private receiveUserList() {
    this.usersSubscripiton = this.chatService.userAdded.subscribe((users: ChatUser[]) => {
      this.ngZone.run(() => {
        this.uniqueId = this.chatService.connectionId;
        this.users = users;
      });
    });
  }
}
