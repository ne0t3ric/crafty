import {Message} from "./Message";
import {PostMessageCommand} from "./PostMessageCommand";
import {MessageRepository} from "./MessageRepository";
import {DateProvider} from "./DateProvider";

export class PostMessageUseCase {
    constructor(
        private messageRepository: MessageRepository,
        private dateProvider: DateProvider
    ) {}
    handle(postMessageCommand: PostMessageCommand) {
        const message: Message = {
            messageId: postMessageCommand.messageId,
            userId: postMessageCommand.userId,
            text: postMessageCommand.text,
            date: this.dateProvider.getDate()
        }

        this.messageRepository.save(message)
    }
}
