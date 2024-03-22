#!/usr/bin/env node

import { Command } from 'commander';
import {PostMessageCommand} from "./src/features/messaging/application/PostMessageCommand";
import {PostMessageUseCase} from "./src/features/messaging/application/PostMessageUseCase";
import {LocalDateProvider} from "./src/features/messaging/infrastructure/LocalDateProvider";
import {FileSystemMessageRepository} from "./src/features/messaging/infrastructure/FileSystemMessageRepository";
import {ViewTimelineUseCase} from "./src/features/messaging/application/ViewTimelineUseCase";
import {EditMessageUserCase} from "./src/features/messaging/application/EditMessageUserCase";
import {UserProvider} from "./src/features/user/domain/UserProvider";
import {StaticUserProvider} from "./src/features/user/infrastructure/StaticUserProvider";

function generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const program = new Command();
program.version('1.0.0')
program.name('crafty')
program.addCommand(
    new Command('post')
        .description('Post a message')
        .argument('<message>', 'message to post')
        .argument('<user>', 'user that posts the message')
        .action(async (message, user) => {
            const messageId = generateId()
            const postMessageCommand: PostMessageCommand = {
                messageId,
                text: message,
            }
            const messageRepository = new FileSystemMessageRepository()
            const dateProvider = new LocalDateProvider()
            const userProvider: UserProvider = new StaticUserProvider()
            userProvider.setUser({id: user})
            const postMessageUseCase = new PostMessageUseCase(
                messageRepository,
                dateProvider,
                userProvider
            )

            try {
                await postMessageUseCase.handle(postMessageCommand)
                const messagePosted = await messageRepository.get(messageId)
                console.log('✅ Message posted', messagePosted)
            } catch(error) {
                console.error('❌ Error', error)
            }
        })
)

program.addCommand(
    new Command('view')
        .description('View messaging of a user')
        .argument('<user>', 'user to view messaging of')
        .action(async (user) => {
            const messageRepository = new FileSystemMessageRepository()
            const dateProvider = new LocalDateProvider()

            const viewTimelineUseCase = new ViewTimelineUseCase(
                messageRepository,
                dateProvider
            )

            const timeline = await viewTimelineUseCase.handle(user)
            console.table(timeline)
        })
)

program.addCommand(
    new Command('edit')
        .description('Edit message as specific user')
        .argument('<messageId>', 'message to edit')
        .argument('<userId>', 'user that edits the message')
        .argument('<text>', 'new text')
        .action(async (messageId, userId, text) => {
            const messageRepository = new FileSystemMessageRepository()
            const dateProvider = new LocalDateProvider()
            const userProvider: UserProvider = {
                getUser: () => {
                    return {id: userId }
                },
                setUser: () => {}
            }

            const editMessageUserCase = new EditMessageUserCase(
                messageRepository,
                dateProvider,
                userProvider
            )
            const inputMessage = {
                messageId,
                text,
            }
            await editMessageUserCase.handle(inputMessage)
            const message = await messageRepository.get(inputMessage.messageId)
            console.table(message)
        })
)


async function main() {
    await program.parseAsync(process.argv);
}

main()