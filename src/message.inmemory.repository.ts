import { Message } from "./message";
import { MessageRepository } from "./message.repository";

export class InMemoryMessageRepository implements MessageRepository {
  getById(messageId: string): Promise<Message> {
    return Promise.resolve(this.getMessageById(messageId));
  }
  messages = new Map<string, Message>();
  save(msg: Message): Promise<void> {
    this._save(msg);
    return Promise.resolve();
  }
  getAllOfUser(user: string): Promise<Message[]> {
    return Promise.resolve(
      [...this.messages.values()]
        .filter((message) => message.author === user)
        .map((m) => ({
          id: m.id,
          author: m.author,
          text: m.text,
          publishedAt: m.publishedAt,
        }))
    );
  }

  getMessageById(id: string) {
    return this.messages.get(id)!;
  }

  givenExistingMessages(messages: Message[]) {
    messages.forEach(this._save.bind(this));
  }

  private _save(msg: Message) {
    this.messages.set(msg.id, msg);
  }
}
