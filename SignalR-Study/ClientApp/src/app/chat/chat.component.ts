import { Component, OnInit, NgZone, OnDestroy, Input, HostListener } from '@angular/core';
import { Message } from '../models/message';
import { ChatService } from '../services/chat.service';
import { Subscription } from 'rxjs';
import { ChatUser } from '../models/chatUser';
import { ToastrService } from 'ngx-toastr';

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
  mentions: ChatUser[] = [];

  messagesSubscription: Subscription;
  usersSubscripiton: Subscription;

  public recepient: ChatUser;

  constructor(private chatService: ChatService, private ngZone: NgZone, private toastr: ToastrService) {
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
      type: 'system',
      mentions: []
    };
    this.chatService.removeUser();
    this.chatService.sendMessage(message, []);
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
      mentions: this.mentions
    };

    this.messageText = '';
    this.chatService.sendMessage(message, this.mentions);
    this.mentions = [];
  }

  addMention(user: ChatUser) {
    const mention = this.mentions.find(x => x.connectionId === user.connectionId);
    if (mention) {
      return;
    }
    this.mentions.push(user);
  }

  removeMention(connectionId: string) {
    const index = this.mentions.findIndex(x => x.connectionId === connectionId);
    if (index === -1) {
      return;
    }
    this.mentions.splice(index, 1);
  }

  private receiveMessages() {
    this.messagesSubscription = this.chatService.messageReceived.subscribe((message: Message) => {
      console.log(message);
      this.ngZone.run(() => {
        if (message.clientUniqueId !== this.uniqueId && message.type !== 'system') {
          message.type = 'received';
        }
        this.messages.push(message);
        const mention = message.mentions.find(x => x.connectionId === this.uniqueId);
        if (mention) {
          this.toastr.info(message.text, `${message.userName} mentioned you`);
        }
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
