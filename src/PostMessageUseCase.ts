import {Message} from "./Message";
import {PostMessageCommand} from "./PostMessageCommand";
import {MessageRepository} from "./MessageRepository";
import {DateProvider} from "./DateProvider";
import {MessageTooLongError} from "./MessageTooLongError";
import {EmptyMessageError} from "./EmptyMessageError";

export class PostMessageUseCase {
    constructor(
        private messageRepository: MessageRepository,
        private dateProvider: DateProvider
    ) {}
    async handle(postMessageCommand: PostMessageCommand) {
        if (postMessageCommand.text.length > 280) {
            throw new MessageTooLongError()
        }

        if (postMessageCommand.text.length === 0) {
            throw new EmptyMessageError()
        }
        const message: Message = {
            messageId: postMessageCommand.messageId,
            userId: postMessageCommand.userId,
            text: postMessageCommand.text,
            date: this.dateProvider.getDate()
        }

        try {
            await this.messageRepository.save(message)
        } catch(error) {
            console.error(error)
        }
    }
}
