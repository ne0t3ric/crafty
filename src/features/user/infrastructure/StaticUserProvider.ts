import { User } from "../domain/User";
import {UserProvider} from "../domain/UserProvider";

export class StaticUserProvider implements UserProvider {
    user: User
    getUser(): User {
        if(!this.user) throw new Error('No current user')

        return this.user
    }
    setUser(user: User): void {
        this.user = user
    }

}