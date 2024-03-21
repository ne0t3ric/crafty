import {createMessageFixture, MessageFixture} from "./message.fixture";
import {MessageTooLongError} from "../MessageTooLongError";
import {EmptyMessageError} from "../EmptyMessageError";
import {MessageText} from "../MessageText";

let fixture: MessageFixture

beforeEach(() => {
    fixture = createMessageFixture()
})
describe('Feature: Posting a message', () => {
    describe('Rule: a message can contains maximum 280 characters', () => {
        test('Alice can post a message on her timeline', async () => {
            fixture.givenNowIs(new Date('2024-03-20T10:00:00Z'))
            await fixture.whenUserPostsMessage({
                messageId: 'message-1',
                userId: 'Alice',
                text: 'Hello World',
            })
            await fixture.thenMessageShouldBe({
                messageId: 'message-1',
                userId: 'Alice',
                text: MessageText.of('Hello World'),
                date: new Date('2024-03-20T10:00:00Z')
            })
        })

        test('Alice cannot post a message with more than 280 characters', async () => {
            fixture.givenNowIs(new Date('2024-03-20T10:00:00Z'))
            await fixture.whenUserPostsMessage({
                messageId: 'message-1',
                userId: 'Alice',
                text: 'a'.repeat(281),
            })
            fixture.thenErrorShouldBeThrown(MessageTooLongError)
        })
    })

    describe('Rule: an empty message is not allowed', () => {
        test('Alice cannot post an empty message', async () => {
            fixture.givenNowIs(new Date('2024-03-20T10:00:00Z'))
            await fixture.whenUserPostsMessage({
                messageId: 'message-1',
                userId: 'Alice',
                text: '',
            })
            fixture.thenErrorShouldBeThrown(EmptyMessageError)
        })
    })
})