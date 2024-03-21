#!/usr/bin/env node

import { Command } from 'commander';
import {PostMessageCommand} from "./src/PostMessageCommand";
import {PostMessageUseCase} from "./src/PostMessageUseCase";
import {LocalDateProvider} from "./src/LocalDateProvider";
import {FileSystemMessageRepository} from "./src/FileSystemMessageRepository";

const program = new Command();
program.version('1.0.0')
program.name('crafty')
program.addCommand(
    new Command('post')
        .description('Post a message')
        .argument('<message>', 'message to post')
        .argument('<user>', 'user that posts the message')
        .action(async (message, user) => {
            const postMessageCommand: PostMessageCommand = {
                messageId: 'message-1',
                userId: user,
                text: message,
            }
            const messageRepository = new FileSystemMessageRepository()
            const dateProvider = new LocalDateProvider()
            const postMessageUseCase = new PostMessageUseCase(messageRepository, dateProvider)

            try {
                await postMessageUseCase.handle(postMessageCommand)
                const messagePosted = await messageRepository.get('message-1')
                console.log('✅ Message posted', messagePosted)
            } catch(error) {
                console.error('❌ Error', error)
            }
        })
)

async function main() {
    await program.parseAsync(process.argv);
}

main()