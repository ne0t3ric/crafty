import {PostMessageUseCase} from "../PostMessageUseCase";
import {Message} from "../Message";
import {PostMessageCommand} from "../PostMessageCommand";
import {MessageRepository} from "../MessageRepository";
import {DateProvider} from "../DateProvider";

let now = new Date()
let message: Message

class LocalRepository implements MessageRepository{
    save(m: Message) {
        message = m
    }
}

class StubNowDateProvider implements DateProvider{
    getDate(): Date {
        return now
    }
}

const messageRepository = new LocalRepository()
const dateProvider = new StubNowDateProvider()

let postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
)

function givenNowIs(date: Date) {
    now = date
}

function whenUserPostsMessage(postMessageCommand: PostMessageCommand) {
    postMessageUseCase.handle(postMessageCommand)
}

function thenMessageShouldBePosted(expectedMessage: Message) {
    expect(expectedMessage).toEqual(message)
}

describe('Feature: Posting a message', () => {
    describe('Rule: a message can contains maximum 280 characters', () => {
        test('Alice can post a message on her timeline', () => {
            givenNowIs(new Date('2024-03-20T10:00:00Z'))
            whenUserPostsMessage({
                messageId: 'message-1',
                userId: 'Alice',
                text: 'Hello World',
            })
            thenMessageShouldBePosted({
                messageId: 'message-1',
                userId: 'Alice',
                text: 'Hello World',
                date: new Date('2024-03-20T10:00:00Z')
            })
        })
    })
})