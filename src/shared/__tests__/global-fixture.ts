import {LocalMessageRepository} from "../../features/messaging/infrastructure/LocalMessageRepository";
import {LocalUserRepository} from "../../features/user/infrastructure/LocalUserRepository";
import {LocalDateProvider} from "../../features/messaging/infrastructure/LocalDateProvider";

export const globalFixture = {
    messageRepository: new LocalMessageRepository(),
    userRepository: new LocalUserRepository(),
    dataProvider: new LocalDateProvider()
}