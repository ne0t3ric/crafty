import {MessageRepository} from "./MessageRepository";
import {Message} from "./Message";
import * as fs from "fs";

export class FileSystemMessageRepository implements MessageRepository {
    path = 'tmp/messages.json'

    constructor(){
        if (!this.fileExists()){
            this.writeMessages([])
        }
    }

    async update(message: Pick<Message, "messageId"> & Partial<Message>): Promise<void> {
        const messageId = message.messageId
        const messages = this.readMessages()
        const existingMessage = await this.get(messageId)
        if (!existingMessage) {
            throw new Error('Message not found')
        }

        const index = messages.findIndex((msg: Message) => msg.messageId === messageId)
        messages[index] = {
            ...existingMessage,
            ...message
        }

        this.writeMessages(messages)
    }

    private fileExists(): boolean {
        return fs.existsSync(this.path)
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

    private readMessages(): Message[] {
        const stringifiedJson = fs.readFileSync(this.path, 'utf-8')

        return stringifiedJson ? JSON.parse(stringifiedJson) : []
    }

    private writeMessages(messages: Message[]): void {
        fs.writeFileSync(this.path, JSON.stringify(messages))
    }
}