import {MessageRepository} from "../../../messaging/domain/MessageRepository";
import {UserRepository} from "../../../user/domain/UserRepository";
import {DateProvider} from "../../../messaging/domain/DateProvider";
import {Timeline} from "../../../messaging/domain/Timeline";
import {Message} from "../../../messaging/domain/Message";

export class ViewWallUseCase {
    constructor(
        private messageRepository: MessageRepository,
        private userRepository: UserRepository,
        private dateProvider: DateProvider) {
    }

    async handle(userId: string): Promise<Timeline> {
        const user = await this.userRepository.getById(userId)
        const followees = user.followees
        let messages: Message[] = await this.messageRepository.getByUser(userId)
        for (const followee of followees) {
            const followeeMessages = await this.messageRepository.getByUser(followee)
            messages.push(...followeeMessages)
        }

        const timeline = new Timeline(this.dateProvider, messages)

        return timeline
    }
}