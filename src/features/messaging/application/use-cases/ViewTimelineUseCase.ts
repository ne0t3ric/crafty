import {MessageRepository} from "../../domain/MessageRepository";
import {Timeline} from "../../domain/Timeline";
import {DateProvider} from "../../domain/DateProvider";

export class ViewTimelineUseCase {
    constructor(
        private messageRepository: MessageRepository,
        private dateProvider: DateProvider,
    ) {}

    async handle(userId: string): Promise<Timeline> {
        const messages = await this.messageRepository.getByUser(userId)
        messages.sort((a, b) => {
            return b.isOlder(a) ? -1 : 1
        })

        const timeline = new Timeline(this.dateProvider, messages)

        return timeline
    }
}