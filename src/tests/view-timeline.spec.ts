import {createMessageFixture, MessageFixture} from "./message.fixture";

let fixture: MessageFixture

beforeEach(() => {
    fixture = createMessageFixture()
})

describe('Feature: Viewing a personal timeline', () => {
    describe('Rule: Messages of a user are shown in reverse order by date', () => {
        test('Alice can view her two messages on her timeline', async () => {
            await fixture.givenMessages([
                {
                // from Alive
                    messageId: 'message-1',
                    userId: 'Alice',
                    text: 'Hello World',
                    date: new Date('2024-03-20T10:00:00Z')
                },
                // from Bob
                {
                    messageId: 'message-2',
                    userId: 'Bob',
                    text: 'I am bob',
                    date: new Date('2024-03-20T10:01:00Z')
                },
                // from Alive
                {
                    messageId: 'message-3',
                    userId: 'Alice',
                    text: 'Wassup',
                    date: new Date('2024-03-20T12:00:00Z')
                }
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