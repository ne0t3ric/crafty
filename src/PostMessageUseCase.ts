import {Message} from "./Message";
import {PostMessageCommand} from "./PostMessageCommand";

export class PostMessageUseCase {
    constructor(
        private saveMessage: (message: Message) => void,
        private getDate: () => Date
    ) {}
    handle(postMessageCommand: PostMessageCommand) {
        const message: Message = {
            messageId: postMessageCommand.messageId,
            userId: postMessageCommand.userId,
            text: postMessageCommand.text,
            date: this.getDate()
        }
        this.saveMessage(message)
    }
}
