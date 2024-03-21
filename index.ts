#!/usr/bin/env node

import { Command } from 'commander';
import {PostMessageCommand} from "./src/PostMessageCommand";
import {LocalMessageRepository} from "./src/LocalMessageRepository";
import {PostMessageUseCase} from "./src/PostMessageUseCase";
import {LocalDateProvider} from "./src/LocalDateProvider";

const program = new Command();
program.version('1.0.0')
program.name('crafty')
program.addCommand(
    new Command('post')
        .description('Post a message')
        .argument('<message>', 'message to post')
        .argument('<user>', 'user that posts the message')
        .action((message, user) => {
            const postMessageCommand: PostMessageCommand = {
                messageId: 'message-1',
                userId: user,
                text: message,
            }
            const messageRepository = new LocalMessageRepository()
            const dateProvider = new LocalDateProvider()
            const postMessageUseCase = new PostMessageUseCase(messageRepository, dateProvider)

            try {
                postMessageUseCase.handle(postMessageCommand)
                console.log('✅ Message posted', messageRepository.message)
            } catch(error) {
                console.error('❌ Error', error)
            }
        })
)

async function main() {
    await program.parseAsync(process.argv);
}

main()