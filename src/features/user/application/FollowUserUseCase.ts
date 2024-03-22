import {UserRepository} from "../domain/UserRepository";
import {FollowUserCommand} from "./FollowUserCommand";

export class FollowUserUseCase {
    constructor(private userRepository: UserRepository) {
    }

    async handle(followUserCommand: FollowUserCommand) {
        const user = await this.userRepository.getById(followUserCommand.user)

        user.followees.push(followUserCommand.userToFollow)

        await this.userRepository.save(user)
    }
}