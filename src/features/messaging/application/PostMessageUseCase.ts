import {Message} from "../domain/Message";
import {PostMessageCommand} from "./PostMessageCommand";
import {MessageRepository} from "../domain/MessageRepository";
import {DateProvider} from "../domain/DateProvider";
import {MessageText} from "../domain/MessageText";
import {UserProvider} from "../../user/domain/UserProvider";

export class PostMessageUseCase {
    constructor(
        private messageRepository: MessageRepository,
        private dateProvider: DateProvider,
        private userProvider: UserProvider
    ) {}
    async handle(postMessageCommand: PostMessageCommand) {
        const messageText = MessageText.of(postMessageCommand.text)

        const message: Message = {
            messageId: postMessageCommand.messageId,
            userId: this.userProvider.getUser().id,
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
