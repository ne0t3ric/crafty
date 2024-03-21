import {MessageRepository} from "./MessageRepository";
import {Message} from "./Message";

export class LocalMessageRepository implements MessageRepository {
    public messages: Message[] = []
    async save(msg: Message): Promise<void> {
        this.messages.push(msg)
    }

    async get(messageId: string): Promise<Message> {
        const found = this.messages.find((msg: Message) => msg.messageId === messageId)
        if (!found) {
            throw new Error('Message not found')
        }
        return found
    }

    async getByUser(userId: string): Promise<Message[]> {
       return this.messages.filter((msg: Message) => msg.userId === userId)
    }
}