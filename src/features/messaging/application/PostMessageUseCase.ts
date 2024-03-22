import {Message} from "../domain/Message";
import {PostMessageCommand} from "./PostMessageCommand";
import {MessageRepository} from "../domain/MessageRepository";
import {DateProvider} from "../domain/DateProvider";
import {UserProvider} from "../../user/domain/UserProvider";

export class PostMessageUseCase {
    constructor(
        private messageRepository: MessageRepository,
        private dateProvider: DateProvider,
        private userProvider: UserProvider
    ) {}
    async handle(postMessageCommand: PostMessageCommand) {
        const message = Message.from({
            messageId: postMessageCommand.messageId,
            userId: this.userProvider.getUser().id,
            text: postMessageCommand.text,
            date: this.dateProvider.getDate().toString()
        })

        try {
            await this.messageRepository.save(message)
        } catch(error) {
            console.error(error)
        }
    }
}
