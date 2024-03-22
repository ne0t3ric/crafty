import {MessageText} from "./MessageText";

export type MessageProps = {
    messageId: string
    userId: string
    text: MessageText
    date: Date
}

export type MessageDTO = {
    messageId: string
    userId: string
    text: string
    date: string
}

export class Message {
    private constructor(private props: MessageProps) {}

    static from(dto: MessageDTO){
        const props = {
            messageId: dto.messageId,
            userId: dto.userId,
            text: MessageText.of(dto.text),
            date: new Date(dto.date)
        }
        return new Message(props)
    }

    get messageId(){
        return this.props.messageId
    }

    set messageId(id: string){
        this.props.messageId = id
    }

    get userId(){
        return this.props.userId
    }

    get text(){
        return this.props.text.value
    }

    set text(_text: string){
        this.props.text = MessageText.of(_text)
    }

    get date(){
        return this.props.date.toString()
    }

    set date(strDate: string){
        this.props.date = new Date(strDate)
    }

    isOlder(otherMessage: Message){
        const thisMessageDate = this.props.date
        const otherMessageDate = new Date(otherMessage.date)

        return thisMessageDate.getTime() < otherMessageDate.getTime()
    }
}