import {MessageRepository} from "./MessageRepository";
import {Message} from "./Message";
import * as fs from "fs";

export class FileSystemMessageRepository implements MessageRepository {
    path = 'tmp/messages.json'

    constructor(){
        if (!fs.existsSync(this.path)){
            fs.writeFileSync(this.path, '[]')
        }
    }

    async save(msg: Message): Promise<void> {
        const messagesString = fs.readFileSync(this.path, 'utf-8')
        const messages = JSON.parse(messagesString)
        messages.push(msg)

        // save message to file system
        fs.writeFileSync(this.path, JSON.stringify(messages))
    }

    async get(messageId: string): Promise<Message> {
        const messagesString = fs.readFileSync(this.path, 'utf-8')
        const messages = JSON.parse(messagesString)
        const foundMessage = messages.find((msg: Message) => msg.messageId === messageId)
        if (!foundMessage) {
            throw new Error('Message not found')
        }
        return foundMessage
    }
}