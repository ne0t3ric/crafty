import {Message} from "../Message";
import {LocalMessageRepository} from "../LocalMessageRepository";
import {MessageRepository} from "../MessageRepository";
import {ViewTimelineUseCase} from "../ViewTimelineUseCase";
import {Timeline} from "../Timeline";
import {DateProvider} from "../DateProvider";
import {LocalDateProvider} from "../LocalDateProvider";

let fixture: Fixture

beforeEach(() => {
    fixture = createFixture()
})

describe('Feature: Viewing a personal timeline', () => {
    describe('Rule: Messages of a user are shown in reverse order by date', () => {
        test('Alice can view her two messages on her timeline', async () => {
            await fixture.givenMessages([
                {
                // from Alive
                    messageId: 'message-1',
                    userId: 'Alice',
                    text: 'Hello World',
                    date: new Date('2024-03-20T10:00:00Z')
                },
                // from Bob
                {
                    messageId: 'message-2',
                    userId: 'Bob',
                    text: 'I am bob',
                    date: new Date('2024-03-20T10:01:00Z')
                },
                // from Alive
                {
                    messageId: 'message-3',
                    userId: 'Alice',
                    text: 'Wassup',
                    date: new Date('2024-03-20T12:00:00Z')
                }
            ])

            await fixture.whenUserSeeTheTimelineOf('Alice')

            fixture.thenUserShouldSeeTimeline([
                {
                    userId: 'Alice',
                    text: 'Wassup',
                    publicationTime: 'less than a minute ago'
                },
                {
                    userId: 'Alice',
                    text: 'Hello World',
                    publicationTime: 'hours ago'
                }
            ])
        })
    })
});

function createFixture(){
    const messageRepository: MessageRepository = new LocalMessageRepository()
    const dateProvider: DateProvider = new LocalDateProvider()
    const viewTimelineUseCase = new ViewTimelineUseCase(
        messageRepository,
        dateProvider
    )
    let timeline: Timeline
    return {
        givenMessages: async (messages: Message[]) => {
            for (const message of messages){
                await messageRepository.save(message)
            }
        },
        whenUserSeeTheTimelineOf: async (user: string) => {
            timeline = await viewTimelineUseCase.handle(user)
        },
        thenUserShouldSeeTimeline: (timeline: Timeline) => {
            timeline.forEach((timelineElement, index) => {
              expect(timelineElement).toEqual(timeline[index])
            })
        }
    }
}

type Fixture = ReturnType<typeof createFixture>