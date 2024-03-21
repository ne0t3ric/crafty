import {Message} from "./Message";
import {PostMessageCommand} from "./PostMessageCommand";
import {MessageRepository} from "./MessageRepository";
import {DateProvider} from "./DateProvider";
import {MessageText} from "./MessageText";

export class PostMessageUseCase {
    constructor(
        private messageRepository: MessageRepository,
        private dateProvider: DateProvider
    ) {}
    async handle(postMessageCommand: PostMessageCommand) {
        const messageText = MessageText.of(postMessageCommand.text)

        const message: Message = {
            messageId: postMessageCommand.messageId,
            userId: postMessageCommand.userId,
            text: messageText,
            date: this.dateProvider.getDate()
        }

        try {
            await this.messageRepository.save(message)
        } catch(error) {
            console.error(error)
        }
    }
}
