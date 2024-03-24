import {createUserFixture, UserFixture} from "./user.fixture";
import {LocalUserRepository} from "../infrastructure/LocalUserRepository";

let fixture: UserFixture;

beforeEach(() => {
    fixture = createUserFixture(new LocalUserRepository())
})

describe("Feature: Following a user", () => {

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

