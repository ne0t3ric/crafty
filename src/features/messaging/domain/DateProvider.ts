export interface DateProvider {
    getDate(): Date
    setDate(date: Date): void
}