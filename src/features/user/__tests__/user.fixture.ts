import {UserRepository} from "../domain/UserRepository";
import {LocalUserRepository} from "../infrastructure/LocalUserRepository";
import {FollowUserCommand} from "../application/FollowUserCommand";
import {FollowUserUseCase} from "../application/FollowUserUseCase";

export const createUserFixture = () => {
    const userRepository: UserRepository = new LocalUserRepository()
    return {
        async givenUserFollowees({
                                     user,
                                     followees,
                                 }: {
            user: string
            followees: string[]
        }) {
            await userRepository.save({id: user, followees: followees})
        },
        async whenUserFollows(followCommand: FollowUserCommand) {
            const followUserUseCase = new FollowUserUseCase(
                userRepository
            )
            followUserUseCase.handle(followCommand)
        },
        async thenUserFolloweesAre(expectedUserFollowees: {
            user: string;
            followees: string[];
        }) {
            const user = await userRepository.getById(expectedUserFollowees.user)
            const followeesOfUser = user.followees

            expect(followeesOfUser).toEqual(expect.arrayContaining(expectedUserFollowees.followees))
        },
    };
};
export type UserFixture = ReturnType<typeof createUserFixture>;