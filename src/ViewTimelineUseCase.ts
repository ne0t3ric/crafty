import {MessageRepository} from "./MessageRepository";
import {Timeline} from "./Timeline";
import {DateProvider} from "./DateProvider";

export const ONE_MINUTE_IN_MS = 60000
export class ViewTimelineUseCase {
    constructor(
        private messageRepository: MessageRepository,
        private dateProvider: DateProvider,
    ) {}

    async handle(userId: string): Promise<Timeline> {
        const messages = await this.messageRepository.getByUser(userId)
        messages.sort((a, b) => {
            return b.date.getTime() - a.date.getTime()
        })

        return messages.map(message => {
            let publicationTime = 'hours ago'
            let referenceDate = this.dateProvider.getDate()

            const difference = referenceDate.getTime() - message.date.getTime()
            if (difference < ONE_MINUTE_IN_MS) {
                publicationTime = 'less than a minute ago'
            }
            return {
                userId: message.userId,
                text: message.text.value,
                publicationTime
            }
        })
    }
}