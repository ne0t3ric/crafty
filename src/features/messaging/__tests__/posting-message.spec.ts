import {createMessageFixture, MessageFixture} from "./message.fixture";
import {MessageTooLongError} from "../domain/MessageTooLongError";
import {EmptyMessageError} from "../domain/EmptyMessageError";
import {Message} from "../domain/Message";
import {LocalMessageRepository} from "../infrastructure/LocalMessageRepository";
import {LocalDateProvider} from "../infrastructure/LocalDateProvider";

let fixture: MessageFixture

beforeEach(() => {
    fixture = createMessageFixture(
        new LocalMessageRepository(),
        new LocalDateProvider()
    )
})
describe('Feature: Posting a message', () => {
    describe('Rule: a message can contains maximum 280 characters', () => {
        test('Alice can post a message on her timeline', async () => {
            fixture.givenNowIs(new Date('2024-03-20T10:00:00Z'))
            fixture.givenUserIs('Alice')
            await fixture.whenUserPostsMessage({
                messageId: 'message-1',
                text: 'Hello World',
            })
            await fixture.thenMessageShouldBe(Message.from({
                messageId: 'message-1',
                userId: 'Alice',
                text: 'Hello World',
                date: '2024-03-20T10:00:00Z'
            }))
        })

        test('Alice cannot post a message with more than 280 characters', async () => {
            fixture.givenNowIs(new Date('2024-03-20T10:00:00Z'))
            fixture.givenUserIs('Alice')
            await fixture.whenUserPostsMessage({
                messageId: 'message-1',
                text: 'a'.repeat(281),
            })
            fixture.thenErrorShouldBeThrown(MessageTooLongError)
        })
    })

    describe('Rule: an empty message is not allowed', () => {
        test('Alice cannot post an empty message', async () => {
            fixture.givenNowIs(new Date('2024-03-20T10:00:00Z'))
            fixture.givenUserIs('Alice')
            await fixture.whenUserPostsMessage({
                messageId: 'message-1',
                text: '',
            })
            fixture.thenErrorShouldBeThrown(EmptyMessageError)
        })
    })
})