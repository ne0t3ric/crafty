import {PostMessageUseCase} from "../PostMessageUseCase";
import {Message} from "../Message";
import {PostMessageCommand} from "../PostMessageCommand";

let now = new Date()
let message: Message
const saveMessageCallback = (msg: Message) => {
    message = msg
}

const getDateCallback = () => {
    return now
}

let postMessageUseCase = new PostMessageUseCase(
    saveMessageCallback,
    getDateCallback
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
    // describe('Rule: a message can contains maximum 280 characters', () => {
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
    // })
})