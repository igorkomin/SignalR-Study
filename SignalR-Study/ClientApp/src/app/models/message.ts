import { ChatUser } from './chatUser';

export class Message {
    clientUniqueId?: string;
    userName?: string;
    type: string;
    text: string;
    date: Date;
    mentions: ChatUser[];
}
