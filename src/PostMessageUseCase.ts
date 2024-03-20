import {Message} from "./Message";
import {PostMessageCommand} from "./PostMessageCommand";
import {MessageRepository} from "./MessageRepository";
import {DateProvider} from "./DateProvider";
import {MessageTooLongError} from "./MessageTooLongError";

export class PostMessageUseCase {
    constructor(
        private messageRepository: MessageRepository,
        private dateProvider: DateProvider
    ) {}
    handle(postMessageCommand: PostMessageCommand) {
        if (postMessageCommand.text.length > 280) {
            throw new MessageTooLongError()
        }
        const message: Message = {
            messageId: postMessageCommand.messageId,
            userId: postMessageCommand.userId,
            text: postMessageCommand.text,
            date: this.dateProvider.getDate()
        }

        this.messageRepository.save(message)
    }
}
