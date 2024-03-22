import {Message} from "./Message";

export interface MessageRepository {
    save(message: Message): Promise<void>
    update(message: Pick<Message, 'messageId'> & Partial<Message>): Promise<void>
    get(messageId: string): Promise<Message>
    getByUser(userId: string): Promise<Message[]>
}