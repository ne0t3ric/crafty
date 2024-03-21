import {LocalMessageRepository} from "../LocalMessageRepository";
import {LocalDateProvider} from "../LocalDateProvider";
import {PostMessageUseCase} from "../PostMessageUseCase";
import {PostMessageCommand} from "../PostMessageCommand";
import {Message} from "../Message";
import {ViewTimelineUseCase} from "../ViewTimelineUseCase";
import {Timeline} from "../Timeline";
import {EditMessageCommand} from "../EditMessageCommand";
import {EditMessageUserCase} from "../EditMessageUserCase";
import {UserProvider} from "../UserProvider";
import {User} from "../User";

export type MessageFixture = ReturnType<typeof createMessageFixture>
export function createMessageFixture() {
    const messageRepository = new LocalMessageRepository()
    const dateProvider = new LocalDateProvider()
    let givenUser: User
    const userProvider: UserProvider = {
        getUser: () => {
            return givenUser
        },
        setUser: (user: User) => {
            givenUser = user
        }
    }
    let timeline: Timeline
    let thrownError: Error


    return {
        givenMessages: async (messages: Message[]) => {
            for (const message of messages){
                await messageRepository.save(message)
            }
        },
        givenUserIs: (user: User) => {
            userProvider.setUser(user)
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
                dateProvider
            )
            try {
                await postMessageUseCase.handle(postMessageCommand)
            } catch(error) {
                thrownError = error
            }
        },
        whenUserEditMessage: async(editMessageCommand: EditMessageCommand) => {
             const editMessageUserCase = new EditMessageUserCase(
                messageRepository,
                dateProvider,
                userProvider
            )

            try {
                await editMessageUserCase.handle(editMessageCommand)
            } catch(error) {
                thrownError = error
            }
        },
        thenMessageShouldBe: async  (expectedMessage: Message) => {
            const message = await messageRepository.get(expectedMessage.messageId)
            expect(expectedMessage).toEqual(message)
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