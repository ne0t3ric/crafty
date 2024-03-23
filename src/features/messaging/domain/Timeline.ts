import {Message} from "./Message";
import {DateProvider} from "./DateProvider";

export const ONE_MINUTE_IN_MS = 60000


export type TimelineElement = {
    userId: string
    text: string
    publicationTime: string
}

export class Timeline {
    elements: TimelineElement[]
    constructor(
        private dateProvider: DateProvider,
        private messages: Message[]
    ) {

       this.elements = messages.map(message => {
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
            } as TimelineElement
        })
    }
}
