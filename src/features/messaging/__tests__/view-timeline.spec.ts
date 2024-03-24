import {createMessageFixture, MessageFixture} from "./message.fixture";
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

describe('Feature: Viewing a personal timeline', () => {
    describe('Rule: Messages of a user are shown in reverse order by date', () => {
        test('Alice can view her two messaging on her timeline', async () => {
            await fixture.givenMessages([
                Message.from({
                    // from Alice
                    messageId: 'message-1',
                    userId: 'Alice',
                    text: 'Hello World',
                    date: '2024-03-20T10:00:00Z'
                }),
                // from Bob
                Message.from({
                    messageId: 'message-2',
                    userId: 'Bob',
                    text: 'I am bob',
                    date: '2024-03-20T10:01:00Z'
                }),
                // from Alive
                Message.from({
                    messageId: 'message-3',
                    userId: 'Alice',
                    text: 'Wassup',
                    date: '2024-03-20T12:00:00Z'
                })
            ])
            fixture.givenNowIs(new Date('2024-03-20T12:00:00Z'))
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