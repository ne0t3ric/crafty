import {EditMessageCommand} from "./EditMessageCommand";
import {DateProvider} from "../../domain/DateProvider";
import {MessageRepository} from "../../domain/MessageRepository";
import {UserProvider} from "../../../user/domain/UserProvider";
import {AuthorizationError} from "../../../user/domain/AuthorizationError";
import {Message} from "../../domain/Message";

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


        const message = Message.from({
            messageId: editMessageCommand.messageId,
            userId: this.userProvider.getUser().id,
            text: editMessageCommand.text,
            date: this.dateProvider.getDate().toString()
        })

        await this.messageRepository.update(message)
    }
}