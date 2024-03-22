import {MessageTooLongError} from "./MessageTooLongError";
import {EmptyMessageError} from "./EmptyMessageError";

export class MessageText {
    private constructor(readonly value: string) {}

    static of(text: string): MessageText {
        if (text.length > 280) {
            throw new MessageTooLongError()
        }

        if (text.length === 0) {
            throw new EmptyMessageError()
        }

        return new MessageText(text)
    }
}