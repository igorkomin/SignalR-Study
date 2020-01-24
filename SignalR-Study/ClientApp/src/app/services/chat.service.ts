import { Injectable, EventEmitter } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Message } from '../models/message';
import { ChatUser } from '../models/chatUser';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  connectionEstablished = new EventEmitter<Boolean>();
  messageReceived = new EventEmitter<Message>();
  userAdded = new EventEmitter<ChatUser[]>();

  public isConnectionEstablished = false;
  public connectionId = '';
  private hubConnection: HubConnection;

  constructor() {
  }

  sendMessage(message: Message) {
    this.hubConnection.invoke('SendMessage', message);
  }

  sendSystemMessage(message: Message) {
    this.hubConnection.invoke('SendSystemMessage', message);
  }

  addUser(name: string) {
    this.hubConnection.invoke('AddUser', name);
  }

  removeUser() {
    this.hubConnection.invoke('RemoveUser');
  }

  public createConnection(userName: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${window.location.href}MessageHub`)
      .build();
      this.registerServerEvents();
      this.startConnection(userName);
  }

  private startConnection(userName: string) {
    this.hubConnection
      .start()
      .then(() => {
        this.isConnectionEstablished = true;
        console.log('Hub connection started');
        this.connectionEstablished.emit(true);
        const message: Message = {
          date: new Date(),
          text: `${userName} has joined this conversation`,
          type: 'system'
        };
        this.sendSystemMessage(message);
        this.getConnectionId();
        this.addUser(userName);
      })
      .catch(error => {
        console.log(`Error while establishing connection: ${error}`);
        console.log('Retrying...');
        setTimeout(() => {
          this.startConnection(userName);
        }, 5000);
      });
  }

  private getConnectionId() {
    this.hubConnection.invoke('GetConnectionId')
      .then((connectionId) => {
        this.connectionId = connectionId;
      });
  }

  public stopConnection() {
    if (!this.isConnectionEstablished) {
      return;
    }
    this.hubConnection.stop();
  }

  private registerServerEvents() {
    this.hubConnection.on('MessageReceived', message => {
      this.messageReceived.emit(message);
    });
    this.hubConnection.on('UserListChanged', users => {
      this.userAdded.emit(users);
    });
  }
}
