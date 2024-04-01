import {MessageRepository} from "../domain/MessageRepository";
import {Message} from "../domain/Message";
import * as fs from "fs";

export class FileSystemMessageRepository implements MessageRepository {

    constructor(protected path: string = 'tmp/messaging.json') {
        this.setPath(path)
    }

    getPath() {
        return this.path
    }

    setPath(path: string) {
        this.path = path
        if (!this.fileExists()) {
            this.writeMessages([])
        }
    }

    deletePath() {
        fs.unlinkSync(this.path)
    }

    async update(message: Pick<Message, "messageId"> & Partial<Message>): Promise<void> {
        const messageId = message.messageId
        const messages = this.readMessages()
        const existingMessage = await this.get(messageId)
        if (!existingMessage) {
            throw new Error('Message not found')
        }

        const index = messages.findIndex((msg: Message) => msg.messageId === messageId)

        const messageInRepo = messages[index]
        messageInRepo.text = message.text

        this.writeMessages(messages)
    }

    async getByUser(userId: string): Promise<Message[]> {
        const messages = this.readMessages()
        return messages.filter((msg: Message) => msg.userId === userId)
    }

    async save(msg: Message): Promise<void> {
        const messages = this.readMessages()
        messages.push(msg)

        this.writeMessages(messages)
    }

    async get(messageId: string): Promise<Message> {
        const messages = this.readMessages()
        const foundMessage = messages.find((msg: Message) => msg.messageId === messageId)
        if (!foundMessage) {
            throw new Error('Message not found')
        }
        return foundMessage
    }

    private fileExists(): boolean {
        return fs.existsSync(this.path)
    }

    private readMessages(): Message[] {
        const stringifiedJson = fs.readFileSync(this.path, 'utf-8')

        return stringifiedJson ? JSON.parse(stringifiedJson).map(m => {
            return Message.from({
                messageId: m.messageId,
                userId: m.userId,
                text: m.text,
                date: m.date
            })
        }) : []
    }

    private writeMessages(messages: Message[]): void {
        fs.writeFileSync(this.path, JSON.stringify(messages.map(m => {
            return {
                messageId: m.messageId,
                userId: m.userId,
                text: m.text,
                date: m.date.toString()
            }
        })))
    }
}