type Message = {
    messageId: string
    userId: string
    text: string
    date: Date
}

let now = new Date()
let message: Message
function givenNowIs(date: Date) {
    now = date
}

function whenUserPostsMessage(postMessageCommand: Message) {
    message = postMessageCommand
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
                date: now
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