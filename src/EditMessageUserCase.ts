import {EditMessageCommand} from "./EditMessageCommand";
import {DateProvider} from "./DateProvider";
import {MessageRepository} from "./MessageRepository";
import {UserProvider} from "./UserProvider";
import {AuthorizationError} from "./AuthorizationError";
import {MessageText} from "./MessageText";

export class EditMessageUserCase {
    constructor(
        private messageRepository: MessageRepository,
        private dateProvider: DateProvider,
        private userProvider: UserProvider
    ) {
    }
    async handle(editMessageCommand: EditMessageCommand) {
        const existingMessage = await this.messageRepository.get(editMessageCommand.messageId)
        if (existingMessage.userId !== this.userProvider.getUser().id) {
            throw new AuthorizationError('You are not allowed to edit this message')
        }

        const messageText = MessageText.of(editMessageCommand.text)

        const message = {
            messageId: editMessageCommand.messageId,
            text: messageText,
            date: this.dateProvider.getDate()
        }

        await this.messageRepository.update(message)
    }
}