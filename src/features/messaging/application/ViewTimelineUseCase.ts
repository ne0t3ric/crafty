import {MessageRepository} from "../domain/MessageRepository";
import {Timeline} from "../domain/Timeline";
import {DateProvider} from "../domain/DateProvider";

export const ONE_MINUTE_IN_MS = 60000
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

        return messages.map(message => {
            let publicationTime = 'hours ago'
            let referenceDate = this.dateProvider.getDate()

            const difference = referenceDate.getTime() - new Date(message.date).getTime()
            if (difference < ONE_MINUTE_IN_MS) {
                publicationTime = 'less than a minute ago'
            }
            return {
                userId: message.userId,
                text: message.text,
                publicationTime
            }
        })
    }
}