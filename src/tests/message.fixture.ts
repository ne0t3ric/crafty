import {LocalMessageRepository} from "../LocalMessageRepository";
import {LocalDateProvider} from "../LocalDateProvider";
import {PostMessageUseCase} from "../PostMessageUseCase";
import {PostMessageCommand} from "../PostMessageCommand";
import {Message} from "../Message";
import {ViewTimelineUseCase} from "../ViewTimelineUseCase";
import {Timeline} from "../Timeline";

export type MessageFixture = ReturnType<typeof createMessageFixture>
export function createMessageFixture() {
    let thrownError: Error

    const messageRepository = new LocalMessageRepository()
    const dateProvider = new LocalDateProvider()
    const postMessageUseCase = new PostMessageUseCase(
        messageRepository,
        dateProvider
    )

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
        givenNowIs: (date: Date) => {
            dateProvider.setDate(date)
        },
        whenUserSeeTheTimelineOf: async (user: string) => {
            timeline = await viewTimelineUseCase.handle(user)
        },
        whenUserPostsMessage: async (postMessageCommand: PostMessageCommand) => {
            try {
                await postMessageUseCase.handle(postMessageCommand)
            } catch(error) {
                thrownError = error
            }
        },
        thenMessageShouldBePosted: async  (expectedMessage: Message) => {
            expect(expectedMessage).toEqual(await messageRepository.get(expectedMessage.messageId))
        },
        thenErrorShouldBeThrown: (classError: new () => Error)=> {
            expect(thrownError).toBeInstanceOf(classError)
        },
        thenUserShouldSeeTimeline: (expectedTimeline: Timeline) => {
            expectedTimeline.forEach((timelineElement, index) => {
                expect(timelineElement).toEqual(timeline[index])
            })
        }
    }
}