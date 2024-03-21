import {Message} from "./Message";

export interface MessageRepository {
    save(message: Message): Promise<void>
    get(messageId: string): Promise<Message>
}