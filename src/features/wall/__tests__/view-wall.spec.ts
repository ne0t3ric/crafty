import {Message} from "../../messaging/domain/Message";
import {createMessageFixture, MessageFixture} from "../../messaging/__tests__/message.fixture";
import {createUserFixture, UserFixture} from "../../user/__tests__/user.fixture";
import {Timeline, TimelineElement} from "../../messaging/domain/Timeline";
import {MessageRepository} from "../../messaging/domain/MessageRepository";
import {UserRepository} from "../../user/domain/UserRepository";
import {DateProvider} from "../../messaging/domain/DateProvider";
import {LocalMessageRepository} from "../../messaging/infrastructure/LocalMessageRepository";
import {LocalUserRepository} from "../../user/infrastructure/LocalUserRepository";
import {LocalDateProvider} from "../../messaging/infrastructure/LocalDateProvider";

let fixture: ReturnType<typeof createFixture>
let messageFixture: MessageFixture
let userFixture: UserFixture
beforeEach(() => {
    const messageRepository = new LocalMessageRepository()
    const userRepository = new LocalUserRepository()
    const dateProvider = new LocalDateProvider()

    fixture = createFixture(messageRepository, userRepository, dateProvider)
    messageFixture = createMessageFixture(messageRepository, dateProvider)
    userFixture = createUserFixture(userRepository)
})
describe('Feature: View wall', () => {
    describe('Rule: Alice can view her wall', () => {
        test('Alice can view messages on her wall by reverse chronological order', async () => {
            await userFixture.givenUsers(['Alice', 'Bob', 'Charlie'])
            await messageFixture.givenMessages([
                Message.from({
                    messageId: 'message1',
                    userId: 'Alice',
                    text: 'I love the weather today',
                    date: '2024-03-20T10:00:00Z'
                }),
                Message.from({
                    messageId: 'message2',
                    userId: 'Bob',
                    text: 'Sunny day',
                    date: '2024-03-20T09:00:00Z'
                }),
                Message.from({
                    messageId: 'message3',
                    userId: 'Charlie',
                    text: 'So rainy right now in Chicago',
                    date: '2024-03-20T08:00:00Z'
                })
            ])
            await userFixture.givenUserFollowees({
                user: 'Alice',
                followees: ['Charlie']
            })
            messageFixture.givenNowIs(new Date('2024-03-20T10:00:00Z'))

            await fixture.whenViewWall({
                user: 'Alice'
            })

            await fixture.thenWallShouldDisplayTimeline([
                {
                    userId: 'Alice',
                    text: 'I love the weather today',
                    publicationTime: 'less than a minute ago'
                },
                {
                    userId: 'Charlie',
                    text: 'So rainy right now in Chicago',
                    publicationTime: 'hours ago'
                }
            ])
        })
    })
})

class ViewWallUseCase {
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

function createFixture(
    messageRepository: MessageRepository,
    userRepository: UserRepository,
    dateProvider: DateProvider
) {
    let timeline: Timeline

    const viewWallUseCase = new ViewWallUseCase(
        messageRepository,
        userRepository,
        dateProvider
    )
    return {

        givenMessages: async (messages: Message[]) => {
            for (const message of messages) {
                await messageRepository.save(message)
            }
        },
        whenViewWall: async ({user}: { user: string }) => {
            timeline = await viewWallUseCase.handle(user)
        },
        thenWallShouldDisplayTimeline: async (expectedTimelineElements: TimelineElement[]) => {
            expectedTimelineElements.forEach((timelineElement, index) => {
                expect(timelineElement).toEqual(timeline.elements[index])
            })
        }
    }
}