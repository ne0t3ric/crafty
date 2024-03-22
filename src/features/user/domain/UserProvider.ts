import {User} from "./User";

export interface UserProvider {
    getUser(): User
    setUser(user: User): void
}