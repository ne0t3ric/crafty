import {PostMessageUseCase} from "../application/use-cases/PostMessageUseCase";
import {PostMessageCommand} from "../application/use-cases/PostMessageCommand";
import {Message} from "../domain/Message";
import {ViewTimelineUseCase} from "../application/use-cases/ViewTimelineUseCase";
import {Timeline, TimelineElement} from "../domain/Timeline";
import {EditMessageCommand} from "../application/use-cases/EditMessageCommand";
import {EditMessageUserCase} from "../application/use-cases/EditMessageUserCase";
import {UserProvider} from "../../user/domain/UserProvider";
import {StaticUserProvider} from "../../user/infrastructure/StaticUserProvider";
import {MessageRepository} from "../domain/MessageRepository";
import {DateProvider} from "../domain/DateProvider";

export type MessageFixture = ReturnType<typeof createMessageFixture>

export function createMessageFixture(
    messageRepository: MessageRepository,
    dateProvider: DateProvider
) {
    const userProvider: UserProvider = new StaticUserProvider()
    let timeline: Timeline
    let thrownError: Error

    return {
        givenMessages: async (messages: Message[]) => {
            for (const message of messages) {
                await messageRepository.save(message)
            }
        },
        givenUserIs: (userId: string) => {
            userProvider.setUser({id: userId, followees: []})
        },
        givenNowIs: (date: Date) => {
            dateProvider.setDate(date)
        },
        whenUserSeeTheTimelineOf: async (user: string) => {
            const viewTimelineUseCase = new ViewTimelineUseCase(
                messageRepository,
                dateProvider
            )

            timeline = await viewTimelineUseCase.handle(user)
        },
        whenUserPostsMessage: async (postMessageCommand: PostMessageCommand) => {
            const postMessageUseCase = new PostMessageUseCase(
                messageRepository,
                dateProvider,
                userProvider
            )
            try {
                await postMessageUseCase.handle(postMessageCommand)
            } catch (error) {
                thrownError = error
            }
        },
        whenUserEditMessage: async (editMessageCommand: EditMessageCommand) => {
            const editMessageUserCase = new EditMessageUserCase(
                messageRepository,
                dateProvider,
                userProvider
            )

            try {
                await editMessageUserCase.handle(editMessageCommand)
            } catch (error) {
                thrownError = error
            }
        },
        thenMessageShouldBe: async (expectedMessage: Message) => {
            const message = await messageRepository.get(expectedMessage.messageId)
            expect(expectedMessage).toEqual(message)
        },
        thenErrorShouldBeThrown: (classError: new () => Error) => {
            expect(thrownError).toBeInstanceOf(classError)
        },
        thenUserShouldSeeTimeline: (expectedTimelineElements: TimelineElement[]) => {
            expectedTimelineElements.forEach((timelineElement, index) => {
                expect(timelineElement).toEqual(timeline.elements[index])
            })
        }
    }
}