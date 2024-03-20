import {MessageRepository} from "./MessageRepository";
import {Message} from "./Message";

export class LocalMessageRepository implements MessageRepository {
    public message: Message
    save(msg: Message): void {
        this.message = msg
    }
}