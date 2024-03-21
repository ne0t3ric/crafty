import {MessageText} from "./MessageText";

export type Message = {
    messageId: string
    userId: string
    text: MessageText
    date: Date
}
