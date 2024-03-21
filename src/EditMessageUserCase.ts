import {EditMessageCommand} from "./EditMessageCommand";
import {DateProvider} from "./DateProvider";
import {MessageRepository} from "./MessageRepository";
import {UserProvider} from "./UserProvider";
import {MessageTooLongError} from "./MessageTooLongError";
import {EmptyMessageError} from "./EmptyMessageError";
import {AuthorizationError} from "./AuthorizationError";

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

        if (editMessageCommand.text.length > 280) {
            throw new MessageTooLongError()
        }

        if (editMessageCommand.text.length === 0) {
            throw new EmptyMessageError()
        }

        const message = {
            messageId: editMessageCommand.messageId,
            text: editMessageCommand.text,
            date: this.dateProvider.getDate()
        }

        await this.messageRepository.update(message)
    }
}