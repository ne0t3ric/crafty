#!/usr/bin/env node

import { Command } from 'commander';
import {PostMessageCommand} from "./src/PostMessageCommand";
import {PostMessageUseCase} from "./src/PostMessageUseCase";
import {LocalDateProvider} from "./src/LocalDateProvider";
import {FileSystemMessageRepository} from "./src/FileSystemMessageRepository";

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
                userId: user,
                text: message,
            }
            const messageRepository = new FileSystemMessageRepository()
            const dateProvider = new LocalDateProvider()
            const postMessageUseCase = new PostMessageUseCase(messageRepository, dateProvider)

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
        .description('View messages of a user')
        .argument('<user>', 'user to view messages of')
        .action(async (user) => {
            const messageRepository = new FileSystemMessageRepository()
            const messages = await messageRepository.getByUser(user)
            console.table(messages)
        })
)

async function main() {
    await program.parseAsync(process.argv);
}

main()