import {createMessageFixture, MessageFixture} from "./message.fixture";
import {MessageTooLongError} from "../MessageTooLongError";
import {EmptyMessageError} from "../EmptyMessageError";
import {AuthorizationError} from "../AuthorizationError";

let fixture: MessageFixture
beforeEach(() => {
    fixture = createMessageFixture()
})
describe('Feature: Editing a message', () => {
    describe('Rule: a edited message can contains maximum 280 characters', () => {
        test('Alice can edit one of her message', async () => {
            await fixture.givenMessages([{
                messageId: 'message-1',
                userId: 'Alice',
                text: 'Hello World',
                date: new Date('2024-03-20T10:00:00Z')
            }])
            fixture.givenUserIs({id: 'Alice'})
            fixture.givenNowIs(new Date('2024-03-20T10:00:00Z'))

            await fixture.whenUserEditMessage({
                messageId: 'message-1',
                text: 'Hello World, I am Alive',
            })
            await fixture.thenMessageShouldBe({
                messageId: 'message-1',
                userId: 'Alice',
                text: 'Hello World, I am Alive',
                date: new Date('2024-03-20T10:00:00Z')
            })
        })

        test('Alice cannot edit a message with more than 280 characters', async () => {
            await fixture.givenMessages([{
                messageId: 'message-1',
                userId: 'Alice',
                text: 'Hello World',
                date: new Date('2024-03-20T10:00:00Z')
            }])
            fixture.givenUserIs({id: 'Alice'})
            fixture.givenNowIs(new Date('2024-03-20T10:00:00Z'))

            await fixture.whenUserEditMessage({
                messageId: 'message-1',
                text: 'a'.repeat(281),
            })
            fixture.thenErrorShouldBeThrown(MessageTooLongError)
            await fixture.thenMessageShouldBe({
                messageId: 'message-1',
                userId: 'Alice',
                text: 'Hello World',
                date: new Date('2024-03-20T10:00:00Z')
            })
        })

        test('Alice cannot edit a message with 0 characters', async () => {
            await fixture.givenMessages([{
                messageId: 'message-1',
                userId: 'Alice',
                text: 'Hello World',
                date: new Date('2024-03-20T10:00:00Z')
            }])
            fixture.givenUserIs({id: 'Alice'})
            fixture.givenNowIs(new Date('2024-03-20T10:00:00Z'))

            await fixture.whenUserEditMessage({
                messageId: 'message-1',
                text: '',
            })
            fixture.thenErrorShouldBeThrown(EmptyMessageError)
            await fixture.thenMessageShouldBe({
                messageId: 'message-1',
                userId: 'Alice',
                text: 'Hello World',
                date: new Date('2024-03-20T10:00:00Z')
            })
        })

        test('Alice cannot edit a message from Bob', async () => {
            await fixture.givenMessages([{
                messageId: 'message-1',
                userId: 'Bob',
                text: 'Hello World',
                date: new Date('2024-03-20T10:00:00Z')
            }])
            fixture.givenUserIs({id: 'Alice'})
            fixture.givenNowIs(new Date('2024-03-20T12:00:00Z'))

            await fixture.whenUserEditMessage({
                messageId: 'message-1',
                text: 'Hello World, I am Alive',
            })
            fixture.thenErrorShouldBeThrown(AuthorizationError)
            await fixture.thenMessageShouldBe({
                messageId: 'message-1',
                userId: 'Bob',
                text: 'Hello World',
                date: new Date('2024-03-20T10:00:00Z')
            })
        })
    })
})