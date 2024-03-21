import {MessageRepository} from "./MessageRepository";

export class ViewTimelineUseCase {
    constructor(
        private messageRepository: MessageRepository,
    ) {}

    async handle(userId: string) {
        const messages = await this.messageRepository.getByUser(userId)
        messages.sort((a, b) => {
            return b.date.getTime() - a.date.getTime()
        })


        return messages
    }
}