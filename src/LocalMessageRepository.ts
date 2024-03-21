import {MessageRepository} from "./MessageRepository";
import {Message} from "./Message";

export class LocalMessageRepository implements MessageRepository {
    public message: Message
    async save(msg: Message): Promise<void> {
        this.message = msg
    }

    async get(messageId: string): Promise<Message> {
        return this.message
    }
}