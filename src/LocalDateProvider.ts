import {DateProvider} from "./DateProvider";

export class LocalDateProvider implements DateProvider {
    private date: Date = new Date()
    getDate(): Date {
        return this.date
    }

    setDate(date: Date) {
        this.date = date
    }
}