import {PostMessageUseCase} from "../PostMessageUseCase";
import {Message} from "../Message";
import {PostMessageCommand} from "../PostMessageCommand";
import {MessageTooLongError} from "../MessageTooLongError";
import {EmptyMessageError} from "../EmptyMessageError";
import {LocalMessageRepository} from "../LocalMessageRepository";
import {LocalDateProvider} from "../LocalDateProvider";

const fixture = createFixture()
describe('Feature: Posting a message', () => {
    describe('Rule: a message can contains maximum 280 characters', () => {
        test('Alice can post a message on her timeline', () => {
            fixture.givenNowIs(new Date('2024-03-20T10:00:00Z'))
            fixture.whenUserPostsMessage({
                messageId: 'message-1',
                userId: 'Alice',
                text: 'Hello World',
            })
            fixture.thenMessageShouldBePosted({
                messageId: 'message-1',
                userId: 'Alice',
                text: 'Hello World',
                date: new Date('2024-03-20T10:00:00Z')
            })
        })

        test('Alice cannot post a message with more than 280 characters', () => {
            fixture.givenNowIs(new Date('2024-03-20T10:00:00Z'))
            fixture.whenUserPostsMessage({
                messageId: 'message-1',
                userId: 'Alice',
                text: 'a'.repeat(281),
            })
            fixture.thenErrorShouldBeThrown(MessageTooLongError)
        })
    })

    describe('Rule: an empty message is not allowed', () => {
        test('Alice cannot post an empty message', () => {
            fixture.givenNowIs(new Date('2024-03-20T10:00:00Z'))
            fixture.whenUserPostsMessage({
                messageId: 'message-1',
                userId: 'Alice',
                text: '',
            })
            fixture.thenErrorShouldBeThrown(EmptyMessageError)
        })
    })
})

function createFixture() {
    let thrownError: Error

    const messageRepository = new LocalMessageRepository()
    const dateProvider = new LocalDateProvider()
    const postMessageUseCase = new PostMessageUseCase(
        messageRepository,
        dateProvider
    )

    return {
        givenNowIs: (date: Date) => {
            dateProvider.setDate(date)
        },
        whenUserPostsMessage: (postMessageCommand: PostMessageCommand) => {
            try {
                postMessageUseCase.handle(postMessageCommand)
            } catch(error) {
                thrownError = error
            }
        },
        thenMessageShouldBePosted: (expectedMessage: Message) => {
            expect(expectedMessage).toEqual(messageRepository.message)
        },
        thenErrorShouldBeThrown: (classError: new () => Error)=> {
            expect(thrownError).toBeInstanceOf(classError)
        }
    }
}