import {UserRepository} from "../domain/UserRepository";
import {FollowUserCommand} from "../application/FollowUserCommand";
import {FollowUserUseCase} from "../application/FollowUserUseCase";
import {LocalUserRepository} from "../infrastructure/LocalUserRepository";

describe("Feature: Following a user", () => {
    let fixture: Fixture;

    beforeEach(() => {
        fixture = createFixture();
    });
    test("Alice can follow Bob", async () => {
        await fixture.givenUserFollowees({
            user: "Alice",
            followees: ["Charlie"],
        });

        await fixture.whenUserFollows({
            user: "Alice",
            userToFollow: "Bob",
        });

        await fixture.thenUserFolloweesAre({
            user: "Alice",
            followees: ["Charlie", "Bob"],
        });
    });
});

const createFixture = () => {
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

type Fixture = ReturnType<typeof createFixture>;
