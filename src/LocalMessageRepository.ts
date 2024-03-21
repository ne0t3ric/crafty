import {MessageRepository} from "./MessageRepository";
import {Message} from "./Message";

export class LocalMessageRepository implements MessageRepository {
    public messages: Message[] = []
    async save(msg: Message): Promise<void> {
        // check if message already exists
        const found = this.messages.find((message: Message) => message.messageId === msg.messageId)
        if (found) {
            // update

        }
        this.messages.push(msg)
    }

    async update(newMessage: Pick<Message, 'messageId'> & Partial<Message>): Promise<void> {
        const existingMessage = await this.get(newMessage.messageId)

        const index = this.messages.indexOf(existingMessage)
        this.messages[index] = {
            ...existingMessage,
            ...newMessage
        }
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