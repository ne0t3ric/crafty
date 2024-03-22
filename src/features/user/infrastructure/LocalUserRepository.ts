import {UserRepository} from "../domain/UserRepository";
import {User} from "../domain/User";
import {UserNotFoundError} from "../domain/UserNotFoundError";

export class LocalUserRepository implements UserRepository {
    users: User[] = []

    async getById(userId: string) {
        const foundUser = this.users.find(u => u.id === userId)
        if (!foundUser) {
            throw new UserNotFoundError
        }

        return foundUser
    }

    async save(user: User) {
        const foundUserIndex = this.users.findIndex(u => u.id === user.id)
        if (foundUserIndex < 0) {
            this.users.push(user)
        } else {
            const updatedUser = {
                ...this.users[foundUserIndex],
                ...user
            }
            this.users[foundUserIndex] = updatedUser
        }
    }
}