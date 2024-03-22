import {FileSystemMessageRepository} from "../FileSystemMessageRepository";
import * as fs from "fs";
import {Message} from "../../domain/Message";
import {MessageText} from "../../domain/MessageText";

let fixture: ReturnType<typeof createFixture>
beforeEach(() => {
  fixture = createFixture()
})
describe('FileSystemMessageRepository', () => {
    describe('Handling file', () => {
        test('Should create a new file if it does not exist', () => {
            fixture.givenFileSystemPath('tmp/messages.json')
            fixture.givenFileDoesntExists()
            fixture.whenRepositoryIsCreated()
            fixture.thenFileShouldBeCreated()
        })

        test('Should create a new file when other path is defined', () => {
            fixture.givenFileSystemPath('tmp/messages.json')
            fixture.givenFileDoesntExists()
            fixture.whenRepositoryIsCreated()

            fixture.givenFileSystemPath('tmp/other-messages.json')
            fixture.thenFileShouldBeCreated()
        })
    })

    describe('Saving one message', () => {
        test('Should save a message', async () => {
            fixture.givenFileSystemPath('tmp/messages.json')
            await fixture.whenRepositorySaveMessage({
                messageId: 'message-1',
                userId: 'Alice',
                text: MessageText.of('Hello World'),
                date: new Date('2024-03-20T10:00:00Z')
            })
            await fixture.thenRepositoryShouldHaveMessage({
                messageId: 'message-1',
                userId: 'Alice',
                text: MessageText.of('Hello World'),
                date: new Date('2024-03-20T10:00:00Z')
            })
        })
    })
})

function createFixture(){
    let givenPath: string
    let fsRepository: FileSystemMessageRepository
    return {
        givenFileSystemPath: (path: string) => {
            givenPath = path
        },
        givenFileDoesntExists: () => {
          fs.unlinkSync(givenPath)
        },
        whenRepositoryIsCreated: () => {
            fsRepository = new FileSystemMessageRepository(givenPath)
        },
        whenRepositorySaveMessage: async (message: Message) => {
            fsRepository = fsRepository || new FileSystemMessageRepository(givenPath)
            await fsRepository.save(message)
        },
        thenRepositoryShouldHaveMessage: async(message: Message) => {
          const messageInRepo = await fsRepository.get(message.messageId)
          expect(messageInRepo).toEqual(message)
        },
        thenFileShouldBeCreated: () => {
            const filePath = fsRepository.getPath()
            expect(fs.existsSync(filePath)).toBe(true)
        }
    }
}