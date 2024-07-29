import { EmptyMessageError, MessageText, MessageTooLongError } from "./message";
import { MessageRepository } from "./message.repository";

export type EditMessageCommand = {
  messageId: string;
  text: string;
};

export class EditMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}
  async handle(editMessageCommande: EditMessageCommand) {
    const messageText = MessageText.of(editMessageCommande.text);
    const message = await this.messageRepository.getById(
      editMessageCommande.messageId
    );
    const editedMessage = {
      ...message,
      text: messageText,
    };
    await this.messageRepository.save(editedMessage);
  }
}
